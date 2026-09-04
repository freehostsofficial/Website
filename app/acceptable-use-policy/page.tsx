import ProsePage from "@/components/ProsePage";
import { pageMeta } from "../../lib/pageMeta";

const TITLE = "Acceptable Use Policy - FreeHosts";
const DESCRIPTION =
  "Read the FreeHosts Acceptable Use Policy. Learn what is and isn't allowed when using our free hosting directory and community.";
const SOCIAL_DESCRIPTION =
  "What is and isn't allowed when using FreeHosts.";

export const metadata = pageMeta({
  path: "/acceptable-use-policy",
  title: TITLE,
  description: DESCRIPTION,
  ogDescription: SOCIAL_DESCRIPTION,
  keywords: ["freehosts acceptable use policy", "freehosts aup", "hosting directory rules"],
  imageAlt: "FreeHosts - Acceptable Use Policy",
});

const PROHIBITED: string[] = [
  "Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.",
  "Make any unauthorised use of the Services, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretences.",
  "Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Services and/or the Content contained therein.",
  "Engage in unauthorised framing of or linking to the Services.",
  "Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.",
  "Make improper use of our Services, including our support services, or submit false reports of abuse or misconduct.",
  "Engage in any automated use of the Services, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.",
  "Interfere with, disrupt, or create an undue burden on the Services or the networks connected to the Services.",
  "Attempt to impersonate another user or person or use the username of another user.",
  "Use any information obtained from the Services in order to harass, abuse, or harm another person.",
  "Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavour or commercial enterprise.",
  "Decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services, except as expressly permitted by applicable law.",
  "Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services, or any portion of the Services.",
  "Harass, annoy, intimidate, or threaten any of our volunteers or agents engaged in providing any portion of the Services to you.",
  "Delete the copyright or other proprietary rights notice from any Content.",
  "Copy or adapt the Services' software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.",
  "Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party's uninterrupted use and enjoyment of the Services or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Services.",
  "Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats ('gifs'), 1\u00D71 pixels, web bugs, cookies, or other similar devices (sometimes referred to as 'spyware' or 'passive collection mechanisms' or 'pcms').",
  "Except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Services, or use or launch any unauthorised script or other software.",
  "Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.",
  "Use the Services in a manner inconsistent with any applicable laws or regulations.",
];

export default function AcceptableUsePolicyPage() {
  const supportEmail = `support@${process.env.EMAIL_DOMAIN}`;
  return (
    <ProsePage path="/acceptable-use-policy" crumb="Acceptable Use Policy" name={TITLE} description={SOCIAL_DESCRIPTION}>
      <div className="tos-content wrap">
        <h1>ACCEPTABLE USE POLICY</h1>
        <p className="last-updated">
          <strong>Last updated</strong> September 04, 2026
        </p>

        <div className="toc">
          <h2>TABLE OF CONTENTS</h2>
          <ul>
            <li>
              <a href="#agreement">AGREEMENT TO THIS POLICY</a>
            </li>
            <li>
              <a href="#who">1. WHO WE ARE</a>
            </li>
            <li>
              <a href="#rules">2. USE OF THE SERVICES</a>
            </li>
            <li>
              <a href="#consequences">3. CONSEQUENCES OF BREACHING THIS POLICY</a>
            </li>
            <li>
              <a href="#contact">4. HOW CAN YOU CONTACT US ABOUT THIS POLICY?</a>
            </li>
          </ul>
        </div>

        <h2 id="agreement">AGREEMENT TO THIS POLICY</h2>

        <div className="highlight-box">
          <p>
            <strong>IMPORTANT:</strong> This Acceptable Use Policy is part of our{" "}
            <a href="/tos">Terms of Service</a>. By accessing the Services, you agree to be bound
            by it. If you do not agree, you must discontinue use immediately.
          </p>
        </div>

        <p>This Policy applies to:</p>

        <ul>
          <li>(a) all uses of our Services (as defined in the Legal Terms);</li>
          <li>
            (b) any content you submit to us, such as host submissions, feedback, reviews, and
            messages.
          </li>
        </ul>

        <hr className="section-divider" />

        <h2 id="who">1. WHO WE ARE</h2>

        <p>
          We are <strong>FreeHosts</strong>, a non-commercial community project based in Portugal.
          We are not a registered company and operate on a volunteer basis. We operate the website{" "}
          <span style={{ color: "rgb(0, 58, 250)" }}>{process.env.RAW_APP_URL}</span> as well as
          any other related products and services that refer or link to this Policy (collectively,
          the <strong>Services</strong>).
        </p>

        <hr className="section-divider" />

        <h2 id="rules">2. USE OF THE SERVICES</h2>

        <p>
          When you use the Services, you warrant that you will comply with this Policy and with
          all applicable laws.
        </p>

        <p>You also acknowledge that you may not:</p>

        <ul>
          {PROHIBITED.map((item) => (
            <li key={item.slice(0, 32)}>{item}</li>
          ))}
        </ul>

        <hr className="section-divider" />

        <h2 id="consequences">3. CONSEQUENCES OF BREACHING THIS POLICY</h2>

        <p>
          The consequences for violating our Policy will vary depending on the severity of the
          breach and the user&apos;s history on the Services, by way of example:
        </p>

        <p>
          We may, in some cases, give you a warning; however, if your breach is serious or if you
          continue to breach our Legal Terms and this Policy, we have the right to suspend or
          terminate your access to and use of our Services. We may also notify law enforcement or
          issue legal proceedings against you when we believe that there is a genuine risk to an
          individual or a threat to public safety.
        </p>

        <p>
          We exclude our liability for all action we may take in response to any of your breaches
          of this Policy.
        </p>

        <hr className="section-divider" />

        <h2 id="contact">4. HOW CAN YOU CONTACT US ABOUT THIS POLICY?</h2>

        <p>
          If you have any further questions or comments, you may contact us by email at{" "}
          <a href={"mailto:" + supportEmail}>{supportEmail}</a>.
        </p>

        <div className="highlight-box">
          <p>
            <strong>FreeHosts</strong> — non-commercial community project, Portugal
            <br />
            Legal matters (breaches, appeals, takedowns):{" "}
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
          This acceptable use policy was last updated on September 04, 2026
        </p>
      </div>
    </ProsePage>
  );
}
