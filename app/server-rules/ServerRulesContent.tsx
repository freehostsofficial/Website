import React from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle, Ban, BellOff, Bot, Brain, Clock, Crosshair,
  EyeOff, Flag, Gavel, IdCard, Languages, Lock, MessageCircle,
  Shield, ShieldAlert, UserRoundX, UserX, Users, Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Severity = "low" | "medium" | "high" | "critical";

type Rule = {
  icon: LucideIcon;
  title: string;
  description: string;
  severity: Severity;
  consequence: string;
};

type Category = {
  title: string;
  rules: Rule[];
};

const severityLabel: Record<Severity, string> = {
  low: "Warning",
  medium: "Timeout",
  high: "Kick / Temp Ban",
  critical: "Permanent Ban",
};

const severityColor: Record<Severity, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
};

const categories: Category[] = [
  {
    title: "Community Standards",
    rules: [
      {
        icon: Users,
        title: "Respect Everyone",
        description: "Treat all members with courtesy and professionalism. Harassment, hate speech, discrimination, personal attacks, slurs, or any form of toxic behavior is strictly prohibited. This applies to DMs as well as public channels.",
        severity: "high",
        consequence: "Immediate timeout or ban depending on severity.",
      },
      {
        icon: AlertCircle,
        title: "Zero Tolerance: Hate & Threats",
        description: "Threats, stalking, doxxing, or hateful language targeting any person or group based on race, gender, religion, nationality, sexual orientation, disability, or any other characteristic will not be tolerated — even framed as jokes or memes.",
        severity: "critical",
        consequence: "Permanent ban, no appeal.",
      },
      {
        icon: Brain,
        title: "Use Common Sense",
        description: "If your action could be harmful, disruptive, or disrespectful — don't do it. Staff consider both intent and impact when enforcing rules. 'I was joking' is not a valid defense.",
        severity: "medium",
        consequence: "Warning to timeout depending on context.",
      },
      {
        icon: Languages,
        title: "Use English in General Channels",
        description: "English must be used in all channels except designated language-specific channels. Non-English posts in general channels may be removed without warning to ensure clear communication for all members.",
        severity: "low",
        consequence: "Message removed; repeat offenses result in a warning.",
      },
    ],
  },
  {
    title: "Content & Messaging",
    rules: [
      {
        icon: Ban,
        title: "No Spam, Ads, or Mass Mentions",
        description: "Do not flood channels with repeated messages, excessive emojis, copypasta, or unsolicited links. Advertising, self-promotion, referral links, or unauthorized @everyone/@here/@role mentions are not allowed without staff permission.",
        severity: "medium",
        consequence: "Message deletion and timeout. Repeat offenses result in a ban.",
      },
      {
        icon: EyeOff,
        title: "Safe-for-Work Content Only",
        description: "No NSFW, violent, graphic, or illegal content anywhere in the server. All images, videos, links, and files must comply with Discord's Terms of Service and Community Guidelines. Age-restricted content is never permitted.",
        severity: "high",
        consequence: "Immediate removal of content and timeout or ban.",
      },
      {
        icon: ShieldAlert,
        title: "No Malicious Content",
        description: "Sharing malware, phishing links, token grabbers, IP loggers, scam links, or any files or scripts designed to harm others' security or accounts is strictly forbidden.",
        severity: "critical",
        consequence: "Permanent ban and report to Discord Trust & Safety.",
      },
      {
        icon: BellOff,
        title: "No Ghost Pings or Trick Mentions",
        description: "Ping-and-delete (ghost pings), pinging large groups to troll, or using misleading mentions to disrupt members is not allowed. Unauthorized mass pings will be treated as spam.",
        severity: "medium",
        consequence: "Warning and timeout. Repeated abuse results in a ban.",
      },
      {
        icon: Crosshair,
        title: "Stay On Topic",
        description: "Post content relevant to the channel's purpose. Off-topic discussions should be moved to appropriate channels. Derailing conversations or cluttering channels with irrelevant content is disruptive.",
        severity: "low",
        consequence: "Message removed; warning for repeated violations.",
      },
    ],
  },
  {
    title: "Identity & Accounts",
    rules: [
      {
        icon: UserX,
        title: "No Alt Accounts or Ban Evasion",
        description: "Using alternate accounts to bypass mutes, timeouts, or bans is strictly forbidden. If your main account is actioned, your alt will be banned as well. Creating alts to evade punishment is considered a serious violation.",
        severity: "critical",
        consequence: "All accounts permanently banned.",
      },
      {
        icon: UserRoundX,
        title: "No Impersonation",
        description: "Do not impersonate staff, bots, other members, or public figures by copying usernames, avatars, or using misleading nicknames. This includes pretending to have staff permissions or authority you do not have.",
        severity: "high",
        consequence: "Forced nickname change and timeout or ban.",
      },
      {
        icon: IdCard,
        title: "Appropriate Usernames & Avatars",
        description: "Your username, nickname, and avatar must not contain offensive language, hate symbols, NSFW imagery, or disruptive formatting (e.g. invisible characters, zalgo text). Names must be readable and non-controversial.",
        severity: "low",
        consequence: "Forced nickname change; ban if non-compliant after warning.",
      },
    ],
  },
  {
    title: "Privacy & Safety",
    rules: [
      {
        icon: Lock,
        title: "No Doxxing or Privacy Violations",
        description: "Never share another person's personal information — including real name, address, phone number, email, private messages, photos, or any other identifying data — without their explicit consent. This applies to public figures as well.",
        severity: "critical",
        consequence: "Permanent ban and report to Discord Trust & Safety.",
      },
      {
        icon: Flag,
        title: "Report Issues, Don't Escalate",
        description: "If you witness rule-breaking, harassment, or conflicts, report them to a moderator using the appropriate channel or DM. Do not argue publicly, post callouts, or attempt to handle disputes yourself — this often makes things worse.",
        severity: "medium",
        consequence: "Warning for escalation; timeout if disruptive.",
      },
    ],
  },
  {
    title: "Staff & Moderation",
    rules: [
      {
        icon: Shield,
        title: "Respect Staff Decisions",
        description: "All staff decisions — warnings, timeouts, kicks, and bans — are final. If you believe an action was unjust, contact a senior staff member privately and calmly. Do not argue publicly, post complaints in channels, or rally other members against staff.",
        severity: "high",
        consequence: "Continued defiance results in escalated punishment.",
      },
      {
        icon: Gavel,
        title: "Staff Have Final Authority",
        description: "Staff may take enforcement action beyond what is explicitly listed in these rules to protect the community. Rules are a baseline — staff judgment applies in edge cases. All decisions are non-negotiable in public.",
        severity: "high",
        consequence: "Varies by situation.",
      },
      {
        icon: MessageCircle,
        title: "Follow Discord Terms of Service",
        description: "All activity in this server must comply with Discord's Terms of Service and Community Guidelines. Violations will be reported to Discord directly. We cooperate fully with Discord's Trust & Safety team.",
        severity: "critical",
        consequence: "Ban and report to Discord.",
      },
    ],
  },
  {
    title: "Bots & Technical",
    rules: [
      {
        icon: Bot,
        title: "No Bot Abuse or Exploit Use",
        description: "Do not spam bot commands, mass-trigger bot features, or exploit bugs in bots or server systems. If you discover a bug or vulnerability, report it to staff immediately rather than taking advantage of it.",
        severity: "medium",
        consequence: "Timeout; ban for repeated or intentional abuse.",
      },
      {
        icon: Zap,
        title: "No Unauthorized Automation",
        description: "Self-bots, user-bots, or any automated tools that interact with the server on your behalf without explicit staff approval are prohibited. This includes auto-responders, message scrapers, and account automation.",
        severity: "high",
        consequence: "Permanent ban.",
      },
    ],
  },
];

