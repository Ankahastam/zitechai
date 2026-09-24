import type { MetadataRoute } from "next";
import { siteContent } from "@/content";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
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
    {
      url: `${siteContent.seo.siteUrl}/marketing-automation`,
      changeFrequency: "monthly",
    },
    {
      url: `${siteContent.seo.siteUrl}/about`,
      changeFrequency: "monthly",
    },
    {
      url: `${siteContent.seo.siteUrl}/blog`,
      changeFrequency: "weekly",
    },
  ];

  return pages.concat(getAllPosts().map((post) => ({
    url: `${siteContent.seo.siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedDate || post.publishedDate,
    changeFrequency: "monthly" as const,
    images: [new URL(post.coverImage, siteContent.seo.siteUrl).toString()],
  })));
}
