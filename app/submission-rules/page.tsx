import ProsePage from "@/components/ProsePage";
import SubmissionRulesContent from "./SubmissionRulesContent";
import { pageMeta } from "../../lib/pageMeta";

const TITLE = "Host Submission Rules & Guidelines - FreeHosts";
const SOCIAL_DESCRIPTION =
  "Read the official submission rules before listing your hosting service on FreeHosts.";

export const metadata = pageMeta({
  path: "/submission-rules",
  title: TITLE,
  description:
    "Read the official submission rules before listing your hosting service on FreeHosts. Learn what's required, what's accepted, and how to format your submission.",
  ogDescription: SOCIAL_DESCRIPTION,
  keywords: [
    "freehosts submission rules",
    "how to submit a host",
    "hosting directory submission guidelines",
    "free hosting listing requirements",
  ],
  imageAlt: "FreeHosts - Submission Rules",
  twitterImageAlt: "FreeHosts - Submission Rules",
});

export default function SubmissionRulesPage() {
  return (
    <ProsePage
      path="/submission-rules"
      crumb="Submission Rules"
      name={TITLE}
      description="Official rules and guidelines for submitting a hosting service to the FreeHosts directory."
      mainClassName="wrap"
    >
      <SubmissionRulesContent />
    </ProsePage>
  );
}
