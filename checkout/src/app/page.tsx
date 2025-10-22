import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
          Elza Checkout
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-600">
          A simple, fast, and secure way to sell digital products and subscriptions on Solana.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a
            href="/checkout/demo"
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            View Demo Checkout
          </a>
          <a
            href="https://docs.solana.com/" target="_blank" rel="noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Learn about Solana
          </a>
        </div>
      </section>

      {/* What is Elza */}
      <section className="max-w-5xl mx-auto px-6 py-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-6 bg-white">
          <h2 className="text-xl font-semibold">What is Elza?</h2>
          <p className="mt-3 text-gray-600 text-sm leading-relaxed">
            Elza is a checkout platform that lets creators and businesses sell digital goods, subscriptions,
            and access tokens with a delightful checkout experience. It focuses on conversion, speed, and
            a modern buyer experience while leveraging Solana&apos;s low fees and high throughput.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 p-6 bg-white">
          <h2 className="text-xl font-semibold">Why Solana?</h2>
          <p className="mt-3 text-gray-600 text-sm leading-relaxed">
            Solana offers fast confirmations and negligible fees, making it ideal for commerce. With Elza,
            payments and tokenized entitlements can settle quickly while keeping the buyer experience smooth
            on mobile and desktop.
          </p>
        </div>
      </section>

      {/* What is Elza Checkout */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="rounded-xl border border-gray-200 p-6 bg-white">
          <h2 className="text-xl font-semibold">What is Elza Checkout?</h2>
          <p className="mt-3 text-gray-600 text-sm leading-relaxed">
            Elza Checkout is a hosted payment page you can share with your audience. It bundles product details,
            pricing, and a sleek payment flow. You configure products and pricing in your dashboard; Elza generates
            a unique, human‑readable <span className="font-medium">checkout slug</span> and link that you can share anywhere.
          </p>
          <ul className="mt-4 text-gray-700 text-sm list-disc pl-5 space-y-2">
            <li>Supports one‑time and recurring subscriptions.</li>
            <li>Works on custom domains or elza.fun links.</li>
            <li>Optimized for mobile and desktop buyers.</li>
          </ul>
        </div>
      </section>

      {/* How to use Elza */}
      <section className="max-w-5xl mx-auto px-6 pb-8">
        <div className="rounded-xl border border-gray-200 p-6 bg-white">
          <h2 className="text-xl font-semibold">How to use Elza</h2>
          <ol className="mt-3 text-gray-700 text-sm list-decimal pl-5 space-y-2">
            <li>Create products with name, price, and optional subscription interval.</li>
            <li>Generate a checkout <span className="font-medium">slug</span> (or let Elza auto‑create one).</li>
            <li>Share your checkout link or connect a custom domain.</li>
            <li>Buyers pay with a Solana wallet; you get fast settlement and low fees.</li>
          </ol>
          <div className="mt-5 text-sm text-gray-600">
            Tip: Use <code className="px-1 py-0.5 rounded bg-gray-100">NEXT_PUBLIC_DEFAULT_BASE_CHECKOUT_URL</code> in your app
            to generate shareable links like <code className="px-1 py-0.5 rounded bg-gray-100">https://yourdomain.com/your-checkout-slug</code>.
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 p-6 bg-white">
            <h3 className="text-base font-semibold">Hosted & Fast</h3>
            <p className="mt-2 text-sm text-gray-600">No code required. Share your link and start selling in minutes.</p>
          </div>
          <div className="rounded-xl border border-gray-200 p-6 bg-white">
            <h3 className="text-base font-semibold">One‑time & Recurring</h3>
            <p className="mt-2 text-sm text-gray-600">Sell both one‑off purchases and subscriptions with a single flow.</p>
          </div>
          <div className="rounded-xl border border-gray-200 p-6 bg-white">
            <h3 className="text-base font-semibold">Custom Domains</h3>
            <p className="mt-2 text-sm text-gray-600">Bring your brand using your own domain or subdomain.</p>
          </div>
          <div className="rounded-xl border border-gray-200 p-6 bg-white">
            <h3 className="text-base font-semibold">Low Fees</h3>
            <p className="mt-2 text-sm text-gray-600">Solana&apos;s low fees keep more earnings in your pocket.</p>
          </div>
          <div className="rounded-xl border border-gray-200 p-6 bg-white">
            <h3 className="text-base font-semibold">Mobile‑Optimized</h3>
            <p className="mt-2 text-sm text-gray-600">Beautiful on every device with a conversion‑first design.</p>
          </div>
          <div className="rounded-xl border border-gray-200 p-6 bg-white">
            <h3 className="text-base font-semibold">Secure</h3>
            <p className="mt-2 text-sm text-gray-600">Best practices and reliable infrastructure for peace of mind.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-gray-200 p-6 bg-white">
          <h2 className="text-xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm font-medium">Do buyers need a Solana wallet?</p>
              <p className="mt-1 text-sm text-gray-600">Yes, they&apos;ll connect a wallet like Phantom or Solflare during checkout.</p>
            </div>
            <div>
              <p className="text-sm font-medium">Can I use my own domain?</p>
              <p className="mt-1 text-sm text-gray-600">Yes. Connect a custom domain to host your checkout under your brand.</p>
            </div>
            <div>
              <p className="text-sm font-medium">Does Elza support subscriptions?</p>
              <p className="mt-1 text-sm text-gray-600">Yes. Configure monthly or yearly plans; Elza marks recurring items clearly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer blurb */}
      <footer className="border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center text-xs text-gray-500">
          Built with ❤️ on Solana • Elza Checkout
        </div>
      </footer>
    </div>
  );
}
