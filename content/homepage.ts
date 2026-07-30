export const HERO_COMMANDS = [
  { cmd: "freehosts --help", output: "FreeHosts — Community-Curated Free Hosting Directory\n\nUsage:\n  browse [category]    List free hosting providers\n  compare [host...]    Compare up to 4 providers side by side\n  submit <url>        Suggest a new host to the community\n  about               About FreeHosts and our mission" },
  { cmd: "browse --type=static", output: "Found 12 static hosting providers:\n  vercel         • 100 GB bandwidth • 1 TB bandwidth\n  netlify        • 100 GB bandwidth • 300 min/month\n  cloudflare     • Unlimited • Workers\n  github         • 1 GB storage • 100 GB bandwidth\n  surge          • Unlimited • CLI deploys\n  render         • 100 GB bandwidth • 90s build" },
  { cmd: "compare vercel netlify", output: "Comparing: vercel vs netlify\n\n                Vercel        Netlify\nRAM             —             —\nStorage         —             —\nBandwidth       100 GB        100 GB\nCustom Domain   ✓             ✓\nSSL             ✓             ✓\nBuild mins      6,000         300/mo\nDeploy          Git push      Git push" },
  { cmd: "submit --help", output: "Submit a Host\n\nTo suggest a new free hosting provider:\n  1. Visit freehosts.eu/submit-host\n  2. Fill in the provider details\n  3. Our team reviews and approves\n\nRequirements:\n  • Must offer a genuinely free tier\n  • Must be a legitimate service\n  • No illegal or malicious services" },
  { cmd: "about", output: "FreeHosts is a community-curated directory of free hosting\nproviders. We list verified free plans for websites, Discord\nbots, applications, and databases.\n\nOur mission: Make free hosting discoverable and transparent.\nEvery listing includes real community ratings, detailed specs,\nand direct comparison tools.\n\nJoin 10,000+ developers finding their perfect free host." },
];

export const HERO_SEO_TEXT = `FreeHosts is a community-curated directory of free hosting providers. Compare free web hosting, Discord bot hosting, application hosting, and database hosting. Find verified free plans with community ratings, detailed specs, and side-by-side comparisons.`;

export const FAQ_DATA = [
  {
    question: "Is free hosting really free?",
    answer: "Yes — every provider listed on FreeHosts offers a genuinely free tier with no upfront cost. However, 'free' often comes with limitations on resources (CPU, RAM, storage) and may require upgrades for production-scale usage. We clearly list each plan's limits so you can make an informed choice."
  },
  {
    question: "What are the trade-offs of free hosting?",
    answer: "Free hosting plans typically have limited CPU, RAM, storage, and bandwidth compared to paid tiers. Some providers display ads, impose sleep timers on idle apps, or restrict custom domains. We highlight these trade-offs in each listing so you know exactly what you're getting."
  },
  {
    question: "How do I choose the right free host?",
    answer: "Consider what you're building: static sites need different resources than Discord bots or databases. Use our filters to narrow by hosting type (Website, Bot, App, Database), compare specs side by side, and read community ratings to see real user experiences."
  },
  {
    question: "Are the hosts on FreeHosts verified?",
    answer: "Yes — our community team reviews each submission to verify it offers a genuine free tier. Listings include community approvals and disapprovals so you can gauge reliability. We regularly audit listed providers and remove those that no longer meet our criteria."
  }
];

export const CATEGORIES = [
  { href: "/hosts?target=Websites", label: "Website Hosting", description: "Static & dynamic sites" },
  { href: "/hosts?target=Discord%20Bots", label: "Bot Hosting", description: "Discord, Telegram & more" },
  { href: "/hosts?target=Apps", label: "App Hosting", description: "Backends & APIs" },
  { href: "/hosts?target=Databases", label: "Database Hosting", description: "SQL & NoSQL" },
];
