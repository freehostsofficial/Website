import type { Metadata } from "next";
import Link from "@/components/NoPrefetchLink";
import { Compass, Home, Mail, Server } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "404 - Page Not Found | FreeHosts",
  description: "The page you were looking for could not be found. Browse our free hosting directory or return to the homepage.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "404 - Page Not Found | FreeHosts",
    description: "The page you were looking for could not be found.",
    images: [{ url: process.env.APP_URL + "/Src/Images/banner.png", width: 1280, height: 720, alt: "FreeHosts - Discover Free Hosting" }],
  },
};

export default function NotFound() {
  return (
    <main className="wrap py-12">
      <section className="text-center max-w-md mx-auto space-y-6">
        <div className="flex justify-center text-accent">
          <Compass size={48} aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-bold">404 - Page not found</h1>
        <p className="text-muted-foreground">
          We could not find the page you were looking for. It may have moved or the link might be broken.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/">
            <Button><Home size={14} aria-hidden="true" /> Back to Home</Button>
          </Link>
          <Link href="/hosts">
            <Button variant="secondary"><Server size={14} aria-hidden="true" /> Browse Hosts</Button>
          </Link>
          <a href={"mailto:support@" + process.env.EMAIL_DOMAIN}>
            <Button variant="ghost"><Mail size={14} aria-hidden="true" /> Report Issue</Button>
          </a>
        </div>
      </section>
    </main>
  );
}
