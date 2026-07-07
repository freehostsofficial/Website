"use client";

import Link from "@/components/NoPrefetchLink";
import { ArrowRight, Check, CircleHelp } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

const inviteUrl = "https://discord.gg/QbeZ3b5CQd";

export default function SubmitHostClient() {
  return (
    <main className="submit-host-page">
      <section className="submit-hero">
        <div className="wrap">
          <h1 className="submit-title">Join the FreeHosts Directory</h1>
          <p className="submit-subtitle">
            Help the community discover reliable, zero-cost hosting by submitting a provider.
          </p>
        </div>
      </section>

      <section className="submit-content wrap">
        <div className="submit-grid">
          <div className="submit-guide">
            <h2 className="section-title">Submission Guide</h2>
            <p className="section-sub">Follow these steps to get your host listed.</p>

            <div className="step-card">
              <div className="step-num">01</div>
              <div className="step-content">
                <h3>Review Requirements</h3>
                <p>Ensure the host meets our security and service standards. It must offer a genuinely free plan (not a trial) available for at least 2 months.</p>
                <Link href="/submission-rules" className="step-link">
                  View Full Rules <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="step-card">
              <div className="step-num">02</div>
              <div className="step-content">
                <h3>Prepare the Layout</h3>
                <p>All submissions must follow our standardized Discord formatting. Use our Layout Builder tool to create a perfectly formatted message in seconds.</p>
                <Link href="/submit-layout" className="step-link">
                  Open Layout Builder <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="step-card">
              <div className="step-num">03</div>
              <div className="step-content">
                <h3>Post on Discord</h3>
                <p>Join our Discord server and navigate to the <strong>#add-host</strong>{" "}channel. Paste your formatted message there. Our curators will review it within 3-7 days.</p>
              </div>
            </div>
          </div>

          <aside className="submit-sidebar">
            <div className="info-card">
              <h3>Quick Checklist</h3>
              <ul className="checklist">
                <li><Check size={14} aria-hidden="true" /> Public ToS &amp; Privacy Policy</li>
                <li><Check size={14} aria-hidden="true" /> Genuinely Free (No Trials)</li>
                <li><Check size={14} aria-hidden="true" /> Stable Performance</li>
                <li><Check size={14} aria-hidden="true" /> No Nulled/Illegal Content</li>
                <li><Check size={14} aria-hidden="true" /> Detailed Specs Provided</li>
              </ul>
            </div>

            <div className="cta-card">
              <h3>Ready to Submit?</h3>
              <p>The quickest way to get listed is via our active Discord community.</p>
              <a href={inviteUrl} target="_blank" rel="noopener noreferrer" className="btn primary full">
                <FontAwesomeIcon icon={faDiscord} aria-hidden="true" /> Join Discord to Submit
              </a>
              <p className="support-text">
                Need help with a listing? Contact us at{" "}
                <a href={"mailto:support@" + process.env.EMAIL_DOMAIN}>support@{process.env.EMAIL_DOMAIN}</a>
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="faq-teaser wrap">
        <h2 className="section-title">Common Questions</h2>
        <div className="teaser-grid">
          <div className="teaser-item">
            <h4>How long does review take?</h4>
            <p>Typically 3-7 days depending on volume.</p>
          </div>
          <div className="teaser-item">
            <h4>Can I update my listing?</h4>
            <p>Yes, contact us on Discord or via email anytime.</p>
          </div>
          <div className="teaser-item">
            <h4>Is there a fee?</h4>
            <p>No, listing on FreeHosts is completely free.</p>
          </div>
        </div>
        <div className="teaser-action">
          <Link href="/faq" className="btn ghost">
            View All FAQs <CircleHelp size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
