"use client";

import Link from "@/components/NoPrefetchLink";
import { ArrowRight, Check, CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";

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
              <a href={inviteUrl} target="_blank" rel="noopener noreferrer">
                <Button className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0741.0741 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.1776-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
                  Join Discord to Submit
                </Button>
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
          <Link href="/faq">
            <Button variant="ghost">
              View All FAQs <CircleHelp size={14} aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
