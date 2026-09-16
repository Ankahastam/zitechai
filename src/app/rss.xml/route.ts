import { siteContent } from "@/content";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

const escapeXml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

export function GET() {
  const posts = getAllPosts();
  const siteUrl = siteContent.seo.siteUrl;
  const items = posts.map((post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/blog/${encodeURIComponent(post.slug)}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${encodeURIComponent(post.slug)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <category>${escapeXml(post.category)}</category>
      <dc:creator>${escapeXml(post.author)}</dc:creator>
      <pubDate>${new Date(post.publishedDate).toUTCString()}</pubDate>
    </item>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>مقالات زی‌تک</title>
    <link>${siteUrl}/blog</link>
    <description>مقالات زی‌تک درباره کاربرد واقعی هوش مصنوعی و اتوماسیون کسب‌وکار</description>
    <language>fa-IR</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
