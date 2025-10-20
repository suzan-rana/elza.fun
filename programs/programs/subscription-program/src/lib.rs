use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("SubProg111111111111111111111111111111111111");

#[program]
pub mod subscription_program {
    use super::*;

    /// Initialize a subscription plan
    pub fn initialize_subscription(
        ctx: Context<InitializeSubscription>,
        plan_id: u64,
        amount: u64,
        interval_seconds: u64,
        max_payments: Option<u32>,
    ) -> Result<()> {
        let subscription = &mut ctx.accounts.subscription;
        subscription.plan_id = plan_id;
        subscription.merchant = ctx.accounts.merchant.key();
        subscription.customer = ctx.accounts.customer.key();
        subscription.amount = amount;
        subscription.interval_seconds = interval_seconds;
        subscription.next_payment_due = Clock::get()?.unix_timestamp as u64 + interval_seconds;
        subscription.total_payments = 0;
        subscription.max_payments = max_payments;
        subscription.is_active = true;
        subscription.created_at = Clock::get()?.unix_timestamp as u64;
        
        Ok(())
    }

    /// Process a subscription payment
    pub fn process_payment(ctx: Context<ProcessPayment>) -> Result<()> {
        let subscription = &mut ctx.accounts.subscription;
        
        // Check if subscription is active and payment is due
        require!(subscription.is_active, ErrorCode::SubscriptionInactive);
        require!(
            Clock::get()?.unix_timestamp as u64 >= subscription.next_payment_due,
            ErrorCode::PaymentNotDue
        );

        // Check if max payments reached
        if let Some(max) = subscription.max_payments {
            require!(subscription.total_payments < max, ErrorCode::MaxPaymentsReached);
        }

        // Transfer tokens from customer to merchant
        let cpi_accounts = Transfer {
            from: ctx.accounts.customer_token_account.to_account_info(),
            to: ctx.accounts.merchant_token_account.to_account_info(),
            authority: ctx.accounts.customer.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, subscription.amount)?;

        // Update subscription state
        subscription.total_payments += 1;
        subscription.next_payment_due += subscription.interval_seconds;
        subscription.last_payment_at = Clock::get()?.unix_timestamp as u64;

        emit!(PaymentProcessed {
            subscription: subscription.key(),
            amount: subscription.amount,
            payment_number: subscription.total_payments,
        });

        Ok(())
    }

    /// Cancel a subscription
    pub fn cancel_subscription(ctx: Context<CancelSubscription>) -> Result<()> {
        let subscription = &mut ctx.accounts.subscription;
        subscription.is_active = false;
        subscription.cancelled_at = Some(Clock::get()?.unix_timestamp as u64);

        emit!(SubscriptionCancelled {
            subscription: subscription.key(),
            cancelled_at: subscription.cancelled_at.unwrap(),
        });

        Ok(())
    }

    /// Pause a subscription
    pub fn pause_subscription(ctx: Context<PauseSubscription>) -> Result<()> {
        let subscription = &mut ctx.accounts.subscription;
        subscription.is_paused = true;
        subscription.paused_at = Some(Clock::get()?.unix_timestamp as u64);

        emit!(SubscriptionPaused {
            subscription: subscription.key(),
            paused_at: subscription.paused_at.unwrap(),
        });

        Ok(())
    }

    /// Resume a paused subscription
    pub fn resume_subscription(ctx: Context<ResumeSubscription>) -> Result<()> {
        let subscription = &mut ctx.accounts.subscription;
        subscription.is_paused = false;
        subscription.next_payment_due = Clock::get()?.unix_timestamp as u64 + subscription.interval_seconds;
        subscription.paused_at = None;

        emit!(SubscriptionResumed {
            subscription: subscription.key(),
            resumed_at: Clock::get()?.unix_timestamp as u64,
        });

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(plan_id: u64)]
pub struct InitializeSubscription<'info> {
    #[account(
        init,
        payer = customer,
        space = 8 + Subscription::INIT_SPACE,
        seeds = [b"subscription", merchant.key().as_ref(), customer.key().as_ref(), &plan_id.to_le_bytes()],
        bump
    )]
    pub subscription: Account<'info, Subscription>,
    
    #[account(mut)]
    pub merchant: Signer<'info>,
    
    #[account(mut)]
    pub customer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ProcessPayment<'info> {
    #[account(
        mut,
        seeds = [b"subscription", subscription.merchant.as_ref(), subscription.customer.as_ref(), &subscription.plan_id.to_le_bytes()],
        bump
    )]
    pub subscription: Account<'info, Subscription>,
    
    #[account(mut)]
    pub customer: Signer<'info>,
    
    #[account(mut)]
    pub customer_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub merchant_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CancelSubscription<'info> {
    #[account(
        mut,
        seeds = [b"subscription", subscription.merchant.as_ref(), subscription.customer.as_ref(), &subscription.plan_id.to_le_bytes()],
        bump
    )]
    pub subscription: Account<'info, Subscription>,
    
    #[account(mut)]
    pub customer: Signer<'info>,
}

#[derive(Accounts)]
pub struct PauseSubscription<'info> {
    #[account(
        mut,
        seeds = [b"subscription", subscription.merchant.as_ref(), subscription.customer.as_ref(), &subscription.plan_id.to_le_bytes()],
        bump
    )]
    pub subscription: Account<'info, Subscription>,
    
    #[account(mut)]
    pub customer: Signer<'info>,
}

#[derive(Accounts)]
pub struct ResumeSubscription<'info> {
    #[account(
        mut,
        seeds = [b"subscription", subscription.merchant.as_ref(), subscription.customer.as_ref(), &subscription.plan_id.to_le_bytes()],
        bump
    )]
    pub subscription: Account<'info, Subscription>,
    
    #[account(mut)]
    pub customer: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Subscription {
    pub plan_id: u64,
    pub merchant: Pubkey,
    pub customer: Pubkey,
    pub amount: u64,
    pub interval_seconds: u64,
    pub next_payment_due: u64,
    pub total_payments: u32,
    pub max_payments: Option<u32>,
    pub is_active: bool,
    pub is_paused: bool,
    pub created_at: u64,
    pub last_payment_at: Option<u64>,
    pub cancelled_at: Option<u64>,
    pub paused_at: Option<u64>,
}

#[event]
pub struct PaymentProcessed {
    pub subscription: Pubkey,
    pub amount: u64,
    pub payment_number: u32,
}

#[event]
pub struct SubscriptionCancelled {
    pub subscription: Pubkey,
    pub cancelled_at: u64,
}

#[event]
pub struct SubscriptionPaused {
    pub subscription: Pubkey,
    pub paused_at: u64,
}

#[event]
pub struct SubscriptionResumed {
    pub subscription: Pubkey,
    pub resumed_at: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Subscription is not active")]
    SubscriptionInactive,
    #[msg("Payment is not due yet")]
    PaymentNotDue,
    #[msg("Maximum payments reached")]
    MaxPaymentsReached,
    #[msg("Subscription is already paused")]
    AlreadyPaused,
    #[msg("Subscription is not paused")]
    NotPaused,
}
