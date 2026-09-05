import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FreeHosts - Free Hosting Directory",
    short_name: "FreeHosts",
    description:
      "Discover the best reliable free hosting for websites, discord bots, apps, and databases.",
    start_url: "/",
    scope: "/",
    id: "/",
    display: "standalone",
    background_color: "#071028",
    theme_color: "#071028",
    categories: ["business", "utilities", "developer"],
    screenshots: [
      { src: "/Src/Images/banner.png", sizes: "1280x720", type: "image/png" },
    ],
    icons: [
      { src: "/Src/icons/icon.png", sizes: "192x192", type: "image/png" },
      { src: "/Src/icons/icon.png", sizes: "512x512", type: "image/png" },
      {
        src: "/Src/icons/icon-transparent.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}