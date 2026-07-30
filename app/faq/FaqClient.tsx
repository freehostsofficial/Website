"use client";

import { useMemo, useState } from "react";
import { type FaqCategory, faqItems } from "./data";
import { Compass, HelpCircle, Info, LayoutGrid, LifeBuoy, Mail, PlusCircle, Search, Settings, Sparkles } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GlitchText } from "@/components/ui/GlitchText";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { TiltCard } from "@/components/ui/TiltCard";

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
              <GlitchText variant="chromatic" as="h1" text="Frequently Asked Questions" />
              <p className="max-w-2xl text-muted-foreground body-large">
                Find answers to common questions about FreeHosts, free hosting, and how our
                community directory works.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <div className="reveal">
            <Badge variant="outline" className="gap-1.5 border-accent/50 text-accent border-rotate">
              <Sparkles className="size-3.5" />
              Browse Topics
            </Badge>
            <h2 className="mt-4">Find answers</h2>
          </div>
          <div className="mt-6 reveal reveal-delay-1">
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

      {sections.map(({ id, icon: Icon, title }) => {
        const items = visibleItems.filter((item) => item.category === id);
        if (items.length === 0) return null;
        return (
          <section key={id} className="border-t border-border">
            <div className="mx-auto max-w-[900px] px-4 py-16 sm:px-6">
              <div className="reveal">
                <h2 className="flex items-center gap-2 text-base font-semibold">
                  <Icon className="size-4" />
                  {title}
                </h2>
              </div>
              <div className="mt-6 space-y-2 stagger-children">
                <Accordion type="single" collapsible className="rounded-lg border border-border bg-card px-4">
                  {items.map((item) => (
                    <AccordionItem key={item.question} value={item.question}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>
        );
      })}

      {visibleItems.length === 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-[900px] px-4 py-16 sm:px-6">
            <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
              <Search className="size-10" />
              <h3 className="text-foreground">No results found</h3>
              <p>Try adjusting your search or browse all categories</p>
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <SpotlightCard className="flex flex-col items-center gap-3 p-10 text-center reveal">
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
          </SpotlightCard>
        </div>
      </section>
    </main>
  );
}
