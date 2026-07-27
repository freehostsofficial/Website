"use client";

import Image from "next/image";
import Link from "@/components/NoPrefetchLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import {
  BookOpen,
  ChevronDown,
  CircleHelp,
  FileText,
  GitCompare,
  Info,
  Link as LinkIcon,
  ListChecks,
  Lock,
  Menu,
  Pencil,
  Plus,
  Scale,
  Server,
  Shield,
  Star,
  Upload,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

type NavLink = { href: string; icon: React.ReactNode; label: string };

const primaryLinks: NavLink[] = [
  { href: "/hosts", icon: <Server className="size-4" />, label: "Hosts" },
  { href: "/compare", icon: <GitCompare className="size-4" />, label: "Compare" },
  { href: "/staff", icon: <Users className="size-4" />, label: "Staff" },
  { href: "/faq", icon: <CircleHelp className="size-4" />, label: "FAQ" },
];

const submitLinks: NavLink[] = [
  { href: "/submit-host", icon: <Plus className="size-4" />, label: "Submit a Host" },
  { href: "/submit-layout", icon: <Pencil className="size-4" />, label: "Submit Layout" },
  { href: "/submission-rules", icon: <ListChecks className="size-4" />, label: "Submission Rules" },
];

const resourceLinks: NavLink[] = [
  { href: "/about", icon: <Info className="size-4" />, label: "About" },
  { href: "/saved", icon: <Star className="size-4" />, label: "Saved" },
  { href: "/server-rules", icon: <Shield className="size-4" />, label: "Server Rules" },
  { href: "/other-free-hosts", icon: <LinkIcon className="size-4" />, label: "Other Free Hosts" },
];

const legalLinks: NavLink[] = [
  { href: "/tos", icon: <FileText className="size-4" />, label: "Terms of Service" },
  { href: "/privacy-policy", icon: <Lock className="size-4" />, label: "Privacy Policy" },
];

function NavDropdown({
  icon,
  label,
  links,
}: {
  icon: React.ReactNode;
  label: string;
  links: NavLink[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          {icon}
          {label}
          <ChevronDown className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {links.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link href={link.href}>
              {link.icon}
              {link.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function SiteHeader({ trustpilotUrl }: { trustpilotUrl?: string }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-2 px-4 sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-full max-w-xs p-0">
            <SheetHeader className="border-b border-border">
              <SheetTitle asChild>
                <Link href="/" className="flex items-center gap-2 text-base font-semibold">
                  <Image src="/Src/icons/icon-transparent.png" alt="" width={24} height={24} />
                  FreeHosts
                </Link>
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-0.5 overflow-y-auto p-3" aria-label="Main">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              <Separator className="my-2" />
              <p className="px-3 pb-1 text-xs font-medium text-muted-foreground">Submit</p>
              {submitLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              <Separator className="my-2" />
              <p className="px-3 pb-1 text-xs font-medium text-muted-foreground">Resources</p>
              {resourceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              <Separator className="my-2" />
              <p className="px-3 pb-1 text-xs font-medium text-muted-foreground">Legal</p>
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto border-t border-border p-3">
              <Button asChild className="w-full gap-2">
                <a href="https://discord.gg/QbeZ3b5CQd" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faDiscord} className="size-4" />
                  Join Discord
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2 font-semibold" aria-label="FreeHosts Home">
          <Image src="/Src/icons/icon-transparent.png" alt="FreeHosts" width={24} height={24} />
          <span className="hidden sm:inline">FreeHosts</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-0.5 md:flex" aria-label="Main">
          {primaryLinks.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Link href={link.href}>
                {link.icon}
                {link.label}
              </Link>
            </Button>
          ))}
          <NavDropdown icon={<Upload className="size-4" />} label="Submit" links={submitLinks} />
          <NavDropdown icon={<BookOpen className="size-4" />} label="Resources" links={resourceLinks} />
          <NavDropdown icon={<Scale className="size-4" />} label="Legal" links={legalLinks} />
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex" title="Trustpilot">
            <a
              href={trustpilotUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View our Trustpilot reviews"
            >
              <Star className="size-4" style={{ color: "#00b67a" }} />
            </a>
          </Button>
          <Button asChild size="sm" className="gap-1.5">
            <a
              href="https://discord.gg/QbeZ3b5CQd"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join our Discord community"
            >
              <FontAwesomeIcon icon={faDiscord} className="size-4" />
              <span className="hidden sm:inline">Discord</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
