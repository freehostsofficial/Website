import type { Metadata } from "next";
import Link from "@/components/NoPrefetchLink";
import {
  BookOpen,
  Compass,
  Crosshair,
  HandHeart,
  Heart,
  Mail,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TiltCard } from "@/components/ui/TiltCard";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export const metadata: Metadata = {
  title: "About FreeHosts - Our Mission, Team & Community",
  description:
    "Learn about FreeHosts — a community-driven directory helping developers, students, and makers discover reliable free hosting. Meet the team and find out how to contribute.",
  keywords: [
    "about freehosts",
    "free hosting community",
    "hosting directory mission",
    "freehosts team",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: process.env.APP_URL + "/about",
  },
  openGraph: {
    locale: "en_US",
    siteName: "FreeHosts",
    type: "website",
    url: process.env.APP_URL + "/about",
    title: "About FreeHosts - Our Mission, Team & Community",
    description:
      "A community-driven directory to discover, compare and review free hosting services for websites, bots, and apps.",
    images: [
      {
        url: process.env.APP_URL + "/Src/Images/banner.png",
        width: 1280,
        height: 720,
        alt: "FreeHosts - Discover Free Hosting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About FreeHosts - Our Mission, Team & Community",
    description:
      "A community-driven directory to discover, compare and review free hosting services for websites, bots, and apps.",
    images: [
      {
        url: process.env.APP_URL + "/Src/Images/banner.png",
        alt: "FreeHosts - Discover Free Hosting",
      },
    ],
    site: "@freehosts_",
    creator: "@freehosts_",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": process.env.APP_URL + "/#organization",
      name: "FreeHosts",
      url: process.env.APP_URL,
      logo: {
        "@type": "ImageObject",
        url: process.env.APP_URL + "/Src/icons/icon.png",
        width: 512,
        height: 512,
      },
      sameAs: [
        "https://x.com/freehosts_",
        "https://www.instagram.com/freehosts/",
        "https://github.com/freehostsofficial",
        "https://discord.gg/QbeZ3b5CQd",
      ],
      description:
        "FreeHosts is a community-curated directory of free hosting providers and services.",
      contactPoint: [
        {
          "@type": "ContactPoint",
          email: "support@" + process.env.EMAIL_DOMAIN,
          contactType: "customer support",
          availableLanguage: "English",
        },
        {
          "@type": "ContactPoint",
          url: "https://discord.gg/QbeZ3b5CQd",
          contactType: "community support",
          availableLanguage: "English",
        },
      ],
    },
    {
      "@type": "WebPage",
      "@id": process.env.APP_URL + "/about#webpage",
      url: process.env.APP_URL + "/about",
      name: "About FreeHosts - Our Mission, Team & Community",
      isPartOf: { "@id": process.env.APP_URL + "/#website" },
      about: { "@id": process.env.APP_URL + "/#organization" },
      inLanguage: "en",
      description:
        "Learn about FreeHosts — a community-driven directory helping developers, students, and makers discover reliable free hosting.",
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden noise-overlay border-b border-border">
        <div className="dot-grid relative">
          <div className="pointer-events-none absolute -top-40 left-1/4 size-96 opacity-20 blob-morph" />
          <div className="pointer-events-none absolute -bottom-40 right-1/4 size-80 opacity-15 blob-morph" style={{ animationDelay: "4s" }} />
          <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-24">
            <div className="flex flex-col items-center gap-3 text-center reveal">
              <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Heart className="size-7" />
              </div>
              <h1>About FreeHosts</h1>
              <p className="max-w-md text-muted-foreground body-large">
                A community-driven directory helping developers, students, and makers
                discover reliable free hosting for their projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <div className="grid grid-cols-3 gap-4 stagger-children">
            <TiltCard maxTilt={6} glare={false} className="h-full">
              <StatCard value={100} label="Hosting Providers" suffix="+" />
            </TiltCard>
            <TiltCard maxTilt={6} glare={false} className="h-full">
              <StatCard value={400} label="Community Members" suffix="+" />
            </TiltCard>
            <TiltCard maxTilt={6} glare={false} className="h-full">
              <StatCard value={40} label="User Reviews" suffix="+" />
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ── Our Mission ──────────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[900px] px-4 py-16 sm:px-6">
          <div className="reveal">
            <Badge variant="outline" className="gap-1.5 border-accent/50 text-accent border-rotate">
              <Crosshair className="size-3.5" />
              Our Mission
            </Badge>
            <h2 className="mt-4">Help developers find free hosting</h2>
            <p className="mt-4 text-muted-foreground body-large">
              FreeHosts was created to help hobbyists, students, and makers quickly
              find free hosting options for small projects and learning.
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                FreeHosts was created to help hobbyists, students, and makers quickly
                find free hosting options for small projects and learning. We believe
                everyone should have access to the tools they need to bring their ideas
                to life without financial barriers.
              </p>
              <p>
                Our focus is on providing clear, accurate listings and
                community-contributed insights so people can make informed decisions
                and get their projects online fast. We are committed to maintaining a
                trustworthy, up-to-date directory that serves the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Values ──────────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <div className="reveal">
            <Badge variant="outline" className="gap-1.5 border-accent/50 text-accent border-rotate">
              <Star className="size-3.5" />
              Our Values
            </Badge>
            <h2 className="mt-4">What we stand for</h2>
            <p className="mt-2 text-muted-foreground body-large">
              The principles that guide every decision we make.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 stagger-children">
            <ValueCard icon={<Users className="size-5" />} title="Community First" text="Built by the community, for the community. Every contribution matters and helps others succeed." />
            <ValueCard icon={<ShieldCheck className="size-5" />} title="Transparency" text="Honest reviews, clear information, and open communication about our processes and decisions." />
            <ValueCard icon={<Zap className="size-5" />} title="Quality Over Quantity" text="We carefully curate listings to ensure every host meets our standards for reliability and usefulness." />
            <ValueCard icon={<HandHeart className="size-5" />} title="Free & Accessible" text="Our directory will always be free. No paywalls, no premium tiers, just helpful resources for everyone." />
          </div>
        </div>
      </section>

      {/* ── How You Can Help ──────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[900px] px-4 py-16 sm:px-6">
          <div className="reveal">
            <Badge variant="outline" className="gap-1.5 border-accent/50 text-accent border-rotate">
              <HandHeart className="size-3.5" />
              Get Involved
            </Badge>
            <h2 className="mt-4">How You Can Help</h2>
            <p className="mt-2 text-muted-foreground body-large">
              FreeHosts thrives because of community contributions. Here is how you can make a difference:
            </p>
          </div>
          <ul className="mt-6 flex flex-col gap-3 reveal reveal-delay-1">
            <li className="flex items-start gap-2 text-sm text-muted-foreground transition-all duration-200 hover:translate-x-0.5">
              <Users className="mt-0.5 size-4 shrink-0 text-accent" />
              <span><strong className="text-foreground">Suggest Hosts:</strong> Join our Discord and post in the &quot;add-host&quot; channel with provider details, features, and links.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground transition-all duration-200 hover:translate-x-0.5">
              <Star className="mt-0.5 size-4 shrink-0 text-accent" />
              <span><strong className="text-foreground">Share Reviews:</strong> Help others by sharing your experiences with different hosting providers.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground transition-all duration-200 hover:translate-x-0.5">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />
              <span><strong className="text-foreground">Report Issues:</strong> Let us know if you find outdated information or broken links so we can keep listings accurate.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground transition-all duration-200 hover:translate-x-0.5">
              <BookOpen className="mt-0.5 size-4 shrink-0 text-accent" />
              <span><strong className="text-foreground">Share Tips:</strong> Post your setup guides, tips, and best practices to help newcomers get started.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground transition-all duration-200 hover:translate-x-0.5">
              <Heart className="mt-0.5 size-4 shrink-0 text-accent" />
              <span><strong className="text-foreground">Spread the Word:</strong> Tell others about FreeHosts to help grow our community.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ── Our Story ──────────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[900px] px-4 py-16 sm:px-6">
          <div className="reveal">
            <Badge variant="outline" className="gap-1.5 border-accent/50 text-accent border-rotate">
              <BookOpen className="size-3.5" />
              Our Story
            </Badge>
            <h2 className="mt-4">From idea to community</h2>
            <p className="mt-2 text-muted-foreground body-large">
              FreeHosts started as a simple idea: make it easier for people to find reliable free hosting without endless searching and comparing.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-4 border-l-2 border-l-accent/30 pl-5 reveal reveal-delay-1">
            <TimelineItem
              title="The Beginning"
              text="Started as a small list shared among friends to help each other find free hosting for hobby projects."
            />
            <TimelineItem
              title="Growing Community"
              text="Word spread, and more people joined to share their experiences and suggestions, forming the foundation of our community."
            />
            <TimelineItem
              title="Launch of Directory"
              text="Built a proper directory website with reviews, ratings, and detailed information to serve the growing community better."
            />
            <TimelineItem
              title="Today"
              text="A thriving community of 400+ members with 100+ curated hosting providers, helping thousands find the right hosting solution."
            />
          </div>
        </div>
      </section>

      {/* ── Get In Touch ────────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <div className="reveal">
            <Badge variant="outline" className="gap-1.5 border-accent/50 text-accent border-rotate">
              <Mail className="size-3.5" />
              Get In Touch
            </Badge>
            <h2 className="mt-4">We would love to hear from you</h2>
            <p className="mt-2 text-muted-foreground body-large">
              Have questions, suggestions, or want to get involved?
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 stagger-children">
            <TiltCard maxTilt={6} glare={false} className="h-full">
              <Card className="h-full card-hover card-glow transition-all duration-300">
                <CardContent className="flex flex-col items-center gap-2 text-center">
                  <FontAwesomeIcon icon={faDiscord} className="size-6" />
                  <h3>Join Discord</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with the community, get help, and stay updated with the latest
                    additions.
                  </p>
                  <Button asChild className="mt-2 gap-2">
                    <a href="https://discord.gg/QbeZ3b5CQd" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faDiscord} className="size-4" />
                      Join Server
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </TiltCard>
            <TiltCard maxTilt={6} glare={false} className="h-full">
              <Card className="h-full card-hover card-glow transition-all duration-300">
                <CardContent className="flex flex-col items-center gap-2 text-center">
                  <Mail className="size-6" />
                  <h3>Email Us</h3>
                  <p className="text-sm text-muted-foreground">
                    For general inquiries, partnerships, or formal communications, reach
                    out via email.
                  </p>
                  <Button asChild variant="outline" className="mt-2 gap-2">
                    <a href={"mailto:support@" + process.env.EMAIL_DOMAIN}>
                      <Mail className="size-3.5" />
                      Send Email
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ── Team CTA ────────────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <SpotlightCard className="flex flex-col items-center gap-3 p-10 text-center reveal">
            <h2>Meet Our Team</h2>
            <p className="max-w-md text-muted-foreground">
              Learn more about the volunteers who keep FreeHosts running and discover
              opportunities to join us.
            </p>
            <Button asChild className="gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95">
              <Link href="/staff">
                <Users className="size-4" />
                View Team
              </Link>
            </Button>
          </SpotlightCard>
        </div>
      </section>
    </>
  );
}

function StatCard({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  return (
    <Card variant="elevated" className="h-full py-5 text-center card-hover card-glow transition-all duration-300">
      <CardContent>
        <AnimatedCounter to={value} suffix={suffix} className="font-mono text-2xl font-semibold gradient-text" />
        <div className="mt-1 text-xs text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}

function ValueCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <TiltCard maxTilt={6} glare={false} className="h-full">
      <LiquidGlassCard glassSize="sm" className="h-full">
        <div className="flex flex-col gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-accent/10 text-accent">{icon}</div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{text}</p>
        </div>
      </LiquidGlassCard>
    </TiltCard>
  );
}

function TimelineItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="relative pl-4 before:absolute before:left-0 before:top-2 before:size-2 before:rounded-full before:bg-accent before:shadow-[0_0_8px] before:shadow-accent/50">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
