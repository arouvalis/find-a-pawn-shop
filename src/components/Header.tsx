"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const STATES = [
  { label: "Alabama", href: "/alabama" },
  { label: "Arkansas", href: "/arkansas" },
  { label: "Arizona", href: "/arizona" },
  { label: "California", href: "/california" },
  { label: "Colorado", href: "/colorado" },
  { label: "Florida", href: "/florida" },
  { label: "Georgia", href: "/georgia" },
  { label: "Illinois", href: "/illinois" },
  { label: "Indiana", href: "/indiana" },
  { label: "Kentucky", href: "/kentucky" },
  { label: "Louisiana", href: "/louisiana" },
  { label: "Maryland", href: "/maryland" },
  { label: "Minnesota", href: "/minnesota" },
  { label: "Michigan", href: "/michigan" },
  { label: "Missouri", href: "/missouri" },
  { label: "Nevada", href: "/nevada" },
  { label: "Oklahoma", href: "/oklahoma" },
  { label: "South Carolina", href: "/south-carolina" },
  { label: "New York", href: "/new-york" },
  { label: "North Carolina", href: "/north-carolina" },
  { label: "Ohio", href: "/ohio" },
  { label: "Pennsylvania", href: "/pennsylvania" },
  { label: "Tennessee", href: "/tennessee" },
  { label: "Texas", href: "/texas" },
  { label: "Utah", href: "/utah" },
  { label: "Virginia", href: "/virginia" },
  { label: "Washington", href: "/washington" },
  { label: "Wisconsin", href: "/wisconsin" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header style={{ backgroundColor: "#1a2744" }} className="text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-90 transition-opacity">
          FindAPawnShop<span style={{ color: "#f59e0b" }}>.com</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {/* States dropdown */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1 hover:text-amber-400 transition-colors"
            >
              States
              <svg
                className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {open && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden z-50"
                style={{ backgroundColor: "#1a2744", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {STATES.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 text-sm hover:bg-white/10 hover:text-amber-400 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/blog" className="hover:text-amber-400 transition-colors">
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
