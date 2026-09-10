import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://zitechai.com",
      changeFrequency: "monthly",
    },
    {
      url: "https://zitechai.com/voice-agent",
      changeFrequency: "monthly",
    },
    {
      url: "https://zitechai.com/chat",
      changeFrequency: "monthly",
    },
  ];
}
