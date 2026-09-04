"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bot,
  Check,
  Compass,
  Database,
  Gamepad2,
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
import { DiscordIcon } from "@/components/BrandIcons";

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
  { icon: <Globe size={20} aria-hidden="true" />, title: "Website Hosting", text: "Deploy static sites, portfolios, blogs, and landing pages with providers optimized for frontend performance and easy publishing.", href: "/categories/free-website-hosting" },
  { icon: <GitBranch size={20} aria-hidden="true" />, title: "Application Hosting", text: "Run Node.js, Python, PHP, Ruby, and other backend apps for APIs, dashboards, and full-stack projects that need server-side logic.", href: "/categories/free-app-hosting" },
  { icon: <Bot size={20} aria-hidden="true" />, title: "Bot Hosting", text: "Keep Discord, Telegram, and automation bots online with enough uptime and resources for small to medium community projects.", href: "/categories/free-discord-bot-hosting" },
  { icon: <Database size={20} aria-hidden="true" />, title: "Database Hosting", text: "Use free PostgreSQL, MongoDB, MySQL, or Redis services for apps that need storage, auth, content, and structured data.", href: "/categories/free-database-hosting" },
  { icon: <Gamepad2 size={20} aria-hidden="true" />, title: "Game Server Hosting", text: "Run Minecraft and other game servers with friends — compare RAM, CPU, slots and idle policies across vetted providers.", href: "/categories/free-game-server-hosting" },
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

type DiscordApi = {
  name?: string;
  count?: number | null;
};

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
    let cancelled = false;

    const setLive = (name: string, count: number | null) => {
      if (cancelled) return;
      setDiscord({
        name,
        status: count !== null ? "Live - join the server" : "Live server info",
        count: count !== null ? String(count) : "-",
        showInvite: true,
      });
    };

    // Live member count comes from our own server-side proxy
    // (/api/discord-widget), so the visitor's browser never contacts
    // Discord directly and no data is shared before consent.
    const loadDiscord = async () => {
      try {
        const response = await fetch("/api/discord-widget", { signal: AbortSignal.timeout(7000) });
        if (!response.ok) throw new Error("widget unavailable");
        const data = (await response.json()) as DiscordApi;
        const count = typeof data.count === "number" ? data.count : null;
        setLive(data.name || "Discord", count);
        return;
      } catch {
        // fall through to the static fallback
      }
      if (!cancelled) {
        setDiscord({ name: "Discord", status: "Server info unavailable", count: "-", showInvite: false });
      }
    };

    loadDiscord();
    return () => { cancelled = true; };
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
              <Link href="/about" className="btn large">
                <Info size={16} aria-hidden="true" /> About FreeHosts
              </Link>
              <a className="btn ghost" id="joinCommunity" href={inviteUrl}>
                <DiscordIcon aria-hidden="true" /> Join the community
              </a>
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
                    <DiscordIcon aria-hidden="true" /> {discord.name}
                  </div>
                  <div className="dw-sub" id="discordStatus">{discord.status}</div>
                </div>
                <div className="dw-right">
                  <div className="dw-count" id="discordCount">{discord.count}</div>
                  {discord.showInvite ? (
                    <button
                      className="btn small"
                      id="discordInvite"
                      type="button"
                      onClick={() => window.open(inviteUrl, "_blank", "noopener")}
                    >
                      <DoorOpen size={14} aria-hidden="true" /> Join
                    </button>
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

      <section id="features" className="section features wrap">
        <h2 className="section-title">Why people use FreeHosts</h2>
        <p className="section-sub">
          FreeHosts is a community-curated directory of free hosting providers for websites, Discord bots, game servers, apps,
          and databases. Each listing includes verified CPU, RAM, and storage specs plus community votes, so you can compare
          providers side by side and deploy your project on a free host in minutes.
        </p>
        <div className="cards-grid" aria-hidden="true">
          <article className="feature-card">
            <div className="icon"><Rocket size={24} aria-hidden="true" /></div>
            <h3>Fast discovery</h3>
            <p>Find hosts by use-case quickly - deploy a demo in minutes.</p>
          </article>
          <article className="feature-card">
            <div className="icon"><HandHeart size={24} aria-hidden="true" /></div>
            <h3>Community tips</h3>
            <p>User-contributed reviews and sample setups to get you started.</p>
          </article>
          <article className="feature-card">
            <div className="icon"><Filter size={24} aria-hidden="true" /></div>
            <h3>Curated lists</h3>
            <p>Hand-curated, up-to-date listings so you do not waste time.</p>
          </article>
        </div>
      </section>

      <section id="what-is-free-hosting" className="section wrap what-is-hosting-section">
        <div className="what-is-hosting-shell">
          <div className="what-is-hosting-intro">
            <div className="what-is-hosting-kicker">
              <Sparkles size={14} aria-hidden="true" />
              Learn the Basics
            </div>
            <h2 className="section-title">What is Free Hosting?</h2>
            <p className="what-is-hosting-lead">
              Free hosting gives developers, students, and hobbyists a way to deploy
              websites, apps, bots, and community projects without paying for server
              infrastructure upfront. It is ideal for learning, experiments, prototypes,
              and small real-world launches.
            </p>
          </div>

          <div className="what-is-hosting-highlight">
            <div className="hosting-highlight-icon">
              <Compass size={20} aria-hidden="true" />
            </div>
            <div>
              <h3>Why FreeHosts helps</h3>
              <p>
                FreeHosts curates verified providers, community reviews, staff picks,
                and feature breakdowns so you can find the right option faster instead
                of comparing random services blind.
              </p>
            </div>
          </div>

          <div className="hosting-category-grid">
            {hostingCategories.map((category) => (
              <Link
                className="hosting-category-card"
                key={category.title}
                href={category.href}
              >
                <div className="hosting-category-icon">
                  {category.icon}
                </div>
                <h3>{category.title}</h3>
                <p>{category.text}</p>
              </Link>
            ))}
          </div>

          <div className="hosting-guide-grid">
            <article className="hosting-guide-card">
              <h3>
                <ListChecks size={16} aria-hidden="true" /> How to Choose Free Hosting
              </h3>
              <ul className="hosting-checklist">
                {choiceChecklist.map((item) => (
                  <li key={item}>
                    <Check size={14} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="hosting-guide-card hosting-guide-card-accent">
              <h3>
                <Users size={16} aria-hidden="true" /> Join Our Community
              </h3>
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
            </article>
          </div>
        </div>
      </section>

      <section id="about-teaser" className="section about wrap">
        <h2 className="section-title">About FreeHosts</h2>
        <p className="section-sub">
          Built by people who love the web - a friendly place to discover hosting
          options at zero cost.
        </p>
        <Link href="/about" className="btn ghost">
          <Info size={14} aria-hidden="true" /> Read more
        </Link>
      </section>
    </main>
  );
}
