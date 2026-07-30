"use client";

import Link from "@/components/NoPrefetchLink";
import { useEffect, useState, useRef } from "react";
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

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/ui/TiltCard";
import { GlitchText } from "@/components/ui/GlitchText";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { cn } from "@/lib/utils";

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
  { icon: <Globe className="size-5" />, title: "Website Hosting", text: "Deploy static sites, portfolios, blogs, and landing pages with providers optimized for frontend performance and easy publishing." },
  { icon: <GitBranch className="size-5" />, title: "Application Hosting", text: "Run Node.js, Python, PHP, Ruby, and other backend apps for APIs, dashboards, and full-stack projects that need server-side logic." },
  { icon: <Bot className="size-5" />, title: "Bot Hosting", text: "Keep Discord, Telegram, and automation bots online with enough uptime and resources for small to medium community projects." },
  { icon: <Database className="size-5" />, title: "Database Hosting", text: "Use free PostgreSQL, MongoDB, MySQL, or Redis services for apps that need storage, auth, content, and structured data." },
];

const choiceChecklist = [
  "Compare storage, bandwidth, and compute limits before deploying.",
  "Check uptime, cold starts, and deployment complexity for your stack.",
  "Read community reviews to spot hidden limits and real-world reliability.",
  "Pick a host with an upgrade path if your project may grow quickly.",
];

const features = [
  { icon: <Rocket className="size-6" />, title: "Fast discovery", text: "Find hosts by use-case quickly — deploy a demo in minutes." },
  { icon: <HandHeart className="size-6" />, title: "Community tips", text: "User-contributed reviews and sample setups to get you started." },
  { icon: <Filter className="size-6" />, title: "Curated lists", text: "Hand-curated, up-to-date listings so you do not waste time." },
];

type TerminalLine = { type: string; text: string; status?: string };

type DiscordState = {
  name: string;
  status: string;
  count: string;
  showInvite: boolean;
};

