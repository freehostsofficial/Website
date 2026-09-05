"use client";

import { useMemo, useState } from "react";
import { type FaqCategory, getFaqItems } from "./data";
import { ChevronDown, CircleHelp, Info, LayoutGrid, LifeBuoy, Mail, PlusCircle, Search, Settings } from "lucide-react";
import { DiscordIcon } from "@/components/BrandIcons";
import type { LucideIcon } from "lucide-react";

// One config drives both the filter buttons and the sections
// (were two parallel lists: categories + sections).
const sections: { id: FaqCategory; icon: LucideIcon; filterLabel: string; sectionTitle: string }[] = [
  { id: "general", icon: Info, filterLabel: "General", sectionTitle: "General Information" },
  { id: "technical", icon: Settings, filterLabel: "Technical", sectionTitle: "Technical Questions" },
  { id: "submissions", icon: PlusCircle, filterLabel: "Submissions", sectionTitle: "Submitting Hosts" },
  { id: "support", icon: LifeBuoy, filterLabel: "Support", sectionTitle: "Support & Contact" },
];

const filters: { id: FaqCategory | "all"; icon: LucideIcon; filterLabel: string }[] = [
  { id: "all", icon: LayoutGrid, filterLabel: "All Questions" },
  ...sections,
];

export default function FaqClient({ emailDomain }: { emailDomain: string }) {
  const faqItems = getFaqItems(emailDomain);
  const [activeCategory, setActiveCategory] = useState<FaqCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const visibleItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return faqItems.filter((item) => {
      const catMatch = activeCategory === "all" || item.category === activeCategory;
      const searchMatch = !q || item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });
  }, [activeCategory, search, faqItems]);

  const setCategory = (category: FaqCategory | "all") => {
    setActiveCategory(category);
    setSearch("");
    setOpenQuestion(null);
  };

  return (
    <main className="wrap">
      <section className="faq-hero">
        <div className="faq-hero-icon">
          <CircleHelp size={48} aria-hidden="true" />
        </div>
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about FreeHosts, free hosting, and how our community directory works.</p>
        <p className="faq-hero-lead">
          New to free hosting? Start here — these answers explain how the FreeHosts directory works, what you can host
          for free, and how listings are reviewed and kept up to date. If your question is not covered, join our
          Discord community or email support and a team member will help you out.
        </p>
      </section>

      <div className="faq-search">
        <Search size={16} className="faq-search-icon" aria-hidden="true" />
        <input
          id="faqSearch"
          type="search"
          placeholder="Search questions..."
          aria-label="Search frequently asked questions"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOpenQuestion(null); }}
        />
      </div>

      <div className="faq-categories">
        {filters.map(({ id, icon: Icon, filterLabel }) => (
          <button
            key={id}
            className={`faq-category-btn ${activeCategory === id ? "active" : ""}`}
            type="button"
            aria-pressed={activeCategory === id}
            onClick={() => setCategory(id)}
          >
            <Icon size={14} aria-hidden="true" />
            {filterLabel}
          </button>
        ))}
      </div>

      <div className="faq-list">
        {sections.map(({ id, icon: Icon, sectionTitle }) => {
          const items = visibleItems.filter((item) => item.category === id);
          if (items.length === 0) return null;
          return (
            <div className="faq-section" key={id}>
              <h2 className="faq-section-title">
                <Icon size={16} aria-hidden="true" />
                {sectionTitle}
              </h2>
              {items.map((item) => {
                const isOpen = openQuestion === item.question;
                return (
                  <div className={`faq-item ${isOpen ? "open" : ""}`} data-category={item.category} key={item.question}>
                    <h3 className="faq-question-heading">
                      <button
                        className="faq-question"
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenQuestion(isOpen ? null : item.question)}
                      >
                        <span className="faq-question-text">{item.question}</span>
                        <div className="faq-icon">
                          <ChevronDown size={16} aria-hidden="true" />
                        </div>
                      </button>
                    </h3>
                    <div className="faq-answer" hidden={!isOpen} aria-hidden={!isOpen} style={isOpen ? { maxHeight: "none" } : undefined}>
                      <div className="faq-answer-content">{item.answer}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {visibleItems.length === 0 && (
        <div className="no-results" id="noResults" role="status">
          <Search size={48} aria-hidden="true" />
          <h3>No results found</h3>
          <p>Try adjusting your search or browse all categories</p>
        </div>
      )}

      <div className="faq-cta">
        <h2>Still have questions?</h2>
        <p>Join our community and get help from our team and fellow users.</p>
        <div className="faq-cta-buttons">
          <a href="https://discord.gg/QbeZ3b5CQd" className="faq-cta-btn primary" target="_blank" rel="noopener noreferrer">
            <DiscordIcon aria-hidden="true" />
            Join Discord
          </a>
          <a href={`mailto:support@${emailDomain}`} className="faq-cta-btn secondary">
            <Mail size={14} aria-hidden="true" />
            Email Us
          </a>
        </div>
      </div>
    </main>
  );
}
