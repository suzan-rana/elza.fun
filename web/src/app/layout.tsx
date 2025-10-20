import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/providers/WalletProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { OnboardingProvider } from "@/providers/OnboardingProvider";
import { UserProvider } from "@/providers/UserProvider";
import { Sidebar } from "@/components/merchant/Sidebar";
import { UserProfile } from "@/components/UserProfile";
import { OnboardingModal } from "@/components/OnboardingModal";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ConditionalLayout } from '@/components/ConditionalLayout';
import { ToastProvider } from '@/components/ui/simple-toast';

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Elza - Solana Checkout Platform",
  description: "Build checkout links, manage subscriptions, and issue NFT receipts on Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sora.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <WalletContextProvider>
              <AuthProvider>
                <UserProvider>
                  <OnboardingProvider>
                    <ConditionalLayout>
                      {children}
                    </ConditionalLayout>
                  </OnboardingProvider>
                </UserProvider>
              </AuthProvider>
            </WalletContextProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
