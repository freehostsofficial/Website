"use client";

import React, { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Award,
  Code,
  Compass,
  Crown,
  Globe,
  GraduationCap,
  HandHeart,
  HandMetal,
  Heart,
  LayoutGrid,
  Newspaper,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
  Upload,
  UserCheck,
  Users,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faDiscord, faGithub, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/ui/TiltCard";
import { GlitchText } from "@/components/ui/GlitchText";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

type RoleInfo = {
  icon: LucideIcon;
  className: string;
  priority: number;
  displayName: string;
  filterKey: Exclude<FilterKey, "all">;
};

type StaffMember = {
  username: string;
  name: string;
  roles: RoleInfo[];
  primaryRole: RoleInfo;
  about?: string;
  links?: Record<string, string>;
};

const roleConfig: Record<string, RoleInfo> = {
  owner: { icon: Crown, className: "owner", priority: 1, displayName: "Owner", filterKey: "owner" },
  "co-owner": { icon: Crown, className: "owner", priority: 1, displayName: "Owner", filterKey: "owner" },
  administrator: { icon: ShieldCheck, className: "admin", priority: 2, displayName: "Administrator", filterKey: "administrator" },
  admin: { icon: ShieldCheck, className: "admin", priority: 2, displayName: "Administrator", filterKey: "administrator" },
  developer: { icon: Terminal, className: "developer", priority: 3, displayName: "Developer", filterKey: "developer" },
  dev: { icon: Terminal, className: "developer", priority: 3, displayName: "Developer", filterKey: "developer" },
  moderator: { icon: Shield, className: "moderator", priority: 4, displayName: "Moderator", filterKey: "moderator" },
  helper: { icon: HandHeart, className: "helper", priority: 5, displayName: "Helper", filterKey: "helper" },
  "host publisher": { icon: Newspaper, className: "publisher", priority: 6, displayName: "Host Publisher", filterKey: "host-publisher" },
  publisher: { icon: Newspaper, className: "publisher", priority: 6, displayName: "Host Publisher", filterKey: "host-publisher" },
  "hosting provider": { icon: Server, className: "hosting-provider", priority: 7, displayName: "Hosting Provider", filterKey: "hosting-provider" },
  provider: { icon: Server, className: "hosting-provider", priority: 7, displayName: "Hosting Provider", filterKey: "hosting-provider" },
};

const sections: Record<Exclude<FilterKey, "all">, { title: string; desc: string; icon: LucideIcon }> = {
  owner: { title: "Owners", desc: "Founders and leaders of FreeHosts", icon: Crown },
  administrator: { title: "Administrators", desc: "Team administrators managing operations", icon: UserCheck },
  developer: { title: "Developers", desc: "Building and maintaining our platform", icon: Code },
  moderator: { title: "Moderators", desc: "Community moderators keeping things safe", icon: Shield },
  helper: { title: "Helpers", desc: "Support team helping our community", icon: HandHeart },
  "host-publisher": { title: "Host Publishers", desc: "Contributors managing host listings", icon: Upload },
  "hosting-provider": { title: "Hosting Providers", desc: "Partners providing hosting services", icon: Server },
};

const filters: { key: FilterKey; icon: LucideIcon; label: string }[] = [
  { key: "all", icon: LayoutGrid, label: "All Team" },
  { key: "owner", icon: Crown, label: "Owner" },
  { key: "administrator", icon: UserCheck, label: "Administrator" },
  { key: "developer", icon: Code, label: "Developer" },
  { key: "moderator", icon: Shield, label: "Moderator" },
  { key: "helper", icon: HandHeart, label: "Helper" },
  { key: "host-publisher", icon: Upload, label: "Host Publisher" },
  { key: "hosting-provider", icon: Server, label: "Hosting Provider" },
];

const linkIcons: Record<string, { icon: LucideIcon | IconDefinition; label: string; isBrand?: boolean }> = {
  github: { icon: faGithub, label: "GitHub Profile", isBrand: true },
  website: { icon: Globe, label: "Website" },
  discord: { icon: faDiscord, label: "Discord", isBrand: true },
  twitter: { icon: faTwitter, label: "Twitter", isBrand: true },
  linkedin: { icon: faLinkedin, label: "LinkedIn", isBrand: true },
};

function categorizeRole(role: string) {
  const lower = role.trim().toLowerCase();
  const hit = Object.entries(roleConfig).find(([key]) => lower.includes(key));
  return hit?.[1] ?? null;
}

function processStaff(data: Record<string, StaffJsonMember>) {
  return Object.entries(data)
    .map<StaffMember | null>(([username, member]) => {
      const rawRoles = Array.isArray(member.roles) ? member.roles : [member.roles];
      const roles = rawRoles
        .map((role: string) => categorizeRole(String(role)))
        .filter((role): role is RoleInfo => Boolean(role))
        .sort((a: RoleInfo, b: RoleInfo) => a.priority - b.priority);

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

  const grouped = useMemo(() => {
    const result = Object.keys(sections).reduce(
      (acc, key) => ({ ...acc, [key]: [] }),
      {} as Record<Exclude<FilterKey, "all">, StaffMember[]>,
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
    <main>
      <section className="relative overflow-hidden noise-overlay border-b border-border">
        <div className="dot-grid relative">
          <div className="pointer-events-none absolute -top-40 left-1/4 size-96 opacity-20 blob-morph" />
          <div className="pointer-events-none absolute -bottom-40 right-1/4 size-80 opacity-15 blob-morph" style={{ animationDelay: "4s" }} />
          <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-24">
            <div className="flex flex-col items-center gap-3 text-center reveal">
              <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Compass className="size-7" />
              </div>
              <GlitchText text="Our Team" variant="chromatic" as="h1" />
              <p className="max-w-2xl text-muted-foreground body-large">
                Dedicated volunteers who help run, maintain, and grow the FreeHosts community.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 mt-8 sm:px-6">
        <div className="flex flex-wrap justify-center gap-2 reveal">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              type="button"
              size="sm"
              variant={activeFilter === filter.key ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.key)}
              className="gap-1.5 card-hover transition-all duration-200 active:scale-95"
            >
            <filter.icon className="size-3.5" />
            {filter.label}
          </Button>
        ))}
        </div>
      </div>

      <StaffSections grouped={grouped} onSelect={setSelectedMember} />

      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <SpotlightCard className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
              <Sparkles className="size-6" />
            </div>
            <h2>Want to Join the Team?</h2>
            <p className="max-w-md text-muted-foreground">
              We&apos;re always looking for passionate volunteers to help grow and improve
              FreeHosts. Whether you&apos;re interested in curation, moderation,
              development, or community support, there&apos;s a place for you here.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
              <Benefit icon={Heart} title="Make an Impact" text="Help thousands find the right hosting" />
              <Benefit icon={Users} title="Join Community" text="Work with passionate volunteers" />
              <Benefit icon={GraduationCap} title="Learn & Grow" text="Gain experience and skills" />
              <Benefit icon={Award} title="Recognition" text="Get credited for your work" />
            </div>

            <Button asChild className="mt-2 gap-2 transition-all duration-200 hover:scale-105 active:scale-95">
              <a href="https://discord.gg/QbeZ3b5CQd" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faDiscord} className="size-4" />
                Join Our Discord
              </a>
            </Button>
          </SpotlightCard>
        </div>
      </section>

      <StaffModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </main>
  );
}

