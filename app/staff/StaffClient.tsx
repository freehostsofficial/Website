"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Award, Code, Crown, Globe, GraduationCap, HandHeart, HandMetal, Heart, LayoutGrid, Newspaper, Server, Shield, ShieldCheck, Terminal, Upload, UserCheck, Users, X } from "lucide-react";
import { DiscordIcon, GithubIcon, TwitterIcon, type BrandIconComponent } from "../../components/BrandIcons";
import { staffData, type StaffJsonMember } from "./data";

type FilterKey =
  | "all"
  | "owner"
  | "administrator"
  | "developer"
  | "moderator"
  | "helper"
  | "host-publisher"
  | "hosting-provider";

type RoleKey = Exclude<FilterKey, "all">;

type RoleEntry = {
  icon: LucideIcon;
  className: string;
  priority: number;
  displayName: string;
  filterKey: RoleKey;
  aliases: string[];
  sectionTitle: string;
  sectionDesc: string;
  sectionIconClass: string;
  sectionIcon: LucideIcon;
};

// One role config (was three parallel maps: roleConfig + sections + filters).
const ROLES: Record<RoleKey, RoleEntry> = {
  owner: { icon: Crown, className: "owner", priority: 1, displayName: "Owner", filterKey: "owner", aliases: ["co-owner"], sectionTitle: "Owners", sectionDesc: "Founders and leaders of FreeHosts", sectionIconClass: "leadership", sectionIcon: Crown },
  administrator: { icon: ShieldCheck, className: "admin", priority: 2, displayName: "Administrator", filterKey: "administrator", aliases: ["admin"], sectionTitle: "Administrators", sectionDesc: "Team administrators managing operations", sectionIconClass: "leadership", sectionIcon: UserCheck },
  developer: { icon: Terminal, className: "developer", priority: 3, displayName: "Developer", filterKey: "developer", aliases: ["dev"], sectionTitle: "Developers", sectionDesc: "Building and maintaining our platform", sectionIconClass: "development", sectionIcon: Code },
  moderator: { icon: Shield, className: "moderator", priority: 4, displayName: "Moderator", filterKey: "moderator", aliases: [], sectionTitle: "Moderators", sectionDesc: "Community moderators keeping things safe", sectionIconClass: "community", sectionIcon: Shield },
  helper: { icon: HandHeart, className: "helper", priority: 5, displayName: "Helper", filterKey: "helper", aliases: [], sectionTitle: "Helpers", sectionDesc: "Support team helping our community", sectionIconClass: "community", sectionIcon: HandHeart },
  "host-publisher": { icon: Newspaper, className: "publisher", priority: 6, displayName: "Host Publisher", filterKey: "host-publisher", aliases: ["publisher"], sectionTitle: "Host Publishers", sectionDesc: "Contributors managing host listings", sectionIconClass: "hosting", sectionIcon: Upload },
  "hosting-provider": { icon: Server, className: "hosting-provider", priority: 7, displayName: "Hosting Provider", filterKey: "hosting-provider", aliases: ["provider"], sectionTitle: "Hosting Providers", sectionDesc: "Partners providing hosting services", sectionIconClass: "hosting", sectionIcon: Server },
};

const linkIcons: Record<string, { icon: LucideIcon | BrandIconComponent; label: string; isBrand?: boolean }> = {
  github: { icon: GithubIcon, label: "GitHub Profile", isBrand: true },
  website: { icon: Globe, label: "Website" },
  discord: { icon: DiscordIcon, label: "Discord", isBrand: true },
  twitter: { icon: TwitterIcon, label: "Twitter", isBrand: true },
};

const benefits: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Heart, title: "Make an Impact", text: "Help thousands find the right hosting" },
  { icon: Users, title: "Join Community", text: "Work with passionate volunteers" },
  { icon: GraduationCap, title: "Learn & Grow", text: "Gain experience and skills" },
  { icon: Award, title: "Recognition", text: "Get credited for your work" },
];

type StaffMember = {
  username: string;
  name: string;
  roles: RoleEntry[];
  primaryRole: RoleEntry;
  about?: string;
  links?: Record<string, string>;
};

function categorizeRole(role: string): RoleEntry | null {
  const lower = role.trim().toLowerCase();
  for (const entry of Object.values(ROLES)) {
    if (lower.includes(entry.filterKey) || entry.aliases.some((a) => lower.includes(a))) {
      return entry;
    }
  }
  return null;
}

