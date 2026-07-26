"use client";

import Link from "@/components/NoPrefetchLink";
import { useEffect, useState } from "react";
import {
  Bot,
  Check,
  Compass,
  Database,
  DoorOpen,
  Filter,
  GitBranch,
  Globe,
  HandHeart,
  Info,
  ListChecks,
  Rocket,
  Sparkles,
  Users,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const inviteCode = "QbeZ3b5CQd";
const inviteUrl = `https://discord.gg/${inviteCode}`;

const commands = [
  {
    cmd: "npm start",
    output: [
      { type: "success", text: "Server initialized successfully" },
      { type: "success", text: "Connected to FreeHosts Community" },
      { type: "status", text: "Status: ", status: "Online" },
    ],
  },
  {
    cmd: "freehosts --info",
    output: [
      { type: "info-block", text: "╔══════════════════════════════╗\n║     FreeHosts Directory      ║\n╚══════════════════════════════╝" },
      { type: "success", text: "Community-curated hosting lists" },
      { type: "success", text: "100+ verified free hosting options" },
      { type: "success", text: "Real user reviews & ratings" },
      { type: "status", text: "Status: ", status: "Active" },
    ],
  },
  {
    cmd: "freehosts search --category bots",
    output: [
      { type: "info", text: "Searching directory..." },
      { type: "success", text: "Found 30+ Discord bot hosting providers" },
      { type: "success", text: "Found 15+ Telegram bot hosts" },
      { type: "success", text: "All entries community-verified" },
      { type: "status", text: "Status: ", status: "Ready" },
    ],
  },
  {
    cmd: "community --stats",
    output: [
      { type: "success", text: "400+ active members joined" },
      { type: "success", text: "100+ hosting reviews published" },
      { type: "success", text: "Platform updates daily" },
      { type: "status", text: "Status: ", status: "Growing" },
    ],
  },
];

const hostingCategories = [
  { icon: <Globe size={20} aria-hidden="true" />, title: "Website Hosting", text: "Deploy static sites, portfolios, blogs, and landing pages with providers optimized for frontend performance and easy publishing." },
  { icon: <GitBranch size={20} aria-hidden="true" />, title: "Application Hosting", text: "Run Node.js, Python, PHP, Ruby, and other backend apps for APIs, dashboards, and full-stack projects that need server-side logic." },
  { icon: <Bot size={20} aria-hidden="true" />, title: "Bot Hosting", text: "Keep Discord, Telegram, and automation bots online with enough uptime and resources for small to medium community projects." },
  { icon: <Database size={20} aria-hidden="true" />, title: "Database Hosting", text: "Use free PostgreSQL, MongoDB, MySQL, or Redis services for apps that need storage, auth, content, and structured data." },
];

const choiceChecklist = [
  "Compare storage, bandwidth, and compute limits before deploying.",
  "Check uptime, cold starts, and deployment complexity for your stack.",
  "Read community reviews to spot hidden limits and real-world reliability.",
  "Pick a host with an upgrade path if your project may grow quickly.",
];

type TerminalLine = { type: string; text: string; status?: string };

type DiscordState = {
  name: string;
  status: string;
  count: string;
  showInvite: boolean;
};

function fetchWithTimeout(url: string, timeout = 7000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeout);

  return fetch(url, { cache: "no-cache", signal: controller.signal }).finally(() => {
    window.clearTimeout(timer);
  });
}

