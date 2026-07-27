"use client";

import { useMemo, useState } from "react";
import { type FaqCategory, faqItems } from "./data";
import { CircleHelp, Info, LayoutGrid, LifeBuoy, Mail, PlusCircle, Search, Settings } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  return (
    <main className="mx-auto max-w-[900px] px-4 py-12 sm:px-6">
      <section className="flex flex-col items-center gap-3 text-center reveal">
        <div className="flex size-14 items-center justify-center rounded-full bg-secondary">
          <CircleHelp className="size-7" />
        </div>
        <h1>Frequently Asked Questions</h1>
        <p className="max-w-md text-muted-foreground">
          Find answers to common questions about FreeHosts, free hosting, and how our
          community directory works.
        </p>
      </section>

      <div className="relative mt-8">
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
            className="gap-1.5"
            onClick={() => setCategory(id)}
          >
            <Icon className="size-3.5" />
            {label}
          </Button>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-8">
        {sections.map(({ id, icon: Icon, title }) => {
          const items = visibleItems.filter((item) => item.category === id);
          if (items.length === 0) return null;
          return (
            <div key={id}>
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Icon className="size-4" />
                {title}
              </h2>
              <Accordion type="single" collapsible className="mt-2 rounded-lg border border-border bg-card px-4">
                {items.map((item) => (
                  <AccordionItem key={item.question} value={item.question}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          );
        })}
      </div>

      {visibleItems.length === 0 && (
        <div className="mt-12 flex flex-col items-center gap-2 text-center text-muted-foreground">
          <Search className="size-10" />
          <h3 className="text-foreground">No results found</h3>
          <p>Try adjusting your search or browse all categories</p>
        </div>
      )}

      <div className="mt-16 flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-10 text-center card-hover transition-all duration-300 reveal">
        <h2>Still have questions?</h2>
        <p className="text-muted-foreground">
          Join our community and get help from our team and fellow users.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button asChild className="gap-1.5">
            <a href="https://discord.gg/QbeZ3b5CQd" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faDiscord} className="size-4" />
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
      </div>
    </main>
  );
}
