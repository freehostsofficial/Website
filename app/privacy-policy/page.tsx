import ProsePage from "@/components/ProsePage";
import PrivacyPolicyContent from "./PrivacyPolicyContent";
import { pageMeta } from "../../lib/pageMeta";

const TITLE = "Privacy Policy - FreeHosts";
const DESCRIPTION =
  "Read the FreeHosts Privacy Policy. Learn how we collect, use, and protect your data when you use our free hosting directory and community.";
const SOCIAL_DESCRIPTION =
  "Read the FreeHosts Privacy Policy. Learn how we collect, use, and protect your data.";

export const metadata = pageMeta({
  path: "/privacy-policy",
  title: TITLE,
  description: DESCRIPTION,
  ogDescription: SOCIAL_DESCRIPTION,
  keywords: ["freehosts privacy policy", "hosting directory privacy", "freehosts data policy"],
  imageAlt: "FreeHosts - Privacy Policy",
  twitterImageAlt: "FreeHosts - Privacy Policy",
});

export default function PrivacyPolicyPage() {
  return (
    <ProsePage path="/privacy-policy" crumb="Privacy Policy" name={TITLE} description={SOCIAL_DESCRIPTION}>
      <PrivacyPolicyContent />
    </ProsePage>
  );
}
