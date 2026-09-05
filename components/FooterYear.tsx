"use client";

// Footer copyright year. Current-time read lives here (client component)
// instead of the root layout so the static shell prerenders deterministically.
// suppressHydrationWarning covers the year-boundary case (built one year,
// visited the next) — the client value wins.
export default function FooterYear() {
  return (
    <span id="year" suppressHydrationWarning>
      {new Date().getFullYear()}
    </span>
  );
}
