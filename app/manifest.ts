import type { MetadataRoute } from "next";
import { card } from "@/app/_config/card";
import { colors } from "@/app/_theme/tokens";

export default function manifest(): MetadataRoute.Manifest {
  const { site, icons } = card;
  return {
    id: "/",
    name: site.appName,
    short_name: site.shortName,
    description: site.manifestDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: colors.canvas,
    theme_color: colors.canvas,
    icons: [
      { src: icons.android192, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: icons.android512, sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
