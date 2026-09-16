import "server-only";

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { TinaMarkdownContent } from "tinacms/dist/rich-text/static";

export type BlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
  publishedDate: string;
  updatedDate?: string;
  readingTime: number;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  canonicalUrl?: string;
  cta?: { label?: string; href?: string };
  content: TinaMarkdownContent;
};

export type BlogHeading = { id: string; level: 2 | 3; text: string };

const blogDirectory = path.join(process.cwd(), "content", "blog");

export function getAllPosts(): BlogPost[] {
  if (!existsSync(blogDirectory)) return [];

  return readdirSync(blogDirectory)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(readFileSync(path.join(blogDirectory, file), "utf8")) as BlogPost)
    .sort((a, b) => Date.parse(b.publishedDate) - Date.parse(a.publishedDate));
}

export function getPostBySlug(slug: string) {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getRelatedPosts(post: BlogPost, limit = 3) {
  return getAllPosts()
    .filter((candidate) => candidate.slug !== post.slug && (
      candidate.category === post.category || candidate.tags.some((tag) => post.tags.includes(tag))
    ))
    .slice(0, limit);
}

export function formatPersianDate(date: string) {
  return new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date));
}

export function getPostHeadings(content: TinaMarkdownContent): BlogHeading[] {
  const headings: BlogHeading[] = [];
  const counts = new Map<string, number>();

  function text(node: TinaMarkdownContent): string {
    if (typeof node.text === "string") return node.text;
    return node.children?.map(text).join("") ?? "";
  }

  function visit(node: TinaMarkdownContent) {
    if (node.type === "h2" || node.type === "h3") {
      const headingText = text(node).trim();
      const base = headingText
        .toLowerCase()
        .replace(/[^؀-ۿA-Za-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-") || "section";
      const count = counts.get(base) ?? 0;
      counts.set(base, count + 1);
      headings.push({ id: count ? `${base}-${count + 1}` : base, level: node.type === "h2" ? 2 : 3, text: headingText });
    }
    node.children?.forEach(visit);
  }

  content.children?.forEach(visit);
  return headings;
}
