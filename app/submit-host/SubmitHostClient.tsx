"use client";

import Link from "@/components/NoPrefetchLink";
import { Sparkles, Compass, Plus, CircleHelp, ArrowRight, Check } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/ui/TiltCard";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const inviteUrl = "https://discord.gg/QbeZ3b5CQd";

const steps = [
  {
    num: "01",
    title: "Review Requirements",
    text: "Ensure the host meets our security and service standards. It must offer a genuinely free plan (not a trial) available for at least 2 months.",
    link: { href: "/submission-rules", label: "View Full Rules" },
  },
  {
    num: "02",
    title: "Prepare the Layout",
    text: "All submissions must follow our standardized Discord formatting. Use our Layout Builder tool to create a perfectly formatted message in seconds.",
    link: { href: "/submit-layout", label: "Open Layout Builder" },
  },
  {
    num: "03",
    title: "Post on Discord",
    text: (
      <>
        Join our Discord server and navigate to the <strong className="text-foreground">#add-host</strong>{" "}
        channel. Paste your formatted message there. Our curators will review it within 3-7 days.
      </>
    ),
    link: null,
  },
];

const checklist = [
  "Public ToS & Privacy Policy",
  "Genuinely Free (No Trials)",
  "Stable Performance",
  "No Nulled/Illegal Content",
  "Detailed Specs Provided",
];

const teaser = [
  { q: "How long does review take?", a: "Typically 3-7 days depending on volume." },
  { q: "Can I update my listing?", a: "Yes, contact us on Discord or via email anytime." },
  { q: "Is there a fee?", a: "No, listing on FreeHosts is completely free." },
];

export default function SubmitHostClient() {
  return (
    <main>
      <section className="relative overflow-hidden noise-overlay border-b border-border">
        <div className="dot-grid relative">
          <div className="pointer-events-none absolute -top-40 left-1/4 size-96 opacity-20 blob-morph" />
          <div className="pointer-events-none absolute -bottom-40 right-1/4 size-80 opacity-15 blob-morph" style={{ animationDelay: "4s" }} />
          <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-24">
            <div className="flex flex-col items-center gap-3 text-center reveal">
              <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Plus className="size-7" />
              </div>
              <h1>Submit a Host</h1>
              <p className="max-w-2xl text-muted-foreground body-large">
                Help the community discover reliable, zero-cost hosting by submitting a provider.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 stagger-children">
              {steps.map((step, i) => (
                <div key={i} className="relative">
                  {i < steps.length - 1 && (
                    <div className="pointer-events-none absolute left-4 top-14 bottom-0 w-px bg-gradient-to-b from-accent/40 to-transparent" aria-hidden="true" />
                  )}
                  <TiltCard maxTilt={6} glare={false} className="h-full">
                    <Card variant="elevated" hover padding="none" className="h-full transition-all duration-300 card-glow">
                      <CardContent className="flex items-start gap-4 p-5">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-sm font-semibold shadow-[0_0_8px] shadow-accent/20">
                          {step.num}
                        </div>
                        <div>
                          <h3>{step.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
                          {step.link && (
                            <Link
                              href={step.link.href}
                              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                            >
                              {step.link.label}
                              <ArrowRight className="size-3.5" />
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </div>
              ))}
            </div>
            <aside className="space-y-4 stagger-children">
              <TiltCard maxTilt={6} glare={false} className="h-full">
                <Card variant="elevated" hover className="h-full transition-all duration-300 card-glow">
                  <CardContent>
                    <h3>Quick Checklist</h3>
                    <ul className="mt-3 flex flex-col gap-2">
                      {checklist.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TiltCard>
              <TiltCard maxTilt={6} glare={false} className="h-full">
                <Card variant="elevated" hover className="h-full transition-all duration-300 card-glow">
                  <CardContent className="flex flex-col gap-3">
                    <h3>Ready to Submit?</h3>
                    <p className="text-sm text-muted-foreground">
                      The quickest way to get listed is via our active Discord community.
                    </p>
                    <Button asChild className="gap-2">
                      <a href={inviteUrl} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faDiscord} className="size-4" />
                        Join Discord to Submit
                      </a>
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Need help with a listing? Contact us at{" "}
                      <a href={"mailto:support@" + process.env.EMAIL_DOMAIN} className="hover:underline">
                        support@{process.env.EMAIL_DOMAIN}
                      </a>
                    </p>
                  </CardContent>
                </Card>
              </TiltCard>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <div className="reveal">
            <Badge variant="outline" className="gap-1.5 border-accent/50 text-accent border-rotate">
              <CircleHelp className="size-3.5" />
              Common Questions
            </Badge>
            <h2 className="mt-4">Common Questions</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 stagger-children">
            {teaser.map((item) => (
              <TiltCard key={item.q} maxTilt={6} glare={false} className="h-full">
                <Card className="h-full card-hover card-glow transition-all duration-300">
                  <CardContent>
                    <h4 className="text-sm font-medium">{item.q}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{item.a}</p>
                  </CardContent>
                </Card>
              </TiltCard>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="gap-1.5">
              <Link href="/faq">
                View All FAQs
                <CircleHelp className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