function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function useParallax<T extends HTMLElement = HTMLDivElement>(speed = 0.3) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) return;
    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const scrollProgress = rect.top / window.innerHeight;
      el.style.transform = `translateY(${scrollProgress * speed * 100}px)`;
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);
  return ref;
}

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

  const heroRef = useReveal<HTMLDivElement>();
  const parallaxRef = useParallax<HTMLDivElement>(-0.15);

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
          status: count !== null ? "Live — join the server" : "Live server info",
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
            status: count !== null ? "Live — join the server" : "Live server info",
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
      <section className="relative border-b border-border overflow-hidden noise-overlay" id="home" aria-labelledby="hero-title">
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="absolute -top-24 -right-24 size-96 blob-morph opacity-20" />
        <div className="absolute -bottom-24 -left-24 size-96 blob-morph opacity-10" style={{ animationDelay: "-4s" }} />

        <div
          ref={heroRef}
          className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24"
        >
          <div className="flex flex-col gap-6 reveal visible">
            <h1 id="hero-title" className="text-balance">
              <GlitchText text="Discover free hosting" variant="chromatic" as="span" />
              <span className="block gradient-text">
                that just works.
              </span>
              <span className="mt-2 block font-mono text-xl text-muted-foreground sm:text-2xl" aria-hidden="true">
                <span>{typedText}</span>
                <span className="animate-pulse">|</span>
              </span>
            </h1>
            <p className="max-w-md text-muted-foreground body-large">
              Community-curated directory — find reliable, zero-cost hosting for
              experiments, learning, or small projects.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/about">
                  <Info className="size-4" />
                  About FreeHosts
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={inviteUrl} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faDiscord} className="size-4" />
                  Join the community
                </a>
              </Button>
            </div>

            <dl className="flex flex-wrap gap-8" aria-hidden="true">
              <div className="reveal visible reveal-delay-1">
                <dt className="sr-only">Hosts listed</dt>
                <dd className="font-mono text-2xl font-semibold gradient-text">
                  <AnimatedCounter from={0} to={100} suffix="+" duration={2500} />
                </dd>
                <dt className="text-sm text-muted-foreground">Hosts listed</dt>
              </div>
              <div className="reveal visible reveal-delay-2">
                <dd className="font-mono text-2xl font-semibold gradient-text">
                  <AnimatedCounter from={0} to={400} suffix="+" duration={2500} />
                </dd>
                <dt className="text-sm text-muted-foreground">Community members</dt>
              </div>
              <div className="reveal visible reveal-delay-3">
                <dd className="font-mono text-2xl font-semibold gradient-text">
                  <AnimatedCounter from={0} to={100} suffix="+" duration={2500} />
                </dd>
                <dt className="text-sm text-muted-foreground">Reviews</dt>
              </div>
            </dl>

            <LiquidGlassCard glassSize="sm">
              <div className="flex items-center justify-between gap-4" aria-live="polite">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <FontAwesomeIcon icon={faDiscord} className="size-4 text-muted-foreground" />
                    {discord.name}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{discord.status}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-mono text-sm text-muted-foreground">{discord.count}</span>
                  {discord.showInvite ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => window.open(inviteUrl, "_blank", "noopener")}
                    >
                      <DoorOpen className="size-3.5" />
                      Join
                    </Button>
                  ) : null}
                </div>
              </div>
            </LiquidGlassCard>
          </div>

          <div aria-hidden="true" className="reveal visible reveal-delay-4" ref={parallaxRef}>
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-medium">
              <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-destructive/70" />
                <span className="size-2.5 rounded-full bg-muted-foreground/40" />
                <span className="size-2.5 rounded-full bg-accent/70" />
                <span className="ml-2 truncate text-xs text-muted-foreground">
                  terminal@freehosts:~
                </span>
              </div>
              <div className="min-h-64 space-y-1.5 p-4 font-mono text-sm leading-relaxed">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-muted-foreground">user@freehosts:~$</span>
                  <span>{terminalCommand}</span>
                  <span className="animate-pulse text-muted-foreground">_</span>
                </div>
                <div>
                  {terminalOutput.map((line, i) => {
                    if (line.type === "success")
                      return (
                        <div key={i}>
                          <span className="text-accent">✓</span> {line.text}
                        </div>
                      );
                    if (line.type === "info")
                      return (
                        <div key={i} className="text-muted-foreground">
                          {line.text}
                        </div>
                      );
                    if (line.type === "info-block")
                      return (
                        <div key={i} className="whitespace-pre text-muted-foreground">
                          {line.text}
                        </div>
                      );
                    if (line.type === "status")
                      return (
                        <div key={i} className="flex items-center gap-1.5">
                          {line.text}
                          <Badge variant="outline" className="border-accent/50 text-accent">{line.status}</Badge>
                        </div>
                      );
                    return <div key={i}>{line.text}</div>;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="reveal">
          <h2>Why people use FreeHosts</h2>
          <p className="mt-2 text-muted-foreground body-large">Quick highlights — no fluff.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {features.map((feature, i) => (
            <div key={feature.title} className={cn("reveal", `reveal-delay-${i + 1}`)}>
              <TiltCard maxTilt={8} glare={false}>
                <Card variant="elevated" hover className="h-full transition-all duration-300">
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      {feature.icon}
                    </div>
                    <h3>{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.text}</p>
                  </CardContent>
                </Card>
              </TiltCard>
            </div>
          ))}
        </div>
      </section>

      <section id="what-is-free-hosting" className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <div className="max-w-2xl reveal">
            <Badge variant="outline" className="gap-1.5 border-accent/50 text-accent border-rotate">
              <Sparkles className="size-3.5" />
              Learn the Basics
            </Badge>
            <h2 className="mt-4">What is Free Hosting?</h2>
            <p className="mt-4 text-muted-foreground body-large">
              Free hosting gives developers, students, and hobbyists a way to deploy
              websites, apps, bots, and community projects without paying for server
              infrastructure upfront. It is ideal for learning, experiments, prototypes,
              and small real-world launches.
            </p>
          </div>

          <SpotlightCard className="mt-8 flex-row items-start gap-4 py-5 reveal reveal-delay-1">
            <CardContent className="flex items-start gap-4 px-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Compass className="size-5" />
              </div>
              <div>
                <h3>Why FreeHosts helps</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  FreeHosts curates verified providers, community reviews, staff picks,
                  and feature breakdowns so you can find the right option faster instead
                  of comparing random services blind.
                </p>
              </div>
            </CardContent>
          </SpotlightCard>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
            {hostingCategories.map((category, i) => (
              <div key={category.title} className="h-full">
                <TiltCard maxTilt={6} glare={false} className="h-full">
                  <Card variant="elevated" hover className="h-full transition-all duration-300">
                    <CardContent className="flex flex-col gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        {category.icon}
                      </div>
                      <h3>{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.text}</p>
                    </CardContent>
                  </Card>
                </TiltCard>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="reveal reveal-delay-1">
              <Card variant="elevated" className="h-full transition-all duration-300">
                <CardContent className="flex flex-col gap-4">
                  <h3 className="flex items-center gap-2">
                    <ListChecks className="size-4 text-accent" />
                    How to Choose Free Hosting
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {choiceChecklist.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground transition-all duration-200 hover:translate-x-0.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="reveal reveal-delay-2">
              <TiltCard maxTilt={5} glare={false}>
                <Card variant="elevated" hover className={cn("h-full transition-all duration-300 border-accent/30")}>
                  <CardContent className="flex flex-col gap-3">
                    <h3 className="flex items-center gap-2">
                      <Users className="size-4 text-accent" />
                      Join Our Community
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Our staff and community regularly update hosting lists, publish answers,
                      and share real deployment experience. It is the quickest way to avoid
                      weak providers and find something that actually fits your project.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Most free hosting plans have limits, but they are often generous enough
                      for portfolios, bots, MVPs, and learning projects. And when your app
                      starts growing, many providers offer an easy path to paid upgrades.
                    </p>
                  </CardContent>
                </Card>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      <section id="about-teaser" className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-16 text-center sm:px-6 reveal">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="float-anim">
              <FontAwesomeIcon icon={faDiscord} className="size-5 text-accent" />
            </span>
            <span className="float-anim float-anim-delay-1">
              <Rocket className="size-5 text-accent-2" />
            </span>
            <span className="float-anim float-anim-delay-2">
              <Sparkles className="size-5 text-accent" />
            </span>
          </div>
          <h2>About FreeHosts</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground body-large">
            Built by people who love the web — a friendly place to discover hosting
            options at zero cost.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/about">
              <Info className="size-4" />
              Read more
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
