import StaffClient from "./StaffClient";
import { staffData } from "./data";
import { safeJsonLd } from "../../lib/safeJsonLd";
import { pageMeta, webPageJsonLd } from "../../lib/pageMeta";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_URL } from "../../lib/site";

const TITLE = "Meet the FreeHosts Team - Staff & Contributors";
const DESCRIPTION =
  "Meet the volunteers behind FreeHosts — owners, developers, moderators, and host publishers who keep this free hosting directory running.";

export const metadata = pageMeta({
  path: "/staff",
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "freehosts staff",
    "freehosts team",
    "freehosts contributors",
    "hosting directory team",
  ],
  imageAlt: "FreeHosts - Meet the Team",
  twitterImageAlt: "FreeHosts - Meet the Team",
});

export default function StaffPage() {
  const webPageSchema = webPageJsonLd(
    "/staff",
    TITLE,
    "Meet the volunteers behind FreeHosts — owners, developers, moderators, and host publishers.",
  );

  const teamSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "FreeHosts Team Members",
    description: "The staff and contributors who run the FreeHosts community directory.",
    url: SITE_URL + "/staff",
    numberOfItems: Object.keys(staffData).length,
    itemListElement: Object.entries(staffData).map(([, member], index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        name: member.name ?? "FreeHosts Team Member",
        jobTitle: member.roles[0],
        worksFor: {
          "@id": SITE_URL + "/#organization",
        },
        ...(member.links?.github
          ? { url: member.links.github }
          : {}),
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
        dangerouslySetInnerHTML={{ __html: safeJsonLd(teamSchema) }}
      />
      <Breadcrumbs siteUrl={SITE_URL} items={[{ name: "Staff", path: "/staff" }]} />
      <StaffClient />
    </>
  );
}
