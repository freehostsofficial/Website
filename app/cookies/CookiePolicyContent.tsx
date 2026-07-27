"use client";

import React from "react";
import { useConsent } from "@/contexts/ConsentContext";
import { Cookie, ShieldCheck, Sparkles, BarChart3, Check, X, Settings2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CookiePolicyContent() {
  const supportEmail = `support@${process.env.EMAIL_DOMAIN}`;
  const siteUrl = process.env.RAW_APP_URL ?? "freehosts.eu";

  return (
    <div className="tos-content">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-secondary" aria-hidden="true">
          <Cookie className="size-7" />
        </div>
        <h1>Cookie Policy</h1>
        <p className="last-updated !mb-0">Last updated July 25, 2026</p>
        <p className="max-w-lg !text-muted-foreground">
          This page explains, in plain terms, exactly which cookies FreeHosts
          uses, why, and how you can control them. It supplements our{" "}
          <a href="/privacy-policy">Privacy Policy</a> and{" "}
          <a href="/tos">Terms of Service</a>.
        </p>
      </div>

      <CookiePreferenceCenter />

      <CookieCategory
        icon={<ShieldCheck className="size-5" />}
        tag="Always on"
        tagVariant="outline"
        title="Essential cookies"
        description="Required for FreeHosts to function. These can't be switched off and are never used for tracking or advertising."
        rows={[
          {
            name: "fh_legal_consent",
            purpose: "Remembers whether you've agreed to our Terms of Service and Privacy Policy.",
            provider: `${siteUrl} (first-party)`,
            expires: "90 days if agreed; session only if declined",
          },
          {
            name: "fh_cookie_prefs",
            purpose: "Stores your cookie preferences so we don't ask again every visit.",
            provider: `${siteUrl} (first-party)`,
            expires: "90 days",
          },
        ]}
      />

      <CookieCategory
        icon={<Sparkles className="size-5" />}
        tag="Always on"
        tagVariant="outline"
        title="Performance & functionality cookies"
        description="Make specific features work — saved hosts, theme, and the live Discord widget. Without them those features degrade gracefully but won't work fully."
        rows={[
          {
            name: "fh_theme",
            purpose: "Remembers your light/dark mode preference. Mirrored in local storage.",
            provider: `${siteUrl} (first-party)`,
            expires: "1 year",
          },
          {
            name: "fh_favorites",
            purpose: "Remembers which hosts you've saved on FreeHosts.",
            provider: `${siteUrl} (first-party)`,
            expires: "90 days",
          },
          {
            name: "__dcfduid",
            purpose: (
              <>
                Set by Discord when our homepage requests live server data
                (member count, invite info). Used by Discord for security and
                abuse prevention. Controlled entirely by Discord — see{" "}
                <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer">
                  Discord&apos;s Privacy Policy
                </a>
                .
              </>
            ),
            provider: "discord.com (third-party)",
            expires: "~5 years",
          },
          {
            name: "_cfuvid",
            purpose: (
              <>
                Set by Cloudflare, which fronts Discord&apos;s API, to
                distinguish trusted traffic. See{" "}
                <a
                  href="https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cloudflare&apos;s cookie policy
                </a>
                .
              </>
            ),
            provider: "discord.com via Cloudflare (third-party)",
            expires: "Session",
          },
        ]}
      />

      <CookieCategory
        icon={<BarChart3 className="size-5" />}
        tag="Optional — off by default"
        tagVariant="secondary"
        title="Analytics & customization cookies"
        description="Help us understand aggregate site usage via Matomo, a self-hosted analytics platform (not Google Analytics). Nothing here loads or sets a cookie until you opt in above."
        rows={[
          {
            name: "_pk_id#",
            purpose: "Anonymous statistics on your visits — pages read, time spent, number of visits.",
            provider: `${siteUrl} (first-party, self-hosted Matomo)`,
            expires: "13 months",
          },
          {
            name: "_pk_ses#",
            purpose: "Tracks your current session so page views are grouped together.",
            provider: `${siteUrl} (first-party, self-hosted Matomo)`,
            expires: "30 minutes",
          },
          {
            name: "_pk_ref#",
            purpose: "Stores how you arrived at the site, for attribution reporting.",
            provider: `${siteUrl} (first-party, self-hosted Matomo)`,
            expires: "6 months",
          },
        ]}
      />

      <div>
        <h2>How can I control cookies on my browser?</h2>
        <p>
          Besides the preference center above, you can also refuse cookies
          through your browser&apos;s own settings. The controls vary by
          browser — see the help pages for{" "}
          <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
            Chrome
          </a>
          ,{" "}
          <a
            href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
            target="_blank"
            rel="noopener noreferrer"
          >
            Firefox
          </a>
          ,{" "}
          <a href="https://support.apple.com/en-ie/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
            Safari
          </a>
          ,{" "}
          <a
            href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd"
            target="_blank"
            rel="noopener noreferrer"
          >
            Edge
          </a>
          , and{" "}
          <a href="https://help.opera.com/en/latest/web-preferences/" target="_blank" rel="noopener noreferrer">
            Opera
          </a>
          . Blocking essential cookies may prevent parts of FreeHosts — like
          saved hosts or your theme — from working correctly.
        </p>

        <h2>Do you use web beacons or targeted advertising?</h2>
        <p>
          No. We don&apos;t use web beacons, tracking pixels, or advertising
          cookies of any kind, and we don&apos;t serve targeted or behavioral
          advertising.
        </p>

        <h2>How often will you update this policy?</h2>
        <p>
          We may update this Cookie Policy from time to time to reflect
          changes to the cookies we use or for legal reasons. The date at the
          top of this page shows when it was last updated — check back
          periodically.
        </p>

        <h2>Questions?</h2>
        <p>
          Contact us at <a href={"mailto:" + supportEmail}>{supportEmail}</a>.
        </p>
      </div>
    </div>
  );
}

function CookiePreferenceCenter() {
  const { openCookiePreferences, acceptAllCookies, rejectNonEssentialCookies, cookiePrefs, cookieConsentStatus } =
    useConsent();

  return (
    <Card className="my-8">
      <CardContent className="flex flex-col gap-4">
        <h2 className="!mt-0">Cookie Preference Center</h2>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Analytics cookies:</span>
          {cookieConsentStatus === "unknown" ? (
            <Badge variant="outline">Not yet set</Badge>
          ) : cookiePrefs.analytics ? (
            <Badge variant="success" className="gap-1">
              <Check className="size-3" />
              Allowed
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <X className="size-3" />
              Rejected
            </Badge>
          )}
          <span>· Essential cookies: always on</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="gap-1.5" onClick={acceptAllCookies}>
            <Check className="size-3.5" />
            Accept all
          </Button>
          <Button variant="outline" onClick={rejectNonEssentialCookies}>
            Reject non-essential
          </Button>
          <Button variant="outline" className="gap-1.5" onClick={openCookiePreferences}>
            <Settings2 className="size-3.5" />
            Customize preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface CookieRow {
  name: string;
  purpose: React.ReactNode;
  provider: string;
  expires: string;
}

function CookieCategory({
  icon,
  tag,
  tagVariant,
  title,
  description,
  rows,
}: {
  icon: React.ReactNode;
  tag: string;
  tagVariant: "outline" | "secondary";
  title: string;
  description: string;
  rows: CookieRow[];
}) {
  return (
    <div className="my-8">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary">{icon}</div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="!mt-0">{title}</h3>
            <Badge variant={tagVariant}>{tag}</Badge>
          </div>
          <p className="!mb-0">{description}</p>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Expires</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="whitespace-nowrap">
                  <code>{row.name}</code>
                </TableCell>
                <TableCell className="max-w-xs min-w-48 text-wrap text-muted-foreground">{row.purpose}</TableCell>
                <TableCell className="text-muted-foreground">{row.provider}</TableCell>
                <TableCell className="text-muted-foreground">{row.expires}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
