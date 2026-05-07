import type { Metadata } from "next";
import SubmitLayoutClient from "./SubmitLayoutClient";

export const metadata: Metadata = {
  title: "Layout Builder - FreeHosts",
  description: "Build hosting layouts with our easy-to-use layout builder tool.",
  robots: "index, follow",
  alternates: {
    canonical: "https://freehosts.space/submit-layout",
  },
  openGraph: {
    siteName: "FreeHosts",
    type: "website",
    url: "https://freehosts.space/submit-layout",
    title: "Layout Builder - FreeHosts",
    description: "Build hosting layouts with our easy-to-use layout builder tool.",
    images: [
      {
        url: "https://freehosts.space/Src/Images/banner.png",
        width: 1280,
        height: 720,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Layout Builder - FreeHosts",
    description: "Build hosting layouts with our easy-to-use layout builder tool.",
    images: ["https://freehosts.space/Src/Images/banner.png"],
  },
};

export default function SubmitLayoutPage() {
  return <SubmitLayoutClient />;
}
