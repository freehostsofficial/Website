import ProsePage from "@/components/ProsePage";
import { pageMeta } from "../../lib/pageMeta";

const TITLE = "Disclaimer - FreeHosts";
const DESCRIPTION =
  "Read the FreeHosts Disclaimer. Understand the limits of our listings, specs, community reviews, and links to external hosting providers.";
const SOCIAL_DESCRIPTION =
  "The limits of FreeHosts listings, specs, reviews, and external links.";

export const metadata = pageMeta({
  path: "/disclaimer",
  title: TITLE,
  description: DESCRIPTION,
  ogDescription: SOCIAL_DESCRIPTION,
  keywords: ["freehosts disclaimer", "hosting directory disclaimer", "freehosts liability"],
  imageAlt: "FreeHosts - Disclaimer",
});

export default function DisclaimerPage() {
  const supportEmail = `support@${process.env.EMAIL_DOMAIN}`;
  return (
    <ProsePage path="/disclaimer" crumb="Disclaimer" name={TITLE} description={SOCIAL_DESCRIPTION}>
      <div className="tos-content wrap">
        <h1>DISCLAIMER</h1>
        <p className="last-updated">
          <strong>Last updated</strong> September 4, 2026
        </p>

        <div className="toc">
          <h2>TABLE OF CONTENTS</h2>
          <ul>
            <li>
              <a href="#summary">SUMMARY OF KEY POINTS</a>
            </li>
            <li>
              <a href="#directory">1. WHAT FREEHOSTS IS</a>
            </li>
            <li>
              <a href="#specs">2. LISTINGS AND SPECIFICATIONS</a>
            </li>
            <li>
              <a href="#reviews">3. COMMUNITY REVIEWS AND SCORES</a>
            </li>
            <li>
              <a href="#external">4. EXTERNAL WEBSITES</a>
            </li>
            <li>
              <a href="#advice">5. NO PROFESSIONAL ADVICE</a>
            </li>
            <li>
              <a href="#liability">6. LIMITATION OF LIABILITY</a>
            </li>
            <li>
              <a href="#report">7. REPORT A PROBLEM</a>
            </li>
            <li>
              <a href="#contact">8. HOW CAN YOU CONTACT US ABOUT THIS DISCLAIMER?</a>
            </li>
          </ul>
        </div>

        <h2 id="summary">SUMMARY OF KEY POINTS</h2>

        <div className="highlight-box">
          <p>
            <strong>FreeHosts is a curated directory, not a provider.</strong> We do not host your
            projects, sell hosting, or operate any listed service. Specs are published by the
            providers, scores are community opinions, and external sites are outside our control.
            Always verify critical details on the provider&apos;s own website before committing a
            project.
          </p>
        </div>

        <p>
          This Disclaimer is a plain-language companion to our{" "}
          <a href="/tos">Terms of Service</a>. If anything here conflicts with the Legal Terms,
          the Legal Terms prevail.
        </p>

        <hr className="section-divider" />

        <h2 id="directory">1. WHAT FREEHOSTS IS</h2>

        <p>
          FreeHosts is a non-commercial, community-curated directory of free hosting providers,
          operated from Portugal on a volunteer basis. Our curators select, organise, and describe
          listings editorially so providers can be compared side by side. We publish no paid
          placements, run no advertising, and earn no affiliate revenue.
        </p>

        <p>
          Because our listings are curated rather than automatic, errors and outdated information
          can occur despite our review process. Curation is a voluntary effort to keep the
          directory useful; it is not a guarantee of completeness or accuracy.
        </p>

        <hr className="section-divider" />

        <h2 id="specs">2. LISTINGS AND SPECIFICATIONS</h2>

        <p>
          Specifications shown on listings (CPU, RAM, storage, languages, limits, idle policies,
          and status) are taken from the providers&apos; own published plan pages and community
          reports. Providers change free tiers frequently — resources get cut, policies tighten,
          services shut down — so a listing may be out of date even if its status badge says
          otherwise.
        </p>

        <p>
          We do not run benchmark rigs or independently measure provider performance. Treat listed
          specs as a starting point for shortlisting, and confirm anything critical on the
          provider&apos;s own website before deploying, especially for production use. See our{" "}
          <a href="/methodology">methodology</a> for exactly how listings are verified.
        </p>

        <hr className="section-divider" />

        <h2 id="reviews">3. COMMUNITY REVIEWS AND SCORES</h2>

        <p>
          Approval percentages, star ratings, and up/down counts reflect the opinions and
          experiences of community members — uptime they observed, support they received, and
          whether a free plan delivered what it promised. They are not expert measurements, and a
          score built on a handful of reviews is an early signal, not a verdict.
        </p>

        <p>
          Reviews are moderated against our <a href="/server-rules">server rules</a> and{" "}
          <a href="/submission-rules">submission rules</a>, but we cannot verify every
          reviewer&apos;s experience. A high score does not mean a provider is right for your
          project, and a low score does not mean it is wrong for it.
        </p>

        <hr className="section-divider" />

        <h2 id="external">4. EXTERNAL WEBSITES</h2>

        <p>
          Outbound links lead to websites we neither operate nor control. Listing a provider does
          not endorse it, and linking to it does not make us responsible for its content,
          security practices, pricing changes, terms, or availability.
        </p>

        <p>
          When you follow an outbound link you pass through our redirect interstitial, which warns
          you that you are leaving FreeHosts and blocks URLs that were never registered with the
          listed host. Beyond that screen, you browse the external site at your own risk and under
          its own terms and privacy policy.
        </p>

        <hr className="section-divider" />

        <h2 id="advice">5. NO PROFESSIONAL ADVICE</h2>

        <p>
          Nothing on FreeHosts — listings, comparisons, categories, guides, or FAQ answers —
          constitutes professional, legal, financial, or security advice. Choosing where to deploy
          is your decision and your responsibility. If downtime, data loss, or insecurity would
          hurt you, validate providers yourself and keep independent backups before committing
          anything important.
        </p>

        <hr className="section-divider" />

        <h2 id="liability">6. LIMITATION OF LIABILITY</h2>

        <p>
          To the fullest extent permitted by law, FreeHosts, its volunteers, and its agents are
          not liable for any loss or damage arising from your use of, or reliance on, listings,
          specs, scores, or external websites — including provider shutdowns, plan changes, data
          loss, or service interruptions. The Services are provided on an &ldquo;as-is&rdquo; and
          &ldquo;as-available&rdquo; basis, as set out in Sections 16 and 17 of our{" "}
          <a href="/tos">Terms of Service</a>.
        </p>

        <hr className="section-divider" />

        <h2 id="report">7. REPORT A PROBLEM</h2>

        <p>
          Spotted an outdated spec, a dead provider, or a misleading listing? Flag it in our{" "}
          <a href="https://discord.gg/QbeZ3b5CQd" target="_blank" rel="noopener noreferrer">
            Discord community
          </a>{" "}
          and curators will correct or remove it, usually within days. If you believe a listing
          or other content is illegal, report it to{" "}
          <a href={"mailto:legal@" + process.env.EMAIL_DOMAIN}>
            legal@{process.env.EMAIL_DOMAIN}
          </a>{" "}
          as described in Section 23 of our <a href="/tos">Terms of Service</a> — we review every
          report and act on confirmed illegal content.
        </p>

        <hr className="section-divider" />

        <h2 id="contact">8. HOW CAN YOU CONTACT US ABOUT THIS DISCLAIMER?</h2>

        <p>
          If you have questions about this Disclaimer, you may email us at{" "}
          <a href={"mailto:" + supportEmail}>{supportEmail}</a>.
        </p>

        <div className="highlight-box">
          <p>
            <strong>FreeHosts</strong> — non-commercial community project, Portugal
            <br />
            Legal matters:{" "}
            <a href={"mailto:legal@" + process.env.EMAIL_DOMAIN}>
              legal@{process.env.EMAIL_DOMAIN}
            </a>
            <br />
            General questions: <a href={"mailto:" + supportEmail}>{supportEmail}</a>
          </p>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "var(--muted)",
            marginTop: "3rem",
          }}
        >
          This disclaimer was last updated on September 4, 2026
        </p>
      </div>
    </ProsePage>
  );
}
