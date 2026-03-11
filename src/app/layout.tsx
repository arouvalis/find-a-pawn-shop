import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FindAPawnShop.com — Pawn Shop Directory",
  description: "Find pawn shops near you. Browse listings by state and city with ratings, hours, and contact info.",
  verification: {
    google: "SU9_R_9BxiIDjjoFJtKsmffFrMIYK-K0LDtBc0OhN7M",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
