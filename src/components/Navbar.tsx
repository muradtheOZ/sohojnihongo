"use client";

import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <>
      {/* Top nav for desktop */}
      <header className="hidden md:flex items-center justify-between px-4 py-3 bg-transparent">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-2xl font-bold text-primary">
            Shohoj Nihongo
          </Link>
        </div>
        <nav className="flex items-center gap-3">
          <Link href="/hiragana" className="btn btn-ghost">
            Hiragana
          </Link>
          <Link href="/katakana" className="btn btn-ghost">
            Katakana
          </Link>
          <Link href="/flashcards" className="btn btn-ghost">
            Flashcards
          </Link>
          <Link href="/jlpt" className="btn btn-ghost">
            JLPT
          </Link>
        </nav>
      </header>

      {/* Bottom fixed nav for mobile */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 bg-app-section px-3 py-2 rounded-full shadow-lg flex items-center gap-2 z-40">
        <Link href="/hiragana" className="btn btn-ghost btn-sm">
          ひ
        </Link>
        <Link href="/katakana" className="btn btn-ghost btn-sm">
          カ
        </Link>
        <Link href="/flashcards" className="btn btn-ghost btn-sm">
          🔁
        </Link>
        <Link href="/jlpt" className="btn btn-ghost btn-sm">
          JLPT
        </Link>
      </nav>
    </>
  );
}
