"use client";

import Link from "@/components/NoPrefetchLink";
import { ArrowRight, Check, CircleHelp } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <main className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <section className="text-center">
        <h1>Join the FreeHosts Directory</h1>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Help the community discover reliable, zero-cost hosting by submitting a provider.
        </p>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="text-lg">Submission Guide</h2>
          <p className="text-sm text-muted-foreground">Follow these steps to get your host listed.</p>

          <div className="mt-4 flex flex-col gap-4">
            {steps.map((step) => (
              <Card key={step.num} className="flex-row items-start gap-4 py-5">
                <CardContent className="flex items-start gap-4 px-5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-sm font-semibold">
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
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <Card>
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

          <Card>
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
        </aside>
      </div>

      <section className="mt-16">
        <h2 className="text-lg">Common Questions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {teaser.map((item) => (
            <Card key={item.q}>
              <CardContent>
                <h4 className="text-sm font-medium">{item.q}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{item.a}</p>
              </CardContent>
            </Card>
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
      </section>
    </main>
  );
}
