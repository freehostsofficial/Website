import type { Metadata } from "next";
import Link from "@/components/NoPrefetchLink";
import {
  BookOpen,
  Crosshair,
  HandHeart,
  Heart,
  Mail,
  ShieldCheck,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
      <main className="mx-auto max-w-[900px] px-4 py-12 sm:px-6">
        <section className="flex flex-col items-center gap-3 text-center reveal">
          <div className="flex size-14 items-center justify-center rounded-full bg-secondary">
            <Heart className="size-7" />
          </div>
          <h1>About FreeHosts</h1>
          <p className="max-w-md text-muted-foreground">
            A community-driven directory helping developers, students, and makers
            discover reliable free hosting for their projects.
          </p>
        </section>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="reveal reveal-delay-1"><StatCard number="100+" label="Hosting Providers" /></div>
          <div className="reveal reveal-delay-2"><StatCard number="400+" label="Community Members" /></div>
          <div className="reveal reveal-delay-3"><StatCard number="40+" label="User Reviews" /></div>
        </div>

        <div className="mt-12 flex flex-col gap-10">
          <ContentSection icon={<Crosshair className="size-5" />} title="Our Mission">
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
          </ContentSection>

          <ContentSection icon={<Star className="size-5" />} title="Our Values">
            <div className="grid gap-4 sm:grid-cols-2">
              <ValueCard
                icon={<Users className="size-4" />}
                title="Community First"
                text="Built by the community, for the community. Every contribution matters and helps others succeed."
              />
              <ValueCard
                icon={<ShieldCheck className="size-4" />}
                title="Transparency"
                text="Honest reviews, clear information, and open communication about our processes and decisions."
              />
              <ValueCard
                icon={<Zap className="size-4" />}
                title="Quality Over Quantity"
                text="We carefully curate listings to ensure every host meets our standards for reliability and usefulness."
              />
              <ValueCard
                icon={<HandHeart className="size-4" />}
                title="Free & Accessible"
                text="Our directory will always be free. No paywalls, no premium tiers, just helpful resources for everyone."
              />
            </div>
          </ContentSection>

          <ContentSection icon={<HandHeart className="size-5" />} title="How You Can Help">
            <p>
              FreeHosts thrives because of community contributions. Here is how you can
              make a difference:
            </p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <strong className="text-foreground">Suggest Hosts:</strong> Join our Discord and post in the
                &quot;add-host&quot; channel with provider details, features, and links.
              </li>
              <li>
                <strong className="text-foreground">Share Reviews:</strong> Help others by sharing your experiences
                with different hosting providers.
              </li>
              <li>
                <strong className="text-foreground">Report Issues:</strong> Let us know if you find outdated
                information or broken links so we can keep listings accurate.
              </li>
              <li>
                <strong className="text-foreground">Share Tips:</strong> Post your setup guides, tips, and best
                practices to help newcomers get started.
              </li>
              <li>
                <strong className="text-foreground">Spread the Word:</strong> Tell others about FreeHosts to help
                grow our community.
              </li>
            </ul>
          </ContentSection>

          <ContentSection icon={<BookOpen className="size-5" />} title="Our Story">
            <p>
              FreeHosts started as a simple idea: make it easier for people to find
              reliable free hosting without endless searching and comparing.
            </p>
            <div className="mt-2 flex flex-col gap-4 border-l border-border pl-5">
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
          </ContentSection>

          <ContentSection icon={<Mail className="size-5" />} title="Get In Touch">
            <p>
              Have questions, suggestions, or want to get involved? We would love to
              hear from you!
            </p>
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
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
            </div>
          </ContentSection>
        </div>

        <div className="mt-16 flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-10 text-center card-hover transition-all duration-300 reveal">
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
        </div>
      </main>
    </>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="h-full rounded-lg border border-border bg-card py-5 text-center card-hover card-glow transition-all duration-300">
      <div className="font-mono text-2xl font-semibold">{number}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function ContentSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-md bg-secondary">{icon}</div>
        <h2 className="text-lg">{title}</h2>
      </div>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function ValueCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <Card className="h-full gap-2 py-4 card-hover card-glow transition-all duration-300">
      <CardContent className="flex flex-col gap-2">
        <div className="flex size-8 items-center justify-center rounded-md bg-secondary">{icon}</div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  );
}

function TimelineItem({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
