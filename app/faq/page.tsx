import FaqClient from "./FaqClient";
import { getFaqItems } from "./data";
import Breadcrumbs from "@/components/Breadcrumbs";
import { safeJsonLd } from "../../lib/safeJsonLd";
import { pageMeta, webPageJsonLd } from "../../lib/pageMeta";
import { SITE_URL, EMAIL_DOMAIN_SAFE } from "../../lib/site";

const DESCRIPTION =
  "Get answers to the most common questions about FreeHosts and free hosting services. Learn how to find, compare, and submit hosting providers.";
const SOCIAL_DESCRIPTION =
  "Get answers to the most common questions about FreeHosts and free hosting services.";

export const metadata = pageMeta({
  path: "/faq",
  title: "Free Hosting FAQ - Questions Answered",
  description: DESCRIPTION,
  ogTitle: "Free Hosting FAQ - FreeHosts",
  ogDescription: SOCIAL_DESCRIPTION,
  keywords: [
    "freehosts faq",
    "free hosting questions",
    "hosting directory help",
    "freehosts help",
    "free hosting guide",
  ],
  imageAlt: "FreeHosts FAQ - Common Questions About FreeHosts",
  twitterImageAlt: "FreeHosts FAQ - Common Questions About FreeHosts",
});

const webPageSchema = webPageJsonLd(
  "/faq",
  "FAQ - Frequently Asked Questions About FreeHosts & Free Hosting",
  DESCRIPTION,
);

export default function FaqPage() {
  const faqItems = getFaqItems(EMAIL_DOMAIN_SAFE);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
      />
      <Breadcrumbs siteUrl={SITE_URL} items={[{ name: "FAQ", path: "/faq" }]} />
      <FaqClient emailDomain={EMAIL_DOMAIN_SAFE} />
    </>
  );
}
