"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const labelMap: Record<string, string> = {
  hosts: "Hosts",
  compare: "Compare",
  staff: "Staff",
  faq: "FAQ",
  about: "About",
  saved: "Saved Hosts",
  "submit-host": "Submit a Host",
  "submit-layout": "Submit Layout",
  "submission-rules": "Submission Rules",
  "server-rules": "Server Rules",
  "other-free-hosts": "Other Free Hosts",
  tos: "Terms of Service",
  "privacy-policy": "Privacy Policy",
  cookies: "Cookie Policy",
};

export default function PageBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" className="flex items-center gap-1">
              <Home className="size-3.5" />
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {segments.map((segment, i) => {
          const href = "/" + segments.slice(0, i + 1).join("/");
          const label = labelMap[segment] ?? segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          const isLast = i === segments.length - 1;
          const isSlug = !labelMap[segment] && segments[0] === "hosts" && i === 1;

          return (
            <BreadcrumbItem key={href}>
              {isLast ? (
                <BreadcrumbPage>
                  {isSlug ? segment.replace(/-/g, " ") : label}
                </BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
