import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Ban,
  CheckCircle,
  Clock,
  Code,
  FileText,
  Handshake,
  LayoutTemplate,
  Lock,
  Repeat,
  Server,
  ShieldAlert,
  Wrench,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function RuleCategory({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="mt-6">
      <CardContent className="tos-content !max-w-none !p-0">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary">{icon}</div>
          <div>
            <h2 className="!mt-0 !text-lg">{title}</h2>
            <p className="!mb-0">{description}</p>
          </div>
        </div>
        <div className="mt-3">{children}</div>
      </CardContent>
    </Card>
  );
}

function SummaryItem({ allowed = false, children }: { allowed?: boolean; children: React.ReactNode }) {
  return (
    <div
      className={
        allowed
          ? "flex items-center gap-2 rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent"
          : "flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive-text"
      }
    >
      {allowed ? <CheckCircle className="size-4 shrink-0" /> : <XCircle className="size-4 shrink-0" />}
      {children}
    </div>
  );
}

export default function SubmissionRulesContent() {
  return (
    <main className="mx-auto max-w-[900px] px-4 py-12 sm:px-6">
      <section className="flex flex-col items-center gap-3 text-center">
        <h1>Hosting Submission Rules</h1>
        <p className="max-w-lg text-muted-foreground">
          Read every rule carefully before submitting. Submissions that do not meet these standards will be rejected without review.
        </p>
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-3.5" /> Last updated: April 26, 2026
        </span>
        <div className="flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-500">
          <AlertTriangle className="size-4 shrink-0" />
          Violations may result in permanent blacklisting from the directory.
        </div>
      </section>

      {/* Quick summary */}
      <section className="mt-8 grid gap-2 sm:grid-cols-2">
        <SummaryItem allowed>Genuine free plans (not trials)</SummaryItem>
        <SummaryItem allowed>Coin/earning-based renewal systems</SummaryItem>
        <SummaryItem allowed>Public ToS &amp; Privacy Policy</SummaryItem>
        <SummaryItem allowed>Full specs listed per target</SummaryItem>
        <SummaryItem>Trial-only or invite-gated plans</SummaryItem>
        <SummaryItem>Nulled software or malware</SummaryItem>
        <SummaryItem>False or exaggerated specs</SummaryItem>
        <SummaryItem>Invite requirements for free plans</SummaryItem>
      </section>

      <RuleCategory icon={<Server className="size-4" />} title="Eligibility" description="Your host must meet all of these before submitting.">
        <ul>
          <li><strong>Genuinely free plan required.</strong> Trials, time-limited offers, or plans that require payment after a period do not qualify.</li>
          <li><strong>Minimum 2 months of operation.</strong> The free service must have been available and stable for at least 2 months before submission.</li>
          <li><strong>Open registration.</strong> Signup must be publicly accessible with no invite codes, waitlists, or manual approval gates.</li>
          <li><strong>Full specifications required.</strong> You must provide RAM, CPU (vCores), and disk space for every plan. &ldquo;Unlimited&rdquo; claims must be substantiated.</li>
          <li><strong>Separate specs per target.</strong> If your host offers different resources for different use cases (e.g. bots vs. websites), each must be listed separately.</li>
          <li><strong>Direct plan link required.</strong> You must provide a link that directly shows the free plan — not just the homepage.</li>
          <li><strong>Website or Discord required.</strong> At least one of a public website or Discord server must be provided.</li>
        </ul>
      </RuleCategory>

      <RuleCategory icon={<Lock className="size-4" />} title="Security" description="Minimum security standards all listed hosts must meet.">
        <ul>
          <li><strong>Password security.</strong> User passwords must be hashed and stored securely. Plain-text password storage is grounds for immediate removal.</li>
          <li><strong>DDoS protection.</strong> Basic anti-DDoS measures must be in place.</li>
          <li><strong>Secure authentication.</strong> Login systems must use HTTPS and protect against brute-force attacks.</li>
          <li><strong>No data harvesting.</strong> You may not collect, sell, or share user data beyond what is disclosed in your Privacy Policy.</li>
          <li><strong>Vulnerability disclosure.</strong> If a security issue is reported by our team or community, you must respond and remediate within a reasonable timeframe or face removal.</li>
        </ul>
      </RuleCategory>

      <RuleCategory icon={<FileText className="size-4" />} title="Legal & Policies" description="All hosts must comply with applicable laws and platform rules.">
        <ul>
          <li><strong>Public ToS required.</strong> A Terms of Service document must be publicly accessible and linked in your submission.</li>
          <li><strong>Public Privacy Policy required.</strong> A Privacy Policy must be publicly accessible and linked in your submission.</li>
          <li><strong>Discord ToS compliance.</strong> Your service must comply with Discord&apos;s Terms of Service at all times.</li>
          <li><strong>Legal compliance.</strong> Your host must comply with all applicable local and international laws, including GDPR where relevant.</li>
          <li><strong>No illegal content.</strong> Hosting of illegal content, piracy, CSAM, or any content that violates law is strictly prohibited and will result in permanent blacklisting.</li>
        </ul>
      </RuleCategory>

      <RuleCategory icon={<Code className="size-4" />} title="Software & Infrastructure" description="Standards for the software and tools your host uses.">
        <ul>
          <li><strong>No nulled or cracked software.</strong> Using nulled themes, plugins, panels, or dashboards is prohibited and grounds for immediate removal.</li>
          <li><strong>No malware or spyware.</strong> Your platform must not contain or distribute malicious software of any kind.</li>
          <li><strong>Stable uptime.</strong> Your service must maintain reasonable uptime. Hosts with chronic downtime or instability will be reviewed for removal.</li>
          <li><strong>Functional panel or dashboard.</strong> Users must be able to manage their resources through a working control panel.</li>
        </ul>
      </RuleCategory>

      <RuleCategory icon={<Wrench className="size-4" />} title="Service Standards" description="What we expect from the service you provide to users.">
        <ul>
          <li><strong>Coin/earning systems are allowed.</strong> Plans that require earning coins through activity are permitted, provided the system is fair and clearly explained.</li>
          <li><strong>Invite requirements are NOT allowed.</strong> Free plans must not require users to invite others to unlock or maintain access.</li>
          <li><strong>No bait-and-switch.</strong> You may not advertise specs or features that are not actually available on the free plan.</li>
          <li><strong>Support availability.</strong> You must provide some form of user support (Discord, email, or ticket system).</li>
          <li><strong>Renewal transparency.</strong> If plans require renewal, the process, frequency, and any costs must be clearly stated.</li>
        </ul>
      </RuleCategory>

      <RuleCategory icon={<Repeat className="size-4" />} title="Renewal" description="Rules around plan renewal and expiry.">
        <ul>
          <li><strong>Clearly state renewal requirements.</strong> Specify whether plans auto-renew, require manual renewal, or never expire.</li>
          <li><strong>Include renewal frequency.</strong> State how often users must renew (e.g. every 30 days).</li>
          <li><strong>Include coin cost if applicable.</strong> If renewal requires coins or activity, state the exact amount required.</li>
          <li><strong>Grace period disclosure.</strong> If there is a grace period before a plan is suspended or deleted, it must be disclosed.</li>
        </ul>
      </RuleCategory>

      <RuleCategory icon={<LayoutTemplate className="size-4" />} title="Submission Format" description="Your submission must follow this exact format or it will be rejected.">
        <ul>
          <li><strong>Use the Layout Builder.</strong> We strongly recommend using the <Link href="/submit-layout" className="step-link" style={{ display: "inline" }}>Layout Builder</Link> to generate a correctly formatted submission.</li>
          <li><strong>Separate specs per target.</strong> If different targets have different specs, each must be listed separately in the Specifications section.</li>
          <li><strong>Submissions not following the layout will be rejected without review.</strong></li>
        </ul>
        <div className="layout-example">
          Host Submission<br /><br />
          Host Name<br />
          [Host Name]<br />
          Plans<br />
          [Plans]<br />
          Targets<br />
          [Targets]<br />
          Locales / Languages<br />
          [Locales]<br />
          ------------------------------------------------------------<br /><br />
          Specifications<br />
          - RAM: [RAM]<br />
          - CPU: [CPU]<br />
          - Disk: [Disk]<br />
          ------------------------------------------------------------<br /><br />
          Links<br />
          ToS: [URL]<br />
          Privacy Policy: [URL]<br />
          Website Link: [URL] <em>(or Discord Invite)</em><br />
          ------------------------------------------------------------<br /><br />
          Information<br />
          - Renewal Required: [YES/NO]<br />
          - Renewal Duration: [Days] <em>(if applicable)</em><br />
          - Coins Needed: [Amount] <em>(if applicable)</em><br />
          - Notes: [Notes]<br />
          ------------------------------------------------------------<br /><br />
          Verification<br />
          [x] I have included the ToS<br />
          [x] I have included the Privacy Policy<br />
          [x] I have read the Submission Rules
        </div>
      </RuleCategory>

      <RuleCategory icon={<Handshake className="size-4" />} title="Conduct" description="How hosts and their representatives must behave in our community.">
        <ul>
          <li><strong>No false or exaggerated claims.</strong> Do not lie about specs, uptime, features, or plan availability.</li>
          <li><strong>No host shaming or drama.</strong> Attacking, mocking, or starting conflicts with other hosts is prohibited.</li>
          <li><strong>No poaching.</strong> Actively recruiting users away from other listed hosts is not allowed.</li>
          <li><strong>No sabotage.</strong> Filing false reports or attempting to get legitimate hosts removed is prohibited.</li>
          <li><strong>Respectful communication.</strong> All interactions with staff and community members must be professional and respectful.</li>
          <li><strong>No scams or deceptive advertising.</strong> Misleading users about your service in any way is grounds for immediate removal.</li>
        </ul>
      </RuleCategory>

      <RuleCategory icon={<ShieldAlert className="size-4" />} title="Ongoing Compliance" description="Being listed is not permanent — hosts are reviewed continuously.">
        <ul>
          <li><strong>Listings are reviewed periodically.</strong> Hosts that no longer meet standards will be flagged and may be removed.</li>
          <li><strong>Respond to staff requests.</strong> If our team contacts you about your listing, you must respond within a reasonable time. Ignoring staff may result in removal.</li>
          <li><strong>Update your listing when specs change.</strong> If your free plan changes significantly, you must notify us. Outdated or misleading listings will be corrected or removed.</li>
          <li><strong>Community reports are reviewed.</strong> User reports about a host&apos;s quality or conduct are taken seriously and investigated.</li>
        </ul>
      </RuleCategory>

      <RuleCategory icon={<Ban className="size-4" />} title="Enforcement" description="Consequences for rule violations.">
        <ul>
          <li><strong>Rejection.</strong> Submissions that do not meet requirements are rejected without review.</li>
          <li><strong>Removal.</strong> Listed hosts that violate rules will be removed from the directory.</li>
          <li><strong>BH (Bad Host) tag.</strong> Hosts removed for poor service, false specs, or instability may be tagged as Bad Host.</li>
          <li><strong>SH (Scam Host) tag.</strong> Hosts removed for scamming, deception, or illegal activity will be permanently tagged as Scam Host.</li>
          <li><strong>Permanent blacklist.</strong> Hosts tagged SH or repeat violators may be permanently blacklisted and banned from resubmitting.</li>
          <li><strong>No appeals for SH tags.</strong> Scam Host designations are final and not subject to appeal.</li>
        </ul>
      </RuleCategory>
    </main>
  );
}
