import Image from "next/image";
import Link from "next/link";
import { formatPersianDate, type BlogPost } from "@/lib/blog";
import styles from "./blog.module.css";

export function BlogCard({ featured = false, post }: { featured?: boolean; post: BlogPost }) {
  return (
    <article className={`${styles.card}${featured ? ` ${styles.featuredCard}` : ""}`}>
      <Link className={styles.cardLink} href={`/blog/${post.slug}`}>
        <span className={styles.cardImage}>
          <Image alt={post.title} fill sizes={featured ? "(min-width: 64rem) 50vw, 100vw" : "(min-width: 64rem) 33vw, 100vw"} src={post.coverImage} unoptimized />
        </span>
        <span className={styles.cardBody}>
          <span className={styles.cardCategory}>{post.category}</span>
          <strong className={styles.cardTitle}>{post.title}</strong>
          <span className={styles.cardExcerpt}>{post.excerpt}</span>
          <span className={styles.cardMeta}>
            <time dateTime={post.publishedDate}>{formatPersianDate(post.publishedDate)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime.toLocaleString("fa-IR")} دقیقه مطالعه</span>
          </span>
        </span>
      </Link>
    </article>
  );
}
