"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CircleHelp,
  FileText,
  GitCompare,
  Globe,
  Info,
  Link as LinkIcon,
  ListChecks,
  Lock,
  Pencil,
  Plus,
  Search,
  Server,
  Shield,
  Star,
  Users,
} from "lucide-react";

import { slugify } from "@/lib/slugify";
import type { Host } from "@/lib/cache";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type PageItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  group: string;
};

const pages: PageItem[] = [
  { href: "/hosts", label: "Browse Hosts", icon: <Server className="size-4" />, group: "Browse" },
  { href: "/compare", label: "Compare Hosts", icon: <GitCompare className="size-4" />, group: "Browse" },
  { href: "/staff", label: "Staff Team", icon: <Users className="size-4" />, group: "Browse" },
  { href: "/faq", label: "FAQ", icon: <CircleHelp className="size-4" />, group: "Browse" },
  { href: "/about", label: "About Us", icon: <Info className="size-4" />, group: "Info" },
  { href: "/saved", label: "Saved Hosts", icon: <Star className="size-4" />, group: "Info" },
  { href: "/submit-host", label: "Submit a Host", icon: <Plus className="size-4" />, group: "Submit" },
  { href: "/submit-layout", label: "Submit Layout", icon: <Pencil className="size-4" />, group: "Submit" },
  { href: "/submission-rules", label: "Submission Rules", icon: <ListChecks className="size-4" />, group: "Submit" },
  { href: "/server-rules", label: "Server Rules", icon: <Shield className="size-4" />, group: "Info" },
  { href: "/other-free-hosts", label: "Other Free Hosts", icon: <LinkIcon className="size-4" />, group: "Info" },
  { href: "/tos", label: "Terms of Service", icon: <FileText className="size-4" />, group: "Legal" },
  { href: "/privacy-policy", label: "Privacy Policy", icon: <Lock className="size-4" />, group: "Legal" },
];

export default function CommandPalette({ initialHosts }: { initialHosts: Host[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Search (Cmd+K)"
      >
        <Search className="size-4" />
        <span className="hidden lg:inline">Search...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages and hosts..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Pages">
            {pages.map((page) => (
              <CommandItem
                key={page.href}
                value={`${page.label} ${page.group}`}
                onSelect={() => runCommand(page.href)}
              >
                {page.icon}
                <span>{page.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          {initialHosts.length > 0 && (
            <CommandGroup heading={`Hosts (${initialHosts.length})`}>
              {initialHosts.map((host) => (
                <CommandItem
                  key={host.id}
                  value={`${host.name} ${host.description ?? ""} ${(host.targets ?? []).join(" ")}`}
                  onSelect={() => runCommand(`/hosts/${slugify(host.name)}`)}
                >
                  <Globe className="size-4" />
                  <span>{host.name}</span>
                  {host.description && (
                    <span className="ml-2 truncate text-xs text-muted-foreground max-w-[200px]">
                      {host.description}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
