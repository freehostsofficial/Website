import SubmitLayoutClient from "./SubmitLayoutClient";
import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMeta } from "../../lib/pageMeta";
import { SITE_URL } from "../../lib/site";

const DESCRIPTION = "Build hosting layouts with our easy-to-use layout builder tool.";

export const metadata = pageMeta({
  path: "/submit-layout",
  title: "Layout Builder - FreeHosts",
  description: DESCRIPTION,
  imageAlt: "FreeHosts - Layout Builder",
});

export default function SubmitLayoutPage() {
  return (
    <>
      <Breadcrumbs siteUrl={SITE_URL} items={[{ name: "Submit Layout", path: "/submit-layout" }]} />
      <SubmitLayoutClient />
    </>
  );
}
