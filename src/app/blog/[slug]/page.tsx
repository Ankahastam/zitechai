import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogContent } from "../blog-content";
import { BlogCard } from "../blog-card";
import styles from "../blog.module.css";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteContent } from "@/content";
import { formatPersianDate, getAllPosts, getPostBySlug, getPostHeadings, getRelatedPosts } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

function absoluteUrl(value: string) {
  return new URL(value, siteContent.seo.siteUrl).toString();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "مقاله یافت نشد" };

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const canonical = post.canonicalUrl || `/blog/${post.slug}`;
  const image = absoluteUrl(post.coverImage);

  return {
    title,
    description,
    authors: [{ name: post.author }],
    keywords: post.tags,
    alternates: { canonical },
    openGraph: {
      authors: [post.author],
      description,
      images: [{ alt: post.title, url: image }],
      locale: siteContent.seo.locale,
      modifiedTime: post.updatedDate || post.publishedDate,
      publishedTime: post.publishedDate,
      section: post.category,
      siteName: siteContent.seo.siteName,
      tags: post.tags,
      title,
      type: "article",
      url: canonical,
    },
    twitter: { card: "summary_large_image", description, images: [image], title },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const headings = getPostHeadings(post.content);
  const relatedPosts = getRelatedPosts(post);
  const canonical = absoluteUrl(post.canonicalUrl || `/blog/${post.slug}`);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    author: { "@type": "Organization", name: post.author },
    dateModified: post.updatedDate || post.publishedDate,
    datePublished: post.publishedDate,
    description: post.seoDescription || post.excerpt,
    headline: post.seoTitle || post.title,
    image: [absoluteUrl(post.coverImage)],
    keywords: post.tags.join(", "),
    mainEntityOfPage: { "@id": canonical, "@type": "WebPage" },
    publisher: {
      "@id": `${siteContent.seo.siteUrl}/#organization`,
      "@type": "Organization",
      logo: { "@type": "ImageObject", url: absoluteUrl(siteContent.seo.ogImage.url) },
      name: siteContent.seo.siteName,
    },
    url: canonical,
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", item: siteContent.seo.siteUrl, name: "زی‌تک", position: 1 },
      { "@type": "ListItem", item: `${siteContent.seo.siteUrl}/blog`, name: "مقالات", position: 2 },
      { "@type": "ListItem", item: canonical, name: post.title, position: 3 },
    ],
  };

  return (
    <main className={styles.blogPage}>
      <article>
        <Container>
          <header className={styles.articleHeader}>
            <Link className={styles.backLink} href="/blog">بازگشت به مقالات ←</Link>
            <span className={styles.articleCategory}>{post.category}</span>
            <h1 className={styles.articleTitle}>{post.title}</h1>
            <p className={styles.articleExcerpt}>{post.excerpt}</p>
            <p className={styles.articleMeta}>
              <span>{post.author}</span><span aria-hidden="true">·</span>
              <time dateTime={post.publishedDate}>{formatPersianDate(post.publishedDate)}</time><span aria-hidden="true">·</span>
              <span>{post.readingTime.toLocaleString("fa-IR")} دقیقه مطالعه</span>
            </p>
          </header>
          <div className={styles.cover}>
            <Image alt={post.title} fill priority sizes="(min-width: 80rem) 75rem, 100vw" src={post.coverImage} unoptimized />
          </div>
          <div className={styles.articleLayout}>
            {headings.length ? (
              <nav aria-label="فهرست مطالب" className={styles.toc}>
                <strong>در این مقاله</strong>
                <ol>{headings.map((heading) => <li data-level={heading.level} key={heading.id}><a href={`#${heading.id}`}>{heading.text}</a></li>)}</ol>
              </nav>
            ) : <span aria-hidden="true" />}
            <div>
              <BlogContent content={post.content} headings={headings} />
              {post.cta?.label && post.cta.href ? (
                <aside className={styles.articleCta}>
                  <p>{post.cta.label}</p>
                  <ButtonLink href={post.cta.href}>گفت‌وگو با زی‌تک</ButtonLink>
                </aside>
              ) : null}
            </div>
          </div>
        </Container>
      </article>

      {relatedPosts.length ? (
        <section aria-labelledby="related-posts-title" className={styles.related}>
          <Container>
            <header className={styles.sectionHeader}><h2 id="related-posts-title">مقالات مرتبط</h2></header>
            <div className={styles.relatedGrid}>{relatedPosts.map((related) => <BlogCard key={related.slug} post={related} />)}</div>
          </Container>
        </section>
      ) : null}

      <script dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, breadcrumbJsonLd]).replace(/</g, "\\u003c") }} type="application/ld+json" />
    </main>
  );
}
