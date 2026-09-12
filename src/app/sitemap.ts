import type { MetadataRoute } from "next";
import { siteContent } from "@/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteContent.seo.siteUrl,
      changeFrequency: "monthly",
    },
    {
      url: `${siteContent.seo.siteUrl}/voice-agent`,
      changeFrequency: "monthly",
    },
    {
      url: `${siteContent.seo.siteUrl}/chat`,
      changeFrequency: "monthly",
    },
  ];
}
