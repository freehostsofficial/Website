"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CircleHelp,
  FileText,
  GitCompare,
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

export default function CommandPalette() {
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
        <CommandInput placeholder="Search pages..." />
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

          <CommandGroup heading="Hosts">
            <CommandItem
              value="search browse all hosts"
              onSelect={() => runCommand("/hosts")}
            >
              <Search className="size-4" />
              <span>Search all hosts...</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
