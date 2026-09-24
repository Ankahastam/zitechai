import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { siteContent } from "@/content";
import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "./blog-card";
import styles from "./blog.module.css";

const title = "مقالات و دیدگاه‌های زی‌تک";
const description = "مقالات زی‌تک درباره کاربرد واقعی هوش مصنوعی، ایجنت‌های هوشمند، اتوماسیون و مهندسی سیستم‌های متصل.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/rss.xml" },
  },
  openGraph: {
    description,
    images: [siteContent.seo.ogImage],
    locale: siteContent.seo.locale,
    siteName: siteContent.seo.siteName,
    title: `${title} | ${siteContent.seo.siteName}`,
    type: "website",
    url: "/blog",
  },
  twitter: { card: "summary", description, images: [siteContent.seo.ogImage.url], title },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", item: siteContent.seo.siteUrl, name: "زی‌تک", position: 1 },
    { "@type": "ListItem", item: `${siteContent.seo.siteUrl}/blog`, name: title, position: 2 },
  ],
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = [...new Set(posts.map((post) => post.category))];
  const [featured, ...rest] = posts;

  return (
    <main className={styles.blogPage}>
      <section aria-labelledby="blog-title" className={styles.hero}>
        <Container>
          <p className={styles.eyebrow}>BLOG / مقالات</p>
          <h1 className={styles.heroTitle} id="blog-title">مقالات و دیدگاه‌های زی‌تک</h1>
          <p className={styles.heroLede}>دربارهٔ کاربرد واقعی هوش مصنوعی، طراحی سیستم‌های متصل و اتوماسیون فرایندهای کسب‌وکار می‌نویسیم.</p>
        </Container>
      </section>

      <section aria-labelledby="blog-categories-title" className={styles.section}>
        <Container>
          <header className={styles.sectionHeader}>
            <h2 id="blog-categories-title">دسته‌بندی‌ها</h2>
          </header>
          {categories.length ? (
            <ul className={styles.categories}>{categories.map((category) => <li key={category}>{category}</li>)}</ul>
          ) : (
            <p className={styles.empty}>دسته‌بندی‌ها با انتشار اولین مقاله نمایش داده می‌شوند.</p>
          )}
        </Container>
      </section>

      <section aria-labelledby="latest-posts-title" className={styles.section}>
        <Container>
          <header className={styles.sectionHeader}>
            <h2 id="latest-posts-title">آخرین مقالات</h2>
            <a href="/rss.xml">RSS</a>
          </header>
          {featured ? (
            <div className={styles.postsGrid}>
              <BlogCard featured post={featured} />
              {rest.map((post) => <BlogCard key={post.slug} post={post} />)}
            </div>
          ) : (
            <p className={styles.empty}>اولین مقاله به‌زودی از طریق TinaCMS منتشر می‌شود.</p>
          )}
        </Container>
      </section>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} type="application/ld+json" />
    </main>
  );
}
