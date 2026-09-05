import ProsePage from "@/components/ProsePage";
import TosContent from "./TosContent";
import { pageMeta } from "../../lib/pageMeta";

const TITLE = "Terms of Service - FreeHosts";
const DESCRIPTION =
  "Read the FreeHosts Terms of Service. Understand your rights and responsibilities when using our free hosting directory and community.";
const SOCIAL_DESCRIPTION =
  "Read the FreeHosts Terms of Service. Understand your rights and responsibilities when using our free hosting directory.";

export const metadata = pageMeta({
  path: "/tos",
  title: TITLE,
  description: DESCRIPTION,
  ogDescription: SOCIAL_DESCRIPTION,
  keywords: ["freehosts terms of service", "freehosts tos", "hosting directory terms"],
  imageAlt: "FreeHosts - Terms of Service",
  twitterImageAlt: "FreeHosts - Terms of Service",
});

export default function TermsOfServicePage() {
  return (
    <ProsePage path="/tos" crumb="Terms of Service" name={TITLE} description={SOCIAL_DESCRIPTION}>
      <TosContent />
    </ProsePage>
  );
}
