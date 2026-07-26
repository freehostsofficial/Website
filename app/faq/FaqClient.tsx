"use client";

import { useMemo, useState } from "react";
import { type FaqCategory, faqItems } from "./data";
import { CircleHelp, Info, LayoutGrid, LifeBuoy, Mail, PlusCircle, Search, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

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
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);

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
    setOpenQuestions([]);
  };

  return (
    <main className="wrap py-12">
      <section className="text-center mb-8">
        <div className="flex justify-center text-accent mb-4">
          <CircleHelp size={48} aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Find answers to common questions about FreeHosts, free hosting, and how our community directory works.
        </p>
      </section>

      <div className="max-w-2xl mx-auto mb-8 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOpenQuestions([]); }}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant={activeCategory === id ? "default" : "ghost"}
              size="sm"
              onClick={() => setCategory(id)}
            >
              <Icon size={14} aria-hidden="true" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {sections.map(({ id, icon: Icon, title }) => {
          const items = visibleItems.filter((item) => item.category === id);
          if (items.length === 0) return null;
          return (
            <section key={id}>
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <Icon size={16} aria-hidden="true" />
                {title}
              </h2>
              <Accordion value={openQuestions} onValueChange={setOpenQuestions}>
                {items.map((item) => (
                  <AccordionItem value={item.question} key={item.question}>
                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          );
        })}
      </div>

      {visibleItems.length === 0 && (
        <div className="text-center py-12 max-w-md mx-auto">
          <div className="flex justify-center text-muted-foreground mb-4">
            <Search size={48} aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or browse all categories</p>
        </div>
      )}

      <Card className="max-w-lg mx-auto mt-12 text-center">
        <CardContent className="py-8 space-y-4">
          <h2 className="text-xl font-semibold">Still have questions?</h2>
          <p className="text-sm text-muted-foreground">Join our community and get help from our team and fellow users.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="https://discord.gg/QbeZ3b5CQd" target="_blank" rel="noopener noreferrer">
              <Button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0741.0741 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.1776-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
                Join Discord
              </Button>
            </a>
            <a href={"mailto:support@" + process.env.EMAIL_DOMAIN}>
              <Button variant="secondary">
                <Mail size={14} aria-hidden="true" />
                Email Us
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
