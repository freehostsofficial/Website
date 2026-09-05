import ProsePage from "@/components/ProsePage";
import ServerRulesContent from "./ServerRulesContent";
import { pageMeta } from "../../lib/pageMeta";

const TITLE = "Discord Server Rules & Community Guidelines - FreeHosts";

export const metadata = pageMeta({
  path: "/server-rules",
  title: TITLE,
  description:
    "Read the official FreeHosts Discord server rules and community guidelines. We maintain a safe, respectful, and productive environment for all members.",
  ogDescription:
    "Our official server rules ensure a positive experience for everyone in the FreeHosts community. Review them here.",
  twitterDescription:
    "All members must follow our community guidelines to remain part of the FreeHosts network.",
  keywords: [
    "freehosts server rules",
    "freehosts discord rules",
    "freehosts community guidelines",
    "hosting community rules",
  ],
  imageAlt: "FreeHosts - Server Rules",
  twitterImageAlt: "FreeHosts - Server Rules",
});

export default function ServerRulesPage() {
  return (
    <ProsePage
      path="/server-rules"
      crumb="Server Rules"
      name={TITLE}
      description="Official Discord server rules and community guidelines for the FreeHosts community."
      mainClassName="wrap section"
    >
      <ServerRulesContent />
    </ProsePage>
  );
}
