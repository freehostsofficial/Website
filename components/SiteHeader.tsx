"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "@/components/NoPrefetchLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
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
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import CommandPalette from "@/components/CommandPalette";
import { useTheme } from "@/contexts/ThemeContext";
import type { Host } from "@/lib/cache";
import { cn } from "@/lib/utils";

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

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

function NavDropdown({
  icon,
  label,
  links,
  pathname,
}: {
  icon: React.ReactNode;
  label: string;
  links: NavLink[];
  pathname: string;
}) {
  const hasActive = links.some((l) => isActive(pathname, l.href));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-1.5 transition-all duration-200",
            hasActive
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {icon}
          {label}
          <ChevronDown className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {links.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link
              href={link.href}
              className={cn(
                isActive(pathname, link.href) &&
                  "border-l-2 border-primary pl-[calc(0.5rem-2px)] font-medium text-foreground"
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AccordionGroup({
  label,
  links,
  pathname,
}: {
  label: string;
  links: NavLink[];
  pathname: string;
}) {
  const hasActive = links.some((l) => isActive(pathname, l.href));

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={label} className="border-none">
        <AccordionTrigger
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary hover:no-underline",
            hasActive && "text-foreground"
          )}
        >
          {label}
        </AccordionTrigger>
        <AccordionContent className="pb-1">
          <div className="ml-2 flex flex-col gap-0.5 border-l border-border pl-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground",
                  isActive(pathname, link.href) &&
                    "border-l-2 border-primary pl-[calc(0.75rem-2px)] font-medium text-foreground"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default function SiteHeader({ trustpilotUrl, hosts }: { trustpilotUrl?: string; hosts?: Host[] }) {
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "glass border-b border-border"
          : "bg-transparent"
      )}
    >
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
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-secondary",
                    isActive(pathname, link.href)
                      ? "border-l-2 border-primary pl-[calc(0.75rem-2px)] font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              <Separator className="my-2" />

              <AccordionGroup label="Submit" links={submitLinks} pathname={pathname} />
              <AccordionGroup label="Resources" links={resourceLinks} pathname={pathname} />
              <AccordionGroup label="Legal" links={legalLinks} pathname={pathname} />
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
              className={cn(
                "gap-1.5 transition-all duration-200",
                isActive(pathname, link.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Link href={link.href}>
                {link.icon}
                {link.label}
              </Link>
            </Button>
          ))}
          <NavDropdown icon={<Upload className="size-4" />} label="Submit" links={submitLinks} pathname={pathname} />
          <NavDropdown icon={<BookOpen className="size-4" />} label="Resources" links={resourceLinks} pathname={pathname} />
          <NavDropdown icon={<Scale className="size-4" />} label="Legal" links={legalLinks} pathname={pathname} />
        </nav>

        <div className="ml-auto flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
          >
            <motion.div
              key={resolvedTheme}
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <FontAwesomeIcon
                icon={resolvedTheme === "dark" ? faMoon : faSun}
                className="size-4"
              />
            </motion.div>
          </Button>

          <CommandPalette initialHosts={hosts ?? []} />

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
