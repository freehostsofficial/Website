import Link from "@/components/SiteLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import { safeJsonLd } from "../../lib/safeJsonLd";
import { pageMeta, webPageJsonLd } from "../../lib/pageMeta";
import FaqCta from "@/components/FaqCta";
import { ClipboardCheck, ListChecks, ThumbsUp, RefreshCw, ShieldAlert, Scale, type LucideIcon } from "lucide-react";

export const metadata = pageMeta({
  path: "/methodology",
  title: "How We Review Free Hosting Providers",
  description:
    "FreeHosts' editorial methodology: how hosts are submitted and curated, what we verify on every listing, how community votes work, and when a provider gets removed.",
  keywords: [
    "freehosts methodology",
    "how we review hosting",
    "free hosting reviews",
    "hosting directory standards",
  ],
});

const webPageSchema = webPageJsonLd(
  "/methodology",
  "How We Review Free Hosting Providers",
  "The FreeHosts editorial methodology: submissions, curator checks, community voting, and listing removal policy.",
);

const sections: { icon: LucideIcon; title: string; id?: string; body: React.ReactNode }[] = [
  {
    icon: ClipboardCheck,
    title: "How a host gets listed",
    body: (
      <p>
        Providers enter the directory through <Link href="/submit-host">community submission</Link>, either by users or
        by the hosts themselves. Every submission is checked against our{" "}
        <Link href="/submission-rules">submission rules</Link> before it goes live: the service must genuinely offer a
        free tier, publish clear information about its features and limits, and be reachable through a working website.
        Submissions that fail these checks are rejected; submissions that hide costs or misrepresent their plans are
        declined outright.
      </p>
    ),
  },
  {
    icon: ListChecks,
    title: "What we record on every listing",
    body: (
      <>
        <p>
          Each profile standardises the provider&apos;s published free-tier information so listings are comparable:
        </p>
        <ul className="host-check-list">
          <li>Free plan specifications — CPU allocation, RAM, and storage, taken from the provider&apos;s own plan pages.</li>
          <li>Supported languages and runtimes, plus target use cases such as websites, Discord bots, game servers, apps, or databases.</li>
          <li>Current status (online or closed), based on provider announcements and community reports.</li>
          <li>Direct links to the provider&apos;s website, and any limits or idle policies they document.</li>
        </ul>
      </>
    ),
  },
  {
    icon: ThumbsUp,
    title: "How community reviews work",
    id: "votes",
    body: (
      <>
        <p>
          The approval percentage shown on each listing comes from positive/negative reviews submitted by members of our{" "}
          <a href="https://discord.gg/QbeZ3b5CQd" target="_blank" rel="noopener noreferrer">Discord community</a>. Reviews
          reflect real users&apos; experiences with a host — uptime, support, and whether the free plan delivers what it
          promises. They are opinions from the community, not lab benchmarks, which is why we label them as community reviews rather
          than expert ratings.
        </p>
        <p>
          Every listing with at least one community review displays its score publicly, both on the page and as a star
          rating in search results. The more reviews a listing gathers, the more reliable that score becomes — treat a
          score built on two or three reviews as an early signal rather than a verdict, and check the raw up/down counts
          shown alongside it. Newer listings therefore show weaker signals: not because a host is untested, but
          because its sample is still small.
        </p>
      </>
    ),
  },
  {
    icon: RefreshCw,
    title: "Keeping listings current",
    body: (
      <p>
        Free tiers change constantly: RAM gets cut, idle policies tighten, services shut down. The community flags
        outdated or inaccurate listings in our Discord server, and curators correct the listing or mark the provider
        closed. Each listing shows the date the provider was added to the directory, and the status badge reflects its
        present state. If you spot something wrong on a listing, report it in the Discord — corrections usually land
        within days.
      </p>
    ),
  },
  {
    icon: ShieldAlert,
    title: "When a provider is removed",
    body: (
      <p>
        Listings are removed when a provider shuts down, drops its free tier entirely, or turns out to be misleading
        users — hidden paid requirements, fake specs, or predatory data practices reported by the community. Removal
        decisions are made by the curator team, and the reasoning can be discussed openly in the Discord. If you
        believe a listing is illegal (rather than merely outdated), report it by email so it is handled formally —
        see our Terms of Service, section &ldquo;Reporting illegal content&rdquo;.
      </p>
    ),
  },
  {
    icon: Scale,
    title: "Honest limits of this methodology",
    body: (
      <p>
        We do not run long-term benchmark rigs or receive compensation for listings — the directory is free to browse,
        has no paid placements, and no affiliate links. What we offer instead is standardised, comparable information
        plus the collective experience of an active community. That combination is good at catching dead services and
        broken promises quickly; it is less precise than a professional test lab for measuring exact performance. Use
        the directory to shortlist, then validate anything critical yourself before committing a production project.
      </p>
    ),
  },
];

export default function MethodologyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageSchema) }} />
      <Breadcrumbs siteUrl={process.env.APP_URL} items={[{ name: "How We Review", path: "/methodology" }]} />
      <main className="wrap about-content">
        <section className="faq-hero">
          <h1>How We Review Free Hosting Providers</h1>
          <p>
            FreeHosts is a curated directory, not an automated scraper. Every listing passes through the same pipeline:
            community submission, volunteer curation, structured specs, and ongoing community voting. This page explains
            exactly how that works, so you can judge our listings with full context.
          </p>
        </section>

        {sections.map((section) => (
          <section key={section.title} className="content-section" id={section.id}>
            <div className="section-icon"><section.icon size={24} aria-hidden="true" /></div>
            <h2>{section.title}</h2>
            {section.body}
          </section>
        ))}

        <FaqCta
          title="Ready to find a host?"
          text="Browse the directory and compare verified free hosting providers side by side."
          buttons={[{ href: "/hosts", label: "Browse the free host directory", primary: true }]}
        />
      </main>
    </>
  );
}
