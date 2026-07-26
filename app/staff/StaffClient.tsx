"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Award, Code, Crown, Globe, GraduationCap, HandHeart, HandMetal, Heart, LayoutGrid, Newspaper, Server, Shield, ShieldCheck, Terminal, Upload, UserCheck, Users } from "lucide-react";
import { staffData, type StaffJsonMember } from "./data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

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

const sections: Record<Exclude<FilterKey, "all">, { title: string; desc: string; iconClass: string; icon: LucideIcon }> = {
  owner: { title: "Owners", desc: "Founders and leaders of FreeHosts", iconClass: "leadership", icon: Crown },
  administrator: { title: "Administrators", desc: "Team administrators managing operations", iconClass: "leadership", icon: UserCheck },
  developer: { title: "Developers", desc: "Building and maintaining our platform", iconClass: "development", icon: Code },
  moderator: { title: "Moderators", desc: "Community moderators keeping things safe", iconClass: "community", icon: Shield },
  helper: { title: "Helpers", desc: "Support team helping our community", iconClass: "community", icon: HandHeart },
  "host-publisher": { title: "Host Publishers", desc: "Contributors managing host listings", iconClass: "hosting", icon: Upload },
  "hosting-provider": { title: "Hosting Providers", desc: "Partners providing hosting services", iconClass: "hosting", icon: Server },
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

const linkIcons: Record<string, { icon: LucideIcon; label: string }> = {
  github: { icon: Globe, label: "GitHub Profile" },
  website: { icon: Globe, label: "Website" },
  discord: { icon: Globe, label: "Discord" },
  twitter: { icon: Globe, label: "Twitter" },
  linkedin: { icon: Globe, label: "LinkedIn" },
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

  useEffect(() => {
    if (!selectedMember) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedMember(null);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedMember]);

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
    <main className="wrap py-12">
      <section className="text-center mb-8">
        <div className="flex justify-center text-accent mb-4">
          <Users size={24} aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-bold">Meet Our Team</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Dedicated volunteers who help run, maintain, and grow the FreeHosts community.
        </p>
      </section>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {filters.map((filter) => (
          <Button
            variant={activeFilter === filter.key ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveFilter(filter.key)}
            key={filter.key}
          >
            {React.createElement(filter.icon, { size: 14, "aria-hidden": "true" })}
            {filter.label}
          </Button>
        ))}
      </div>

      <StaffSections grouped={grouped} onSelect={setSelectedMember} />

      <Card className="max-w-lg mx-auto mt-12 text-center">
        <CardContent className="py-8 space-y-4">
          <div className="flex justify-center text-accent">
            <HandMetal size={24} aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold">Want to Join the Team?</h2>
          <p className="text-sm text-muted-foreground">
            We&apos;re always looking for passionate volunteers to help grow and improve FreeHosts.
          </p>
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="rounded-lg bg-muted/50 p-3 space-y-1">
              <Heart size={16} className="text-accent" />
              <div className="text-sm font-medium">Make an Impact</div>
              <div className="text-xs text-muted-foreground">Help thousands find the right hosting</div>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 space-y-1">
              <Users size={16} className="text-accent" />
              <div className="text-sm font-medium">Join Community</div>
              <div className="text-xs text-muted-foreground">Work with passionate volunteers</div>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 space-y-1">
              <GraduationCap size={16} className="text-accent" />
              <div className="text-sm font-medium">Learn & Grow</div>
              <div className="text-xs text-muted-foreground">Gain experience and skills</div>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 space-y-1">
              <Award size={16} className="text-accent" />
              <div className="text-sm font-medium">Recognition</div>
              <div className="text-xs text-muted-foreground">Get credited for your work</div>
            </div>
          </div>
          <a href="https://discord.gg/QbeZ3b5CQd" target="_blank" rel="noopener noreferrer">
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0741.0741 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.1776-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
              Join Our Discord
            </Button>
          </a>
        </CardContent>
      </Card>

      <Dialog open={!!selectedMember} onOpenChange={(open) => { if (!open) setSelectedMember(null); }}>
        {selectedMember && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  {React.createElement(selectedMember.primaryRole.icon, { size: 20, "aria-hidden": "true" })}
                </div>
                <div>
                  <DialogTitle>{selectedMember.name}</DialogTitle>
                  <DialogDescription>
                    <RoleBadges roles={selectedMember.roles} />
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              {selectedMember.about && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">About</h4>
                  <p className="text-sm text-muted-foreground">{selectedMember.about}</p>
                </div>
              )}
              {selectedMember.links && Object.entries(selectedMember.links).filter(([, v]) => v).length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Links</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedMember.links).filter(([, v]) => v).map(([key, value]) => {
                      const info = linkIcons[key] || { icon: Globe, label: key };
                      return (
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          key={key}
                          className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                        >
                          {React.createElement(info.icon, { size: 16, "aria-hidden": "true", className: "text-muted-foreground shrink-0" })}
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium truncate">{info.label}</div>
                            <div className="text-xs text-muted-foreground truncate">{value}</div>
                          </div>
                          <ArrowUpRight size={16} className="text-muted-foreground shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
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
    return <p className="text-center text-muted-foreground">No staff members found in this category.</p>;
  }

  return (
    <div className="space-y-8">
      {visible.map(([key, section]) => {
        const members = grouped[key as Exclude<FilterKey, "all">];
        return (
          <section key={key}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                {React.createElement(section.icon, { size: 20, "aria-hidden": "true" })}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{section.title}</h2>
                <p className="text-sm text-muted-foreground">{section.desc}</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <button type="button" key={member.username} className="text-left" onClick={() => onSelect(member)}>
                  <Card className="cursor-pointer hover:border-accent/50 transition-colors h-full">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        {React.createElement(member.primaryRole.icon, { size: 20, "aria-hidden": "true" })}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm truncate">{member.name}</div>
                        <RoleBadges roles={member.roles} />
                      </div>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function RoleBadges({ roles }: { roles: RoleInfo[] }) {
  return (
    <div className="flex flex-wrap gap-1 mt-0.5">
      {roles.map((role) => (
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1" key={`${role.filterKey}-${role.displayName}`}>
          {React.createElement(role.icon, { size: 10, "aria-hidden": "true" })}
          {role.displayName}
        </Badge>
      ))}
    </div>
  );
}
