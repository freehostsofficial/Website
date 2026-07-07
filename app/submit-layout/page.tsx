import type { Metadata } from "next";
import SubmitLayoutClient from "./SubmitLayoutClient";

export const metadata: Metadata = {
  title: "Layout Builder - FreeHosts",
  description: "Build hosting layouts with our easy-to-use layout builder tool.",
  robots: "index, follow",
  alternates: {
    canonical: process.env.APP_URL + "/submit-layout",
  },
  openGraph: {
    siteName: "FreeHosts",
    type: "website",
    url: process.env.APP_URL + "/submit-layout",
    title: "Layout Builder - FreeHosts",
    description: "Build hosting layouts with our easy-to-use layout builder tool.",
    images: [
      {
        url: process.env.APP_URL + "/Src/Images/banner.png",
        width: 1280,
        height: 720,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Layout Builder - FreeHosts",
    description: "Build hosting layouts with our easy-to-use layout builder tool.",
    images: [process.env.APP_URL + "/Src/Images/banner.png"],
  },
};

export default function SubmitLayoutPage() {
  return <SubmitLayoutClient />;
}
