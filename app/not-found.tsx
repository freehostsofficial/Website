import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Home, Mail, Server } from "lucide-react";
import { DiscordIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <main className="mx-auto flex min-h-[60vh] max-w-[900px] items-center px-4 py-12 sm:px-6">
      <Card className="mx-auto w-full card-hover transition-all duration-300">
        <CardContent className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-secondary">
            <Compass className="size-7" />
          </div>
          <h1>404 — Page not found</h1>
          <p className="max-w-sm text-muted-foreground">
            We could not find the page you were looking for. It may have moved or the link might be broken.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <Button asChild className="gap-1.5">
              <Link href="/">
                <Home className="size-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-1.5">
              <Link href="/hosts">
                <Server className="size-4" />
                Browse Hosts
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-1.5">
              <a href={"mailto:support@" + process.env.EMAIL_DOMAIN}>
                <Mail className="size-4" />
                Report Issue
              </a>
            </Button>
            <Button asChild variant="ghost" className="gap-1.5">
              <a href="https://discord.gg/QbeZ3b5CQd" target="_blank" rel="noopener noreferrer">
                <DiscordIcon className="size-4" />
                Join Discord
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
