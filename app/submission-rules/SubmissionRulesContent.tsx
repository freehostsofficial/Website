import React from "react";
import Link from "@/components/SiteLink";
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

export default function SubmissionRulesContent() {
  const supportEmail = `support@${process.env.EMAIL_DOMAIN}`;
  return (
    <div className="rules-container">
      <section className="rules-hero">
        <h1 className="rules-title">Hosting Submission Rules</h1>
        <p className="rules-subtitle">
          Read every rule carefully before submitting. Submissions that do not meet these standards will be rejected without review.
        </p>
        <div className="rules-meta">
          <span className="rules-meta-item"><Clock size={13} aria-hidden="true" /> Last updated: April 26, 2026</span>
        </div>
        <div className="rules-notice">
          <AlertTriangle size={16} aria-hidden="true" />
          <span>Violations may result in permanent blacklisting from the directory.</span>
        </div>
      </section>

      {/* Quick summary */}
      <section className="rules-summary">
        <div className="rules-summary-grid">
          <div className="rules-summary-item allowed">
            <CheckCircle size={16} aria-hidden="true" />
            <span>Genuine free plans (not trials)</span>
          </div>
          <div className="rules-summary-item allowed">
            <CheckCircle size={16} aria-hidden="true" />
            <span>Coin/earning-based renewal systems</span>
          </div>
          <div className="rules-summary-item allowed">
            <CheckCircle size={16} aria-hidden="true" />
            <span>Public ToS &amp; Privacy Policy</span>
          </div>
          <div className="rules-summary-item allowed">
            <CheckCircle size={16} aria-hidden="true" />
            <span>Full specs listed per target</span>
          </div>
          <div className="rules-summary-item denied">
            <XCircle size={16} aria-hidden="true" />
            <span>Trial-only or invite-gated plans</span>
          </div>
          <div className="rules-summary-item denied">
            <XCircle size={16} aria-hidden="true" />
            <span>Nulled software or malware</span>
          </div>
          <div className="rules-summary-item denied">
            <XCircle size={16} aria-hidden="true" />
            <span>False or exaggerated specs</span>
          </div>
          <div className="rules-summary-item denied">
            <XCircle size={16} aria-hidden="true" />
            <span>Invite requirements for free plans</span>
          </div>
        </div>
      </section>

      <section className="rule-category">
        <div className="category-header">
          <div className="category-icon"><Server size={20} aria-hidden="true" /></div>
          <div>
            <h2 className="category-title">Eligibility</h2>
            <p className="category-desc">Your host must meet all of these before submitting.</p>
          </div>
        </div>
        <div className="category-content">
          <ul>
            <li><strong>Genuinely free plan required.</strong> Trials, time-limited offers, or plans that require payment after a period do not qualify.</li>
            <li><strong>Minimum 2 months of operation.</strong> The free service must have been available and stable for at least 2 months before submission.</li>
            <li><strong>Open registration.</strong> Signup must be publicly accessible with no invite codes, waitlists, or manual approval gates.</li>
            <li><strong>Full specifications required.</strong> You must provide RAM, CPU (vCores), and disk space for every plan. &ldquo;Unlimited&rdquo; claims must be substantiated.</li>
            <li><strong>Separate specs per target.</strong> If your host offers different resources for different use cases (e.g. bots vs. websites), each must be listed separately.</li>
            <li><strong>Direct plan link required.</strong> You must provide a link that directly shows the free plan &mdash; not just the homepage.</li>
            <li><strong>Website or Discord required.</strong> At least one of a public website or Discord server must be provided.</li>
          </ul>
        </div>
      </section>

      <section className="rule-category">
        <div className="category-header">
          <div className="category-icon"><Lock size={20} aria-hidden="true" /></div>
          <div>
            <h2 className="category-title">Security</h2>
            <p className="category-desc">Minimum security standards all listed hosts must meet.</p>
          </div>
        </div>
        <div className="category-content">
          <ul>
            <li><strong>Password security.</strong> User passwords must be hashed and stored securely. Plain-text password storage is grounds for immediate removal.</li>
            <li><strong>DDoS protection.</strong> Basic anti-DDoS measures must be in place.</li>
            <li><strong>Secure authentication.</strong> Login systems must use HTTPS and protect against brute-force attacks.</li>
            <li><strong>No data harvesting.</strong> You may not collect, sell, or share user data beyond what is disclosed in your Privacy Policy.</li>
            <li><strong>Vulnerability disclosure.</strong> If a security issue is reported by our team or community, you must respond and remediate within a reasonable timeframe or face removal.</li>
          </ul>
        </div>
      </section>

      <section className="rule-category">
        <div className="category-header">
          <div className="category-icon"><FileText size={20} aria-hidden="true" /></div>
          <div>
            <h2 className="category-title">Legal &amp; Policies</h2>
            <p className="category-desc">All hosts must comply with applicable laws and platform rules.</p>
          </div>
        </div>
        <div className="category-content">
          <ul>
            <li><strong>Public ToS required.</strong> A Terms of Service document must be publicly accessible and linked in your submission.</li>
            <li><strong>Public Privacy Policy required.</strong> A Privacy Policy must be publicly accessible and linked in your submission.</li>
            <li><strong>Discord ToS compliance.</strong> Your service must comply with Discord&apos;s Terms of Service at all times.</li>
            <li><strong>Legal compliance.</strong> Your host must comply with all applicable local and international laws, including GDPR where relevant.</li>
            <li><strong>No illegal content.</strong> Hosting of illegal content, piracy, CSAM, or any content that violates law is strictly prohibited and will result in permanent blacklisting.</li>
          </ul>
        </div>
      </section>

      <section className="rule-category">
        <div className="category-header">
          <div className="category-icon"><Code size={20} aria-hidden="true" /></div>
          <div>
            <h2 className="category-title">Software &amp; Infrastructure</h2>
            <p className="category-desc">Standards for the software and tools your host uses.</p>
          </div>
        </div>
        <div className="category-content">
          <ul>
            <li><strong>No nulled or cracked software.</strong> Using nulled themes, plugins, panels, or dashboards is prohibited and grounds for immediate removal.</li>
            <li><strong>No malware or spyware.</strong> Your platform must not contain or distribute malicious software of any kind.</li>
            <li><strong>Stable uptime.</strong> Your service must maintain reasonable uptime. Hosts with chronic downtime or instability will be reviewed for removal.</li>
            <li><strong>Functional panel or dashboard.</strong> Users must be able to manage their resources through a working control panel.</li>
          </ul>
        </div>
      </section>

      <section className="rule-category">
        <div className="category-header">
          <div className="category-icon"><Wrench size={20} aria-hidden="true" /></div>
          <div>
            <h2 className="category-title">Service Standards</h2>
            <p className="category-desc">What we expect from the service you provide to users.</p>
          </div>
        </div>
        <div className="category-content">
          <ul>
            <li><strong>Coin/earning systems are allowed.</strong> Plans that require earning coins through activity are permitted, provided the system is fair and clearly explained.</li>
            <li><strong>Invite requirements are NOT allowed.</strong> Free plans must not require users to invite others to unlock or maintain access.</li>
            <li><strong>No bait-and-switch.</strong> You may not advertise specs or features that are not actually available on the free plan.</li>
            <li><strong>Support availability.</strong> You must provide some form of user support (Discord, email, or ticket system).</li>
            <li><strong>Renewal transparency.</strong> If plans require renewal, the process, frequency, and any costs must be clearly stated.</li>
          </ul>
        </div>
      </section>

      <section className="rule-category">
        <div className="category-header">
          <div className="category-icon"><Repeat size={20} aria-hidden="true" /></div>
          <div>
            <h2 className="category-title">Renewal</h2>
            <p className="category-desc">Rules around plan renewal and expiry.</p>
          </div>
        </div>
        <div className="category-content">
          <ul>
            <li><strong>Clearly state renewal requirements.</strong> Specify whether plans auto-renew, require manual renewal, or never expire.</li>
            <li><strong>Include renewal frequency.</strong> State how often users must renew (e.g. every 30 days).</li>
            <li><strong>Include coin cost if applicable.</strong> If renewal requires coins or activity, state the exact amount required.</li>
            <li><strong>Grace period disclosure.</strong> If there is a grace period before a plan is suspended or deleted, it must be disclosed.</li>
          </ul>
        </div>
      </section>

      <section className="rule-category">
        <div className="category-header">
          <div className="category-icon"><LayoutTemplate size={20} aria-hidden="true" /></div>
          <div>
            <h2 className="category-title">Submission Format</h2>
            <p className="category-desc">Your submission must follow this exact format or it will be rejected.</p>
          </div>
        </div>
        <div className="category-content">
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
        </div>
      </section>

      <section className="rule-category">
        <div className="category-header">
          <div className="category-icon"><Handshake size={20} aria-hidden="true" /></div>
          <div>
            <h2 className="category-title">Conduct</h2>
            <p className="category-desc">How hosts and their representatives must behave in our community.</p>
          </div>
        </div>
        <div className="category-content">
          <ul>
            <li><strong>No false or exaggerated claims.</strong> Do not lie about specs, uptime, features, or plan availability.</li>
            <li><strong>No host shaming or drama.</strong> Attacking, mocking, or starting conflicts with other hosts is prohibited.</li>
            <li><strong>No poaching.</strong> Actively recruiting users away from other listed hosts is not allowed.</li>
            <li><strong>No sabotage.</strong> Filing false reports or attempting to get legitimate hosts removed is prohibited.</li>
            <li><strong>Respectful communication.</strong> All interactions with staff and community members must be professional and respectful.</li>
            <li><strong>No scams or deceptive advertising.</strong> Misleading users about your service in any way is grounds for immediate removal.</li>
          </ul>
        </div>
      </section>

      <section className="rule-category">
        <div className="category-header">
          <div className="category-icon"><ShieldAlert size={20} aria-hidden="true" /></div>
          <div>
            <h2 className="category-title">Ongoing Compliance</h2>
            <p className="category-desc">Being listed is not permanent — hosts are reviewed continuously.</p>
          </div>
        </div>
        <div className="category-content">
          <ul>
            <li><strong>Listings are reviewed periodically.</strong> Hosts that no longer meet standards will be flagged and may be removed.</li>
            <li><strong>Respond to staff requests.</strong> If our team contacts you about your listing, you must respond within a reasonable time. Ignoring staff may result in removal.</li>
            <li><strong>Update your listing when specs change.</strong> If your free plan changes significantly, you must notify us. Outdated or misleading listings will be corrected or removed.</li>
            <li><strong>Community reports are reviewed.</strong> User reports about a host&apos;s quality or conduct are taken seriously and investigated.</li>
          </ul>
        </div>
      </section>

      <section className="rule-category">
        <div className="category-header">
          <div className="category-icon"><Ban size={20} aria-hidden="true" /></div>
          <div>
            <h2 className="category-title">Enforcement</h2>
            <p className="category-desc">Consequences for rule violations.</p>
          </div>
        </div>
        <div className="category-content">
          <ul>
            <li><strong>Rejection.</strong> Submissions that do not meet requirements are rejected without review.</li>
            <li><strong>Removal.</strong> Listed hosts that violate rules will be removed from the directory.</li>
            <li><strong>BH (Bad Host) tag.</strong> Hosts removed for poor service, false specs, or instability may be tagged as Bad Host.</li>
            <li><strong>SH (Scam Host) tag.</strong> Hosts removed for scamming, deception, or illegal activity will be permanently tagged as Scam Host.</li>
            <li><strong>Permanent blacklist.</strong> Hosts tagged SH or repeat violators may be permanently blacklisted and banned from resubmitting.</li>
            <li><strong>No appeals for SH tags.</strong> Scam Host designations are final and not subject to appeal.</li>
          </ul>
        </div>
      </section>

      <footer className="rules-footer-info">
        <div className="highlight-box">
          <p>
            <strong>FreeHosts</strong> — non-commercial community project, Portugal
            <br />
            <a href={"mailto:" + supportEmail}>{supportEmail}</a>
          </p>
        </div>
        <p
          style={{
            textAlign: "center",
            color: "var(--muted)",
            marginTop: "3rem",
          }}
        >
          These submission rules were last updated on April 26, 2026
        </p>
      </footer>
    </div>
  );
}
