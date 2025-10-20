use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use mpl_token_metadata::{
    instructions::{CreateV1, MintV1},
    types::{Creator, PrintSupply},
};

declare_id!("Receipt111111111111111111111111111111111111");

#[program]
pub mod receipt_program {
    use super::*;

    /// Mint an NFT receipt for a purchase
    pub fn mint_receipt(
        ctx: Context<MintReceipt>,
        receipt_id: u64,
        product_name: String,
        amount: u64,
        currency: String,
        metadata_uri: String,
    ) -> Result<()> {
        let receipt = &mut ctx.accounts.receipt;
        receipt.receipt_id = receipt_id;
        receipt.merchant = ctx.accounts.merchant.key();
        receipt.customer = ctx.accounts.customer.key();
        receipt.product_name = product_name.clone();
        receipt.amount = amount;
        receipt.currency = currency;
        receipt.metadata_uri = metadata_uri;
        receipt.minted_at = Clock::get()?.unix_timestamp as u64;
        receipt.is_subscription = false;

        // Transfer payment from customer to merchant
        let cpi_accounts = Transfer {
            from: ctx.accounts.customer_token_account.to_account_info(),
            to: ctx.accounts.merchant_token_account.to_account_info(),
            authority: ctx.accounts.customer.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        emit!(ReceiptMinted {
            receipt: receipt.key(),
            merchant: receipt.merchant,
            customer: receipt.customer,
            amount,
            product_name,
        });

        Ok(())
    }

    /// Mint an NFT receipt for a subscription
    pub fn mint_subscription_receipt(
        ctx: Context<MintSubscriptionReceipt>,
        receipt_id: u64,
        subscription_id: u64,
        product_name: String,
        amount: u64,
        currency: String,
        metadata_uri: String,
    ) -> Result<()> {
        let receipt = &mut ctx.accounts.receipt;
        receipt.receipt_id = receipt_id;
        receipt.merchant = ctx.accounts.merchant.key();
        receipt.customer = ctx.accounts.customer.key();
        receipt.product_name = product_name.clone();
        receipt.amount = amount;
        receipt.currency = currency;
        receipt.metadata_uri = metadata_uri;
        receipt.minted_at = Clock::get()?.unix_timestamp as u64;
        receipt.is_subscription = true;
        receipt.subscription_id = Some(subscription_id);

        // Transfer payment from customer to merchant
        let cpi_accounts = Transfer {
            from: ctx.accounts.customer_token_account.to_account_info(),
            to: ctx.accounts.merchant_token_account.to_account_info(),
            authority: ctx.accounts.customer.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        emit!(SubscriptionReceiptMinted {
            receipt: receipt.key(),
            subscription_id,
            merchant: receipt.merchant,
            customer: receipt.customer,
            amount,
            product_name,
        });

        Ok(())
    }

    /// Update receipt metadata
    pub fn update_receipt_metadata(
        ctx: Context<UpdateReceiptMetadata>,
        new_metadata_uri: String,
    ) -> Result<()> {
        let receipt = &mut ctx.accounts.receipt;
        receipt.metadata_uri = new_metadata_uri;
        receipt.updated_at = Some(Clock::get()?.unix_timestamp as u64);

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(receipt_id: u64)]
pub struct MintReceipt<'info> {
    #[account(
        init,
        payer = customer,
        space = 8 + Receipt::INIT_SPACE,
        seeds = [b"receipt", merchant.key().as_ref(), customer.key().as_ref(), &receipt_id.to_le_bytes()],
        bump
    )]
    pub receipt: Account<'info, Receipt>,
    
    #[account(mut)]
    pub merchant: Signer<'info>,
    
    #[account(mut)]
    pub customer: Signer<'info>,
    
    #[account(mut)]
    pub customer_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub merchant_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(receipt_id: u64, subscription_id: u64)]
pub struct MintSubscriptionReceipt<'info> {
    #[account(
        init,
        payer = customer,
        space = 8 + Receipt::INIT_SPACE,
        seeds = [b"receipt", merchant.key().as_ref(), customer.key().as_ref(), &receipt_id.to_le_bytes()],
        bump
    )]
    pub receipt: Account<'info, Receipt>,
    
    #[account(mut)]
    pub merchant: Signer<'info>,
    
    #[account(mut)]
    pub customer: Signer<'info>,
    
    #[account(mut)]
    pub customer_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub merchant_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateReceiptMetadata<'info> {
    #[account(
        mut,
        seeds = [b"receipt", receipt.merchant.as_ref(), receipt.customer.as_ref(), &receipt.receipt_id.to_le_bytes()],
        bump
    )]
    pub receipt: Account<'info, Receipt>,
    
    #[account(mut)]
    pub merchant: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Receipt {
    pub receipt_id: u64,
    pub merchant: Pubkey,
    pub customer: Pubkey,
    pub product_name: String,
    pub amount: u64,
    pub currency: String,
    pub metadata_uri: String,
    pub minted_at: u64,
    pub updated_at: Option<u64>,
    pub is_subscription: bool,
    pub subscription_id: Option<u64>,
}

#[event]
pub struct ReceiptMinted {
    pub receipt: Pubkey,
    pub merchant: Pubkey,
    pub customer: Pubkey,
    pub amount: u64,
    pub product_name: String,
}

#[event]
pub struct SubscriptionReceiptMinted {
    pub receipt: Pubkey,
    pub subscription_id: u64,
    pub merchant: Pubkey,
    pub customer: Pubkey,
    pub amount: u64,
    pub product_name: String,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Receipt already exists")]
    ReceiptAlreadyExists,
    #[msg("Invalid receipt ID")]
    InvalidReceiptId,
    #[msg("Unauthorized access")]
    Unauthorized,
}