function StaffSections({
  grouped,
  onSelect,
}: {
  grouped: Record<Exclude<FilterKey, "all">, StaffMember[]>;
  onSelect: (member: StaffMember) => void;
}) {
  const visible = Object.entries(sections).filter(([key]) => grouped[key as Exclude<FilterKey, "all">].length > 0);

  if (visible.length === 0) {
    return (
      <p className="mt-12 text-center text-muted-foreground">
        No staff members found in this category.
      </p>
    );
  }

  return (
    <>
      {visible.map(([key, section]) => {
        const members = grouped[key as Exclude<FilterKey, "all">];
        return (
          <section className="border-t border-border" key={key}>
            <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
              <div className="reveal">
                <Badge variant="outline" className="gap-1.5 border-accent/50 text-accent border-rotate">
                  <section.icon className="size-3.5" />
                  {section.title}
                </Badge>
                <h2 className="mt-4">{section.title}</h2>
                <p className="mt-2 text-muted-foreground body-large">{section.desc}</p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-children">
                {members.map((member) => (
                  <div key={member.username} className="h-full">
                    <TiltCard maxTilt={6} glare={false} className="h-full">
                      <Card
                        className="cursor-pointer p-0 card-hover card-glow transition-all duration-300 h-full"
                        onClick={() => onSelect(member)}
                      >
                        <CardContent className="flex items-center gap-3 p-4">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                            <member.primaryRole.icon className="size-4" />
                          </div>
                          <div className="min-w-0 text-left">
                            <h3 className="truncate text-sm font-medium">{member.name}</h3>
                            <RoleBadges roles={member.roles} />
                          </div>
                        </CardContent>
                      </Card>
                    </TiltCard>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}

function RoleBadges({ roles }: { roles: RoleInfo[] }) {
  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {roles.map((role) => (
        <Badge
          key={`${role.filterKey}-${role.displayName}`}
          variant="secondary"
          className="gap-1 text-[11px]"
        >
          <role.icon className="size-3" />
          {role.displayName}
        </Badge>
      ))}
    </div>
  );
}

function StaffModal({ member, onClose }: { member: StaffMember | null; onClose: () => void }) {
  const links = Object.entries(member?.links || {}).filter(([, value]) => Boolean(value));

  return (
    <Dialog open={Boolean(member)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        {member && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <member.primaryRole.icon className="size-5" />
                </div>
                <div>
                  <DialogTitle>{member.name}</DialogTitle>
                  <RoleBadges roles={member.roles} />
                </div>
              </div>
            </DialogHeader>

            {member.about ? (
              <div>
                <h3 className="text-sm font-medium">About</h3>
                <p className="mt-1 text-sm text-muted-foreground">{member.about}</p>
              </div>
            ) : null}

            {links.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium">Links</h3>
                <div className="mt-2 flex flex-col gap-2">
                  {links.map(([key, value]) => {
                    const info = linkIcons[key] || { icon: Globe, label: key };
                    return (
                      <a
                        key={key}
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-md border border-border p-3 text-sm transition-all duration-200 hover:bg-secondary hover:border-accent/30"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                          {info.isBrand ? (
                            <FontAwesomeIcon icon={info.icon as IconDefinition} className="size-4" />
                          ) : (
                            React.createElement(info.icon as LucideIcon, { className: "size-4" })
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <strong className="block">{info.label}</strong>
                          <span className="block truncate text-muted-foreground">{value}</span>
                        </div>
                        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Benefit({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <TiltCard maxTilt={6} glare={false} className="h-full">
      <div className="flex flex-col items-center gap-1.5 text-center rounded-lg border border-border bg-card p-6 card-hover transition-all duration-300">
        <div className="flex size-9 items-center justify-center rounded-md bg-secondary">
          <Icon className="size-4" />
        </div>
        <strong className="text-sm">{title}</strong>
        <span className="text-xs text-muted-foreground">{text}</span>
      </div>
    </TiltCard>
  );
}
