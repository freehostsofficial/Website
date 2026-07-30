"use client";

import { useMemo, useState } from "react";
import { type FaqCategory, faqItems } from "./data";
import {
  HelpCircle,
  Info,
  LayoutGrid,
  LifeBuoy,
  Mail,
  PlusCircle,
  Search,
  Settings,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { DiscordIcon } from "@/components/icons";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const categories: { id: FaqCategory | "all"; icon: LucideIcon; label: string }[] = [
  { id: "all", icon: LayoutGrid, label: "All Questions" },
  { id: "general", icon: Info, label: "General" },
  { id: "technical", icon: Settings, label: "Technical" },
  { id: "submissions", icon: PlusCircle, label: "Submissions" },
  { id: "support", icon: LifeBuoy, label: "Support" },
];

const sections: { id: FaqCategory; icon: LucideIcon; title: string }[] = [
  { id: "general", icon: Info, title: "General Information" },
  { id: "technical", icon: Settings, title: "Technical Questions" },
  { id: "submissions", icon: PlusCircle, title: "Submitting Hosts" },
  { id: "support", icon: LifeBuoy, title: "Support & Contact" },
];

export default function FaqClient() {
  const [activeCategory, setActiveCategory] = useState<FaqCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean | null>>({});

  const visibleItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return faqItems.filter((item) => {
      const catMatch = activeCategory === "all" || item.category === activeCategory;
      const searchMatch = !q || item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });
  }, [activeCategory, search]);

  const setCategory = (category: FaqCategory | "all") => {
    setActiveCategory(category);
    setSearch("");
  };

  const toggleHelpful = (question: string, value: boolean) => {
    setHelpfulMap((prev) => {
      const current = prev[question];
      if (current === value) return { ...prev, [question]: null };
      return { ...prev, [question]: value };
    });
  };

  return (
    <main>
      <section className="relative overflow-hidden noise-overlay border-b border-border">
        <div className="dot-grid relative">
          <div className="pointer-events-none absolute -top-40 left-1/4 size-96 opacity-20 blob-morph" />
          <div className="pointer-events-none absolute -bottom-40 right-1/4 size-80 opacity-15 blob-morph" style={{ animationDelay: "4s" }} />
          <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-24">
            <div className="flex flex-col items-center gap-3 text-center reveal">
              <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <HelpCircle className="size-7" />
              </div>
              <h1>Frequently Asked Questions</h1>
              <p className="max-w-2xl text-muted-foreground body-large">
                Find answers to common questions about FreeHosts, free hosting, and how our
                community directory works.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[900px] px-4 py-12 sm:px-6">
          <SpotlightCard className="p-4 sm:p-6">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {categories.map(({ id, icon: Icon, label }) => (
                <Button
                  key={id}
                  size="sm"
                  variant={activeCategory === id ? "default" : "outline"}
                  className="gap-1.5 transition-all duration-200 active:scale-95"
                  onClick={() => setCategory(id)}
                >
                  <Icon className="size-3.5" />
                  {label}
                </Button>
              ))}
            </div>
          </SpotlightCard>
        </div>
      </section>

      {sections.map(({ id, icon: Icon, title }) => {
        const items = visibleItems.filter((item) => item.category === id);
        if (items.length === 0) return null;
        return (
          <section key={id} className="border-b border-border">
            <div className="mx-auto max-w-[900px] px-4 py-12 sm:px-6 reveal">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Icon className="size-4 text-accent" />
                {title}
              </h2>
              <div className="mt-4">
                <Accordion type="single" collapsible className="rounded-lg border border-border bg-card">
                  {items.map((item) => (
                    <AccordionItem key={item.question} value={item.question}>
                      <AccordionTrigger className="transition-all duration-300">{item.question}</AccordionTrigger>
                      <AccordionContent className="transition-all duration-300">
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Was this helpful?</span>
                          <button
                            type="button"
                            onClick={() => toggleHelpful(item.question, true)}
                            className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-all duration-200 hover:bg-accent/10 ${
                              helpfulMap[item.question] === true
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-border"
                            }`}
                            aria-label="Mark as helpful"
                          >
                            <ThumbsUp className="size-3" />
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleHelpful(item.question, false)}
                            className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-all duration-200 hover:bg-destructive/10 ${
                              helpfulMap[item.question] === false
                                ? "border-destructive bg-destructive/10 text-destructive"
                                : "border-border"
                            }`}
                            aria-label="Mark as not helpful"
                          >
                            <ThumbsDown className="size-3" />
                            No
                          </button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>
        );
      })}

      {visibleItems.length === 0 && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-[900px] px-4 py-12 sm:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Search className="size-8" />
              </div>
              <h3 className="text-lg">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or browse a different category.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.filter((c) => c.id !== "all").map(({ id, icon: Icon, label }) => (
                  <Button
                    key={id}
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => setCategory(id)}
                  >
                    <Icon className="size-3.5" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <SpotlightCard className="flex flex-col items-center gap-4 p-10 text-center reveal">
            <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <HelpCircle className="size-7" />
            </div>
            <h2>Still have questions?</h2>
            <p className="max-w-md text-muted-foreground">
              Join our community and get help from our team and fellow users.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild className="gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95">
                <a href="https://discord.gg/QbeZ3b5CQd" target="_blank" rel="noopener noreferrer">
                  <DiscordIcon className="size-4" />
                  Join Discord
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-1.5">
                <a href={"mailto:support@" + process.env.EMAIL_DOMAIN}>
                  <Mail className="size-3.5" />
                  Email Us
                </a>
              </Button>
            </div>
          </SpotlightCard>
        </div>
      </section>
    </main>
  );
}
