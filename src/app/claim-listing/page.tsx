import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Claim Your Listing — FindAPawnShop.com",
  description: "Get featured placement for your pawn shop on FindAPawnShop.com. Bump to the top of your city page, get a highlighted badge, and drive more customers — starting at $29/month.",
};

export default function ClaimListingPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: "#1a2744" }} className="text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Get More Customers From Your Free Listing
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Your pawn shop is already listed on FindAPawnShop.com — the fastest-growing pawn shop directory in the US. Upgrade to featured placement and turn more browsers into buyers.
          </p>
        </div>
      </section>

      {/* Already listed callout */}
      <section style={{ backgroundColor: "#f59e0b" }} className="py-5 px-4 text-center">
        <p className="text-gray-900 font-semibold text-sm sm:text-base">
          ✓ Your listing is already live and free — no signup required to appear in search results
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">

        {/* Free vs Featured */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Free Listing vs. Featured Placement</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Free */}
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="text-lg font-bold text-gray-900 mb-1">Free Listing</div>
              <div className="text-gray-400 text-sm mb-5">Already included</div>
              <ul className="space-y-3 text-sm text-gray-600">
                {[
                  "Appears on your city's pawn shop page",
                  "Shows your address, phone, and rating",
                  "Sorted by number of reviews",
                  "Standard listing style",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">–</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Featured */}
            <div className="border-2 border-amber-400 rounded-xl p-6 relative bg-amber-50">
              <div className="absolute -top-3 left-6">
                <span style={{ backgroundColor: "#f59e0b" }} className="text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                  FEATURED
                </span>
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1">Featured Placement</div>
              <div className="text-gray-500 text-sm mb-5">$29 / month</div>
              <ul className="space-y-3 text-sm text-gray-700">
                {[
                  "Pinned to the top of your city page",
                  "Highlighted with a Featured badge",
                  "Direct link to your website",
                  "Stands out from standard listings",
                  "Cancel anytime",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* How to get started */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">How to Get Started</h2>
          <p className="text-gray-500 text-center mb-10">
            No forms, no account setup — just send us an email and we'll handle the rest.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {[
              { step: "1", title: "Send us an email", desc: "Include the details below and we'll confirm your listing within 1 business day." },
              { step: "2", title: "We verify your shop", desc: "We confirm your listing is live and set up your featured placement." },
              { step: "3", title: "Start getting customers", desc: "Your shop appears at the top of your city page, highlighted for every visitor." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div
                  style={{ backgroundColor: "#1a2744" }}
                  className="w-10 h-10 rounded-full text-white font-bold text-lg flex items-center justify-center mx-auto mb-3"
                >
                  {step}
                </div>
                <div className="font-semibold text-gray-900 mb-1">{title}</div>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>

          {/* What to include */}
          <div className="border border-gray-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">Include the following in your email:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                "Business name (as it appears on your listing)",
                "Owner or manager name",
                "Your email address",
                "Your phone number",
                "City and state",
                "Your shop's website URL (if you have one)",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="mailto:listings@findapawnshop.com"
              style={{ backgroundColor: "#1a2744" }}
              className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity text-base"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email listings@findapawnshop.com
            </a>
            <p className="text-gray-400 text-sm mt-3">We respond within 1 business day</p>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Common Questions</h2>
          <div className="divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
            {[
              {
                q: "Is my shop already listed?",
                a: "Most likely yes — we've indexed thousands of pawn shops across the US from public data. Search for your city on FindAPawnShop.com to find your listing.",
              },
              {
                q: "What does featured placement actually look like?",
                a: "Your listing appears at the top of your city's page with a gold 'Featured' badge and a direct link to your website. Standard listings appear below in review-count order.",
              },
              {
                q: "How is billing handled?",
                a: "After we verify your shop we'll send a payment link. Featured placement is billed monthly at $29 and you can cancel at any time.",
              },
              {
                q: "Can I update my listing details?",
                a: "Yes — if your address, phone, hours, or website have changed, include the corrections in your email and we'll update your listing.",
              },
              {
                q: "Do you cover my city?",
                a: "We currently cover 34 states and are expanding fast. If your city isn't listed yet, email us and we'll let you know when your area goes live.",
              },
            ].map(({ q, a }) => (
              <details key={q} className="group bg-white">
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none">
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">{q}</span>
                  <span className="text-amber-500 font-bold text-xl shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom CTA banner */}
      <section style={{ backgroundColor: "#1a2744" }} className="py-14 px-4 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Ready to stand out?</h2>
        <p className="text-gray-300 mb-6 max-w-md mx-auto text-sm">
          Email us with your shop details and we'll get your featured listing live within 1 business day.
        </p>
        <a
          href="mailto:listings@findapawnshop.com"
          style={{ backgroundColor: "#f59e0b" }}
          className="inline-block text-gray-900 font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Get Featured — $29/month
        </a>
      </section>
    </>
  );
}