function processStaff(data: Record<string, StaffJsonMember>) {
  return Object.entries(data)
    .map<StaffMember | null>(([username, member]) => {
      const roles = member.roles
        .map((role) => categorizeRole(role))
        .filter((role): role is RoleEntry => Boolean(role))
        .sort((a, b) => a.priority - b.priority);

      if (roles.length === 0) return null;

      return {
        username,
        name: member.name || username,
        roles,
        primaryRole: roles[0],
        about: member.about,
        links: member.links,
      };
    })
    .filter((member): member is StaffMember => Boolean(member))
    .sort((a: StaffMember, b: StaffMember) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}

export default function StaffClient() {
  const [members] = useState<StaffMember[]>(() => processStaff(staffData));
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);

  useEffect(() => {
    if (!selectedMember) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedMember(null);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedMember]);

  const grouped = useMemo(() => {
    const result = (Object.keys(ROLES) as RoleKey[]).reduce(
      (acc, key) => ({ ...acc, [key]: [] }),
      {} as Record<RoleKey, StaffMember[]>,
    );

    members.forEach((member) => {
      if (activeFilter === "all") {
        result[member.primaryRole.filterKey].push(member);
      } else if (member.roles.some((role) => role.filterKey === activeFilter)) {
        result[activeFilter].push(member);
      }
    });

    return result;
  }, [activeFilter, members]);

  return (
    <main className="wrap staff-page">
      <section className="staff-hero">
        <div className="staff-hero-icon">
          <Users size={24} aria-hidden="true" />
        </div>
        <h1>Meet Our Team</h1>
        <p>Dedicated volunteers who help run, maintain, and grow the FreeHosts community.</p>
      </section>

      <div className="staff-filters">
        <button
          className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
          type="button"
          aria-pressed={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
        >
          <LayoutGrid size={14} aria-hidden="true" />
          All Team
        </button>
        {(Object.keys(ROLES) as RoleKey[]).map((key) => {
          const Icon = ROLES[key].icon;
          return (
            <button
              className={`filter-btn ${activeFilter === key ? "active" : ""}`}
              type="button"
              aria-pressed={activeFilter === key}
              onClick={() => setActiveFilter(key)}
              key={key}
            >
              <Icon size={14} aria-hidden="true" />
              {ROLES[key].displayName}
            </button>
          );
        })}
      </div>

      <StaffSections grouped={grouped} onSelect={setSelectedMember} />

      <section className="join-team-section">
        <div className="join-icon">
          <HandMetal size={24} aria-hidden="true" />
        </div>
        <h2>Want to Join the Team?</h2>
        <p>
          We&apos;re always looking for passionate volunteers to help grow and improve
          FreeHosts. Whether you&apos;re interested in curation, moderation,
          development, or community support, there&apos;s a place for you here.
        </p>

        <div className="join-benefits">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div className="benefit-item" key={title}>
              <div className="benefit-icon">
                <Icon size={20} aria-hidden="true" />
              </div>
              <div className="benefit-text">
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            </div>
          ))}
        </div>

        <a href="https://discord.gg/QbeZ3b5CQd" className="join-cta" target="_blank" rel="noopener noreferrer">
          <DiscordIcon aria-hidden="true" />
          Join Our Discord
        </a>
      </section>

      {selectedMember ? (
        <StaffModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      ) : null}
    </main>
  );
}

function StaffSections({
  grouped,
  onSelect,
}: {
  grouped: Record<RoleKey, StaffMember[]>;
  onSelect: (member: StaffMember) => void;
}) {
  const visible = (Object.keys(ROLES) as RoleKey[]).filter((key) => grouped[key].length > 0);

  if (visible.length === 0) {
    return <div className="error-state"><p className="muted">No staff members found in this category.</p></div>;
  }

  return (
    <>
      {visible.map((key) => {
        const Icon = ROLES[key].sectionIcon;
        return (
        <section className="staff-section" key={key}>
          <div className="staff-section-header">
            <div className={`staff-section-icon ${ROLES[key].sectionIconClass}`}>
              <Icon size={20} aria-hidden="true" />
            </div>
            <div className="staff-section-title">
              <h2>{ROLES[key].sectionTitle}</h2>
              <p>{ROLES[key].sectionDesc}</p>
            </div>
          </div>
          <div className="staff-grid">
            {grouped[key].map((member) => {
              const AvatarIcon = member.primaryRole.icon;
              return (
                <button className="staff-card" type="button" onClick={() => onSelect(member)} key={member.username}>
                  <div className={`staff-avatar ${member.primaryRole.className}`}>
                    <AvatarIcon size={20} aria-hidden="true" />
                  </div>
                  <div className="staff-info">
                    <h3>{member.name}</h3>
                    <RoleBadges roles={member.roles} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
        );
      })}
    </>
  );
}

function RoleBadges({ roles }: { roles: RoleEntry[] }) {
  return (
    <div className="staff-roles">
      {roles.map((role) => {
        const Icon = role.icon;
        return (
          <span className={`staff-role role-${role.className}`} key={`${role.filterKey}-${role.displayName}`}>
            <Icon size={14} aria-hidden="true" />
            {role.displayName}
          </span>
        );
      })}
    </div>
  );
}

function StaffModal({ member, onClose }: { member: StaffMember; onClose: () => void }) {
  const links = Object.entries(member.links || {}).filter(([, value]) => Boolean(value));
  const AvatarIcon = member.primaryRole.icon;

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="staff-modal" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="staff-modal-title">
      <div className="staff-modal-content" onClick={(event) => event.stopPropagation()}>
        <div className="staff-modal-header">
          <button className="staff-modal-close" type="button" aria-label="Close staff details" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
          <div className="staff-modal-avatar">
            <AvatarIcon size={20} aria-hidden="true" />
          </div>
          <div className="staff-modal-info">
            <h2 id="staff-modal-title">{member.name}</h2>
            <RoleBadges roles={member.roles} />
          </div>
        </div>
        <div className="staff-modal-body">
          {member.about ? (
            <div className="staff-modal-section">
              <h3>About</h3>
              <p className="staff-modal-about">{member.about}</p>
            </div>
          ) : null}

          {links.length > 0 ? (
            <div className="staff-modal-section">
              <h3>Links</h3>
              <div className="staff-modal-links">
                {links.map(([key, value]) => {
                  const info = linkIcons[key] || { icon: Globe, label: key };
                  const LinkIcon = info.icon as LucideIcon;
                  return (
                    <a className="staff-modal-link" href={value} target="_blank" rel="noopener noreferrer" key={key}>
                      <div className="staff-modal-link-icon">
                        <LinkIcon size={20} />
                      </div>
                      <div className="staff-modal-link-text">
                        <strong>{info.label}</strong>
                        <span>{value}</span>
                      </div>
                      <ArrowUpRight size={20} aria-hidden="true" style={{ color: "var(--muted)" }} />
                    </a>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
