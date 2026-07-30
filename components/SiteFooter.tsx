import Image from "next/image";
import Link from "next/link";
import { DiscordIcon, GitHubIcon, InstagramIcon, TwitterIcon } from "@/components/icons";
import { Mail } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import CookiePreferencesLink from "@/components/CookiePreferencesLink";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/hosts", label: "Browse Hosts" },
      { href: "/about", label: "About Us" },
      { href: "/staff", label: "Our Team" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Submit",
    links: [
      { href: "/submit-host", label: "Submit a Host" },
      { href: "/submit-layout", label: "Submit Layout" },
      { href: "/submission-rules", label: "Submission Rules" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/tos", label: "Terms of Service" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/cookies", label: "Cookie Policy" },
      { href: "/server-rules", label: "Server Rules" },
    ],
  },
];

export default function SiteFooter({
  trustpilotUrl,
  emailDomain,
}: {
  trustpilotUrl?: string;
  emailDomain?: string;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 font-semibold">
            <Image src="/Src/icons/icon.png" alt="FreeHosts" width={24} height={24} />
            FreeHosts
          </div>
          <p className="text-sm text-muted-foreground">
            Discover free hosting that just works.
          </p>
          <div className="flex items-center gap-3 text-muted-foreground">
            <a
              href="https://discord.gg/QbeZ3b5CQd"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="transition-all duration-200 hover:text-foreground hover:scale-110"
            >
              <DiscordIcon className="size-4" />
            </a>
            <a
              href="https://x.com/freehosts_"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="transition-all duration-200 hover:text-foreground hover:scale-110"
            >
              <TwitterIcon className="size-4" />
            </a>
            <a
              href="https://www.instagram.com/freehosts/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition-all duration-200 hover:text-foreground hover:scale-110"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href="https://github.com/freehostsofficial"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="transition-all duration-200 hover:text-foreground hover:scale-110"
            >
              <GitHubIcon className="size-4" />
            </a>
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.title} className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-foreground">{column.title}</h3>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors duration-200 hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
              {column.title === "Explore" && trustpilotUrl && (
                <li>
                  <a
                    href={trustpilotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground"
                  >
                    Trustpilot
                  </a>
                </li>
              )}
              {column.title === "Legal" && (
                <li>
                  <CookiePreferencesLink />
                </li>
              )}
            </ul>
          </div>
        ))}

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-foreground">Contact</h3>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li>
              <a
                href={`mailto:support@${emailDomain}`}
                className="flex items-center gap-2 transition-colors duration-200 hover:text-foreground"
              >
                <Mail className="size-4" />
                support@{emailDomain}
              </a>
            </li>
            <li>
              <a
                href="https://discord.gg/QbeZ3b5CQd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors duration-200 hover:text-foreground"
              >
              <DiscordIcon className="size-4" />
                Join Discord
              </a>
            </li>
          </ul>
        </div>
      </div>

      <Separator />

      <div className="mx-auto flex max-w-[1200px] flex-col-reverse items-center gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
        <p>© 2024-{year} FreeHosts. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <Link href="/tos" className="hover:text-foreground">Terms</Link>
          <span aria-hidden="true">·</span>
          <Link href="/privacy-policy" className="hover:text-foreground">Privacy</Link>
          <span aria-hidden="true">·</span>
          <Link href="/cookies" className="hover:text-foreground">Cookies</Link>
          <span aria-hidden="true">·</span>
          <a href={`mailto:support@${emailDomain}`} className="hover:text-foreground">Contact</a>
        </div>
      </div>
    </footer>
  );
}
