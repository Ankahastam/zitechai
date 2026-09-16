import { siteContent } from "@/content";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

export function GET() {
  const siteUrl = siteContent.seo.siteUrl;
  const posts = getAllPosts()
    .map((post) => `- [${post.title}](${siteUrl}/blog/${post.slug}): ${post.excerpt}`)
    .join("\n");
  const body = `# زی‌تک (Zitech AI)

> ${siteContent.seo.description}. زی‌تک سیستم‌های هوش مصنوعی متناسب با فرایند واقعی کسب‌وکار طراحی، پیاده‌سازی و به ابزارهای موجود متصل می‌کند.

زبان اصلی وب‌سایت فارسی است. محتوای عمومی و تأییدشده سایت در لینک‌های زیر قرار دارد.

## صفحات اصلی

- [صفحه اصلی](${siteUrl}/): معرفی رویکرد زی‌تک و حوزه‌های کاری
- [درباره زی‌تک](${siteUrl}/about): معرفی شرکت، رویکرد و فرایند همکاری
- [ویس ایجنت](${siteUrl}/voice-agent): راهکار منشی و ایجنت تلفنی هوشمند
- [چت ایجنت](${siteUrl}/chat): راهکار چت ایجنت اختصاصی
- [مقالات](${siteUrl}/blog): مقاله‌های تخصصی درباره کاربرد عملی هوش مصنوعی

## مقالات

${posts || "هنوز مقاله‌ای منتشر نشده است."}

## فیدها

- [RSS](${siteUrl}/rss.xml)
- [Sitemap](${siteUrl}/sitemap.xml)
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
