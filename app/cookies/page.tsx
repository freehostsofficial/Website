import ProsePage from "@/components/ProsePage";
import { pageMeta } from "../../lib/pageMeta";

const TITLE = "Cookie Policy - FreeHosts";
const DESCRIPTION =
  "Read the FreeHosts Cookie Policy. Learn which cookies we use, how long they last, and how to change your choices at any time.";
const SOCIAL_DESCRIPTION =
  "Which cookies FreeHosts uses, how long they last, and how to change your choices.";

export const metadata = pageMeta({
  path: "/cookies",
  title: TITLE,
  description: DESCRIPTION,
  ogDescription: SOCIAL_DESCRIPTION,
  keywords: ["freehosts cookie policy", "freehosts cookies", "cookie settings"],
  imageAlt: "FreeHosts - Cookie Policy",
});

export default function CookiePolicyPage() {
  const supportEmail = `support@${process.env.EMAIL_DOMAIN}`;
  return (
    <ProsePage path="/cookies" crumb="Cookie Policy" name={TITLE} description={SOCIAL_DESCRIPTION}>
      <div className="tos-content wrap">
        <h1>COOKIE POLICY</h1>
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
              <a href="#what">1. WHAT ARE COOKIES?</a>
            </li>
            <li>
              <a href="#why">2. WHY DO WE USE COOKIES?</a>
            </li>
            <li>
              <a href="#inventory">3. WHICH COOKIES DO WE USE?</a>
            </li>
            <li>
              <a href="#control">4. HOW CAN I CONTROL COOKIES?</a>
            </li>
            <li>
              <a href="#contact">5. HOW CAN YOU CONTACT US ABOUT THIS POLICY?</a>
            </li>
          </ul>
        </div>

        <h2 id="summary">SUMMARY OF KEY POINTS</h2>

        <div className="highlight-box">
          <p>
            <strong>First-party only.</strong> We set no third-party cookies: no advertising
            cookies, no cross-site trackers, no social media widgets. Our server sets no cookies
            of its own.
          </p>
        </div>

        <p>
          <strong>What do we store?</strong> Your consent choice (essential), your preferences
          such as theme and saved hosts (only if you enable them), and — only with your prior
          opt-in consent — self-hosted Matomo analytics.
        </p>

        <p>
          <strong>How do I change my choices?</strong> At any time via{" "}
          <strong>Cookie Settings</strong> in the site footer. Your choice is remembered for 6
          months, then we ask again.
        </p>

        <hr className="section-divider" />

        <h2 id="what">1. WHAT ARE COOKIES?</h2>

        <p>
          Cookies are small data files that are placed on your computer or mobile device when you
          visit a website. Cookies are widely used by website owners in order to make their
          websites work, or to work more efficiently, as well as to provide reporting
          information.
        </p>

        <p>
          Cookies set by the website owner (in this case, FreeHosts) are called{" "}
          <strong>first-party cookies</strong>. All cookies and browser storage listed on this
          page are first-party: nothing on our Website allows a third party to store anything in
          your browser.
        </p>

        <hr className="section-divider" />

        <h2 id="why">2. WHY DO WE USE COOKIES?</h2>

        <p>
          Some cookies are required for technical reasons in order for our Website to operate, and
          we refer to these as <strong>essential</strong> or{" "}
          <strong>strictly necessary</strong> cookies: they remember the privacy choice you make
          in our cookie banner.
        </p>

        <p>
          Other cookies remember your preferences (theme, saved hosts, comparison list) — but only
          if you explicitly enable that category in the banner.
        </p>

        <p>
          Finally, only with your prior opt-in consent, our self-hosted Matomo analytics measures
          visits in aggregate so we can understand how the Website is used. If you decline, the
          Matomo script is never loaded and no analytics storage is set.
        </p>

        <p>
          We do not use third-party analytics, advertising cookies, Flash cookies, web beacons,
          or email tracking.
        </p>

        <hr className="section-divider" />

        <h2 id="inventory">3. WHICH COOKIES DO WE USE?</h2>

        <p>
          This list is complete: it covers everything our Website stores in your browser. Our
          server sets no cookies of its own.
        </p>

        <h3>Strictly necessary (always on)</h3>

        <table className="policy-table">
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Purpose</th>
              <th>Expires</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>fh_consent</td>
              <td>
                Remembers the cookie choice you made in our banner, so we do not ask on every
                page.
              </td>
              <td>6 months</td>
            </tr>
          </tbody>
        </table>

        <h3>Preferences (only if you enable them)</h3>

        <table className="policy-table">
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Purpose</th>
              <th>Expires</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>fh_favorites</td>
              <td>Remembers the hosts you saved to your Saved list.</td>
              <td>90 days</td>
            </tr>
            <tr>
              <td>fh_theme</td>
              <td>
                Remembers your dark / light mode choice. Kept in your browser only
                (localStorage) and never sent to our servers.
              </td>
              <td>Until you clear it</td>
            </tr>
            <tr>
              <td>fh_comparison</td>
              <td>
                Remembers the hosts in your comparison tray while you browse. Kept in your
                browser only (sessionStorage) and never sent to our servers.
              </td>
              <td>When you close the tab</td>
            </tr>
          </tbody>
        </table>

        <h3>Statistics (only with your opt-in consent)</h3>

        <table className="policy-table">
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Purpose</th>
              <th>Expires</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Matomo _pk_id.*</td>
              <td>Counts visits and recognizes returning visitors in aggregate.</td>
              <td>13 months</td>
            </tr>
            <tr>
              <td>Matomo _pk_ses.*</td>
              <td>Detects repeat visits within a short window.</td>
              <td>30 minutes</td>
            </tr>
          </tbody>
        </table>

        <p>
          Both Matomo cookies are first-party, served by our self-hosted Matomo instance. No
          analytics data is shared with third parties.
        </p>

        <hr className="section-divider" />

        <h2 id="control">4. HOW CAN I CONTROL COOKIES?</h2>

        <p>
          You have the right to decide whether to accept or reject cookies. Our cookie banner
          lets you accept all cookies, reject all of them, or toggle the Preferences and
          Statistics categories individually. Essential cookies cannot be rejected as they are
          strictly necessary to provide you with services.
        </p>

        <ul>
          <li>
            Click <strong>Cookie Settings</strong> in the site footer at any time to reopen the
            banner and change your choices.
          </li>
          <li>Choosing &ldquo;Reject all&rdquo; clears anything a declined category stored before.</li>
          <li>
            You can also remove cookies in your browser settings; note this may affect saved hosts
            or your theme.
          </li>
        </ul>

        <p>
          If you choose to reject cookies, you may still use our Website, though some
          functionality (such as saved hosts or visit measurement) will be unavailable.
        </p>

        <hr className="section-divider" />

        <h2 id="contact">5. HOW CAN YOU CONTACT US ABOUT THIS POLICY?</h2>

        <p>
          If you have questions about our use of cookies, you may email us at{" "}
          <a href={"mailto:" + supportEmail}>{supportEmail}</a>.
        </p>

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
          This cookie policy was last updated on September 4, 2026
        </p>
      </div>
    </ProsePage>
  );
}