export default function ServerRulesContent() {
  const totalRules = categories.reduce((sum, c) => sum + c.rules.length, 0);

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <section className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-secondary" aria-hidden="true">
          <Shield className="size-7" />
        </div>
        <h1>Discord Server Rules</h1>
        <p className="max-w-lg text-muted-foreground">
          To maintain a safe, welcoming, and productive community, all members must follow these rules. Ignorance of the rules is not an excuse.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Shield className="size-3.5" /> {totalRules} rules across {categories.length} categories
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" /> Last updated: April 26, 2026
          </span>
        </div>
      </section>

      {/* Severity legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-4 rounded-lg border border-border bg-card p-4">
        {(Object.entries(severityLabel) as [Severity, string][]).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2.5 rounded-full" style={{ background: severityColor[key] }} />
            {label}
          </div>
        ))}
      </div>

      {categories.map((category) => (
        <section key={category.title} className="mt-10">
          <h2 className="text-lg">{category.title}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {category.rules.map((rule, index) => (
              <Card key={index} className="gap-3 py-4">
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex size-9 items-center justify-center rounded-md bg-secondary">
                      <rule.icon className="size-4" />
                    </div>
                    <Badge
                      variant="outline"
                      style={{
                        background: `${severityColor[rule.severity]}18`,
                        color: severityColor[rule.severity],
                        borderColor: `${severityColor[rule.severity]}40`,
                      }}
                    >
                      {severityLabel[rule.severity]}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{rule.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
                    <Gavel className="size-3" />
                    {rule.consequence}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          Staff reserve the right to update these rules at any time. Continued participation in the server constitutes acceptance of the current rules.
        </p>
      </footer>
    </main>
  );
}
