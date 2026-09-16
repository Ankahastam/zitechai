import Image from "next/image";
import Link from "next/link";
import { StaticTinaMarkdown, type Components, type TinaMarkdownContent } from "tinacms/dist/rich-text/static";
import type { BlogHeading } from "@/lib/blog";
import styles from "./blog.module.css";

function safeHref(url: string) {
  return /^(https?:\/\/|mailto:|\/|#)/.test(url) ? url : "#";
}

export function BlogContent({ content, headings }: { content: TinaMarkdownContent; headings: BlogHeading[] }) {
  let headingIndex = 0;
  const nextHeadingId = () => headings[headingIndex++]?.id;

  const components: Components<object> = {
    h2: (props) => <h2 id={nextHeadingId()}>{props?.children}</h2>,
    h3: (props) => <h3 id={nextHeadingId()}>{props?.children}</h3>,
    a: (props) => {
      const href = safeHref(props?.url ?? "#");
      return href.startsWith("/") || href.startsWith("#")
        ? <Link href={href}>{props?.children}</Link>
        : <a href={href} rel="noopener noreferrer" target="_blank">{props?.children}</a>;
    },
    img: (props) => (
      <figure>
        <Image alt={props?.alt || props?.caption || ""} height={675} src={props?.url ?? ""} unoptimized width={1200} />
        {props?.caption ? <figcaption>{props.caption}</figcaption> : null}
      </figure>
    ),
  };

  return <div className={styles.prose}><StaticTinaMarkdown components={components} content={content} /></div>;
}