export default function HomeClient() {
  const [terminalCommand, setTerminalCommand] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<TerminalLine[]>([]);
  const [typedText, setTypedText] = useState("");
  const [discord, setDiscord] = useState<DiscordState>({
    name: "Discord",
    status: "Loading server info...",
    count: "-",
    showInvite: false,
  });

  // Hero typing effect
  useEffect(() => {
    const words = ["for demos", "for students", "for hobby projects", "for experiments"];
    let i = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timer: number;

    function type() {
      const currentWord = words[i % words.length];
      if (isDeleting) {
        charIndex--;
        setTypedText(currentWord.substring(0, charIndex));
      } else {
        charIndex++;
        setTypedText(currentWord.substring(0, charIndex));
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        timer = window.setTimeout(type, 1100);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        i++;
        timer = window.setTimeout(type, 500);
      } else {
        timer = window.setTimeout(type, isDeleting ? 40 : 90);
      }
    }

    timer = window.setTimeout(type, 800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let currentIndex = 0;
    let timer: number | undefined;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });

    const typeText = async (text: string, speed = 50) => {
      setTerminalCommand("");
      for (let i = 0; i < text.length; i += 1) {
        if (cancelled) return;
        setTerminalCommand(text.slice(0, i + 1));
        await sleep(speed);
      }
    };

    const runCommand = async () => {
      while (!cancelled) {
        const command = commands[currentIndex];
        setTerminalOutput([]);
        await typeText(command.cmd, 60);
        await sleep(500);
        if (cancelled) return;
        setTerminalOutput(command.output);
        await sleep(4000);
        currentIndex = (currentIndex + 1) % commands.length;
        await sleep(1000);
      }
    };

    timer = window.setTimeout(runCommand, 1000);

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const setFallback = () => {
      setDiscord({
        name: "Discord",
        status: "Server info unavailable",
        count: "-",
        showInvite: false,
      });
    };

    const loadDiscord = async () => {
      try {
        const response = await fetchWithTimeout(
          `https://discord.com/api/v9/invites/${encodeURIComponent(inviteCode)}?with_counts=true&with_expiration=true`,
          8000,
        );
        if (!response.ok) throw new Error("Non-OK response");
        const data = await response.json();
        const count =
          data.approximate_member_count ??
          data.approximate_presence_count ??
          (Array.isArray(data.members) ? data.members.length : null);

        setDiscord({
          name: data.guild?.name || "Discord",
          status: count !== null ? "Live - join the server" : "Live server info",
          count: count !== null ? String(count) : "-",
          showInvite: true,
        });
      } catch {
        try {
          const response = await fetchWithTimeout(
            "https://discord.com/api/guilds/1221389187719102514/widget.json",
            6000,
          );
          if (!response.ok) throw new Error("Widget fetch failed");
          const data = await response.json();
          const count =
            data.presence_count ??
            (Array.isArray(data.members) ? data.members.length : null);

          setDiscord({
            name: data.name || "Discord",
            status: count !== null ? "Live - join the server" : "Live server info",
            count: count !== null ? String(count) : "-",
            showInvite: true,
          });
        } catch {
          setFallback();
        }
      }
    };

    loadDiscord();
  }, []);

  return (
    <main>
      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="blobs" aria-hidden="true">
          <div className="blob b1" />
          <div className="blob b2" />
          <div className="blob b3" />
        </div>

        <div className="wrap hero-inner">
          <div className="hero-left">
            <h1 id="hero-title" className="hero-title">
              Discover free hosting that <span className="gradient-text">just works</span>.
              <span className="typed-wrap" aria-hidden="true">
                <span className="typed" id="typedText">{typedText}</span>
                <span className="cursor" id="typedCursor">|</span>
              </span>
            </h1>
            <p className="lead">
              Community-curated directory - find reliable, zero-cost hosting for
              experiments, learning, or small projects.
            </p>

            <div className="hero-cta">
              <Link href="/about">
                <Button variant="default" size="lg">
                  <Info size={16} aria-hidden="true" /> About FreeHosts
                </Button>
              </Link>
              <Button variant="ghost" size="lg" id="joinCommunity" render={<a href={inviteUrl} />}>
                <FontAwesomeIcon icon={faDiscord} aria-hidden="true" /> Join the community
              </Button>
            </div>

            <div className="hero-stats" aria-hidden="true">
              <div className="stat">
                <div className="num" id="hostsCount">100+</div>
                <div className="label">Hosts listed</div>
              </div>
              <div className="stat">
                <div className="num">400+</div>
                <div className="label">Community members</div>
              </div>
              <div className="stat">
                <div className="num">100+</div>
                <div className="label">Reviews</div>
              </div>
            </div>

            <div className="discord-widget" id="discordWidget" aria-live="polite">
              <div className="dw-row">
                <div className="dw-left">
                  <div className="dw-title" id="discordName">
                    <FontAwesomeIcon icon={faDiscord} aria-hidden="true" /> {discord.name}
                  </div>
                  <div className="dw-sub" id="discordStatus">{discord.status}</div>
                </div>
                <div className="dw-right">
                  <div className="dw-count" id="discordCount">{discord.count}</div>
                  {discord.showInvite ? (
                    <Button
                      variant="outline"
                      size="xs"
                      id="discordInvite"
                      onClick={() => window.open(inviteUrl, "_blank", "noopener")}
                    >
                      <DoorOpen size={14} aria-hidden="true" /> Join
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="hero-right" aria-hidden="true">
            <div className="terminal-3d" aria-hidden="true">
              <div className="terminal-header">
                <span className="term-dot red" />
                <span className="term-dot yellow" />
                <span className="term-dot green" />
                <div className="terminal-title">terminal@freehosts:~</div>
              </div>
              <div className="terminal-body" id="terminalBody">
                <div className="terminal-line">
                  <span className="terminal-prompt">user@freehosts:~$</span>
                  <span className="terminal-command" id="terminalCommand">
                    {terminalCommand}
                  </span>
                  <span className="terminal-cursor">_</span>
                </div>
                <div
                  className="terminal-output"
                  id="terminalOutput"
                >
                  {terminalOutput.map((line, i) => {
                    if (line.type === "success") return <div key={i}><span className="success">✓</span> {line.text}</div>;
                    if (line.type === "info") return <div key={i}><span className="info">{line.text}</span></div>;
                    if (line.type === "info-block") return <div key={i}><span className="info" style={{ whiteSpace: "pre" }}>{line.text}</span></div>;
                    if (line.type === "status") return <div key={i} className="terminal-status">{line.text}<span className="status-online">{line.status}</span><span className="status-cursor">▮</span></div>;
                    return <div key={i}>{line.text}</div>;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section wrap">
        <h2 className="section-title">Why people use FreeHosts</h2>
        <p className="section-sub">Quick highlights - no fluff.</p>
        <div className="grid gap-4 sm:grid-cols-3" aria-hidden="true">
          <Card>
            <CardHeader>
              <Rocket size={24} aria-hidden="true" className="text-accent mb-2" />
              <CardTitle>Fast discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Find hosts by use-case quickly - deploy a demo in minutes.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <HandHeart size={24} aria-hidden="true" className="text-accent mb-2" />
              <CardTitle>Community tips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">User-contributed reviews and sample setups to get you started.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Filter size={24} aria-hidden="true" className="text-accent mb-2" />
              <CardTitle>Curated lists</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Hand-curated, up-to-date listings so you do not waste time.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="what-is-free-hosting" className="section wrap">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-4">
            <Badge variant="outline" className="inline-flex items-center gap-1.5">
              <Sparkles size={14} aria-hidden="true" />
              Learn the Basics
            </Badge>
            <h2 className="section-title">What is Free Hosting?</h2>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              Free hosting gives developers, students, and hobbyists a way to deploy
              websites, apps, bots, and community projects without paying for server
              infrastructure upfront. It is ideal for learning, experiments, prototypes,
              and small real-world launches.
            </p>
          </div>

          <Card className="border-accent/20">
            <CardHeader className="flex-row items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Compass size={20} aria-hidden="true" />
              </div>
              <div>
                <CardTitle>Why FreeHosts helps</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  FreeHosts curates verified providers, community reviews, staff picks,
                  and feature breakdowns so you can find the right option faster instead
                  of comparing random services blind.
                </p>
              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {hostingCategories.map((category) => (
              <Card key={category.title}>
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent mb-2">
                    {category.icon}
                  </div>
                  <CardTitle className="text-base">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{category.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks size={16} aria-hidden="true" /> How to Choose Free Hosting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {choiceChecklist.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                      <Check size={14} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={16} aria-hidden="true" /> Join Our Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Our staff and community regularly update hosting lists, publish answers,
                  and share real deployment experience. It is the quickest way to avoid
                  weak providers and find something that actually fits your project.
                </p>
                <p>
                  Most free hosting plans have limits, but they are often generous enough
                  for portfolios, bots, MVPs, and learning projects. And when your app
                  starts growing, many providers offer an easy path to paid upgrades.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="about-teaser" className="section wrap">
        <h2 className="section-title">About FreeHosts</h2>
        <p className="section-sub">
          Built by people who love the web - a friendly place to discover hosting
          options at zero cost.
        </p>
        <Link href="/about">
          <Button variant="outline" size="sm">
            <Info size={14} aria-hidden="true" /> Read more
          </Button>
        </Link>
      </section>
    </main>
  );
}
