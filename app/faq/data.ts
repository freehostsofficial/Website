export type FaqCategory = "general" | "technical" | "submissions" | "support";

export type FaqItem = {
  category: FaqCategory;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    category: "general",
    question: "Is FreeHosts free to use?",
    answer:
      "Yes! The directory and community are completely free for everyone to access. There are no hidden fees, subscriptions, or premium tiers. We are here to help you find the best free hosting options available.",
  },
  {
    category: "general",
    question: "How do you pick which hosts to list?",
    answer:
      "We prioritize hosts that provide clear information about features, specifications, and contact methods. All submissions are reviewed by our volunteer curators to ensure listings are accurate, useful, and legitimate. We focus on quality over quantity.",
  },
  {
    category: "general",
    question: "Are all listed hosts trustworthy?",
    answer:
      "While we do our best to verify information, we cannot guarantee the reliability of every host. We encourage users to read reviews, check community feedback, and always maintain backups of important data. Report any issues to help keep our directory accurate.",
  },
  {
    category: "general",
    question: "Are these hosting services genuinely free with no hidden costs?",
    answer:
      "Absolutely! All services featured on our platform are genuinely free to use without any hidden charges. However, free hosting typically includes certain trade-offs such as reduced memory and processing power, storage limitations, server slot restrictions, advertisement displays, or requirements to manually keep your server active. Understanding these limitations helps you choose the right provider for your needs.",
  },
  {
    category: "technical",
    question: "Do I need to keep my computer running to maintain my server?",
    answer:
      "No, you do not need to keep your computer or browser window open. These hosting services operate on cloud-based infrastructure, meaning your server continues running independently regardless of whether your device is powered on. However, some free hosting providers may automatically stop inactive servers after extended periods of non-use to conserve resources, so periodic activity may be required to keep your server active.",
  },
  {
    category: "technical",
    question: "What happens if a server becomes idle?",
    answer:
      "Many free hosting providers implement idle server policies to manage their resources efficiently. If your server remains inactive for a specified period, typically ranging from days to weeks, it may be automatically stopped or suspended. You can usually restart these servers when needed, though you may need to manually reactivate them through your provider dashboard or console.",
  },
  {
    category: "technical",
    question: "Can I use multiple hosting services simultaneously?",
    answer:
      "Yes, you can use multiple hosting providers at the same time. Many users run different projects or applications across various free hosts to maximize availability and distribute their workload. This approach also provides redundancy and allows you to test different platforms before committing to a paid service.",
  },
  {
    category: "technical",
    question: "What is the difference between managed and unmanaged hosting?",
    answer:
      "Managed hosting providers handle server maintenance, updates, security patches, and technical support on your behalf, making it ideal for users with limited technical expertise. Unmanaged hosting gives you full control and responsibility for server configuration, maintenance, and troubleshooting. Most free hosts are managed or semi-managed to reduce the technical burden on users.",
  },
  {
    category: "technical",
    question: "Are there bandwidth or storage limits?",
    answer:
      "Yes, most free hosting services impose bandwidth and storage limitations to manage their infrastructure costs. These restrictions vary significantly between providers, so it is essential to check the specific limits for each service. Some may offer unlimited storage with limited bandwidth, or vice versa. Always verify these constraints match your project requirements.",
  },
  {
    category: "submissions",
    question: "How can I suggest a hosting provider?",
    answer:
      "Join our Discord server and post in the add-host channel with the host name, key features, screenshots, and a link to their website. Our curators will review your submission and publish it if it meets our criteria.",
  },
  {
    category: "submissions",
    question: "Can I be listed if I run a free host?",
    answer:
      "Absolutely! We welcome submissions from hosting providers. Please provide accurate details, clear specifications, and screenshots via the Discord submission process. We ask for truthful, up-to-date information to help the community make informed decisions.",
  },
  {
    category: "submissions",
    question: "How long does review take?",
    answer:
      "Review times vary depending on submission volume and curator availability. Typically, submissions are reviewed within 3-7 days. You will be notified in Discord once your submission has been processed.",
  },
  {
    category: "submissions",
    question: "What information should I include in my submission?",
    answer:
      "Include the hosting provider name, a brief description, key features offered, pricing information if applicable, contact details, website URL, and recent screenshots showing the service in action. The more comprehensive and accurate your submission, the faster we can process it.",
  },
  {
    category: "submissions",
    question: "Can I update or remove my listing?",
    answer:
      `Yes! If your hosting service has changed, been discontinued, or you want to update information, contact us via Discord or email at support@${process.env.EMAIL_DOMAIN}. Provide the listing link and the changes you would like made, and our team will update or remove it accordingly.`,
  },
  {
    category: "support",
    question: "How do I contact the team?",
    answer:
      `You can reach us through our Discord server for quick responses, or email us at support@${process.env.EMAIL_DOMAIN} for formal inquiries.`,
  },
  {
    category: "support",
    question: "Where can I report incorrect listings?",
    answer:
      "Post the listing link and the correction in our Discord server appropriate channel, or email the team with details. We appreciate community help in keeping our directory accurate and up-to-date.",
  },
  {
    category: "support",
    question: "Can I become a curator or moderator?",
    answer:
      "We occasionally look for dedicated community members to join our team. Active participation in the Discord community and helpful contributions to the directory are great ways to get noticed. Keep an eye on announcements for open positions.",
  },
  {
    category: "support",
    question: "How can I report a host for fraud or misconduct?",
    answer:
      `Please report any suspicious activity or fraudulent hosting services immediately via our Discord server or by emailing support@${process.env.EMAIL_DOMAIN} with evidence and details. We take these reports seriously and investigate thoroughly.`,
  },
  {
    category: "support",
    question: "Is there a status page showing host uptime?",
    answer:
      "FreeHosts itself maintains reliable uptime, but we do not provide uptime monitoring for individual hosts. We recommend checking each provider status page or joining their community channels for reliability information. Our Discord community is a great place to discuss individual host performance and get recommendations.",
  },
  {
    category: "support",
    question: "What should I do if I experience issues with a hosting provider?",
    answer:
      "First, contact the hosting provider support directly. If you continue experiencing unresolved issues, share your experience in our Discord community where others may offer insights. If the provider appears to be misleading or fraudulent, report it to our team so we can investigate and take appropriate action.",
  },
];
