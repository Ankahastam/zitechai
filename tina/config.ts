import { defineConfig, type TinaField } from "tinacms";

const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.CF_PAGES_BRANCH ||
  process.env.HEAD ||
  "main";

const text = (name: string, label: string): TinaField => ({
  label,
  name,
  type: "string",
});

const textarea = (name: string, label: string): TinaField => ({
  label,
  name,
  type: "string",
  ui: { component: "textarea" },
});

const hidden = (name: string): TinaField => ({
  name,
  type: "string",
  ui: { component: "hidden" },
});

const strings = (name: string, label: string): TinaField => ({
  label,
  list: true,
  name,
  type: "string",
});

const object = (name: string, label: string, fields: TinaField[], list = false): TinaField => ({
  fields,
  label,
  list,
  name,
  type: "object",
});

const seoFields = (): TinaField[] => [
  text("title", "عنوان SEO"),
  textarea("description", "توضیحات SEO"),
  text("canonical", "آدرس canonical"),
];

const faqFields = (structuredDataToggle = false): TinaField[] => [
  text("title", "عنوان بخش"),
  object(
    "items",
    "پرسش‌ها",
    [
      textarea("question", "پرسش"),
      textarea("answer", "پاسخ"),
      ...(structuredDataToggle
        ? [{ label: "نمایش در Structured Data", name: "includeInStructuredData", type: "boolean" } as TinaField]
        : []),
    ],
    true,
  ),
];

const sectionHeadFields = (): TinaField[] => [
  text("kicker", "عنوان انگلیسی کوچک"),
  text("title", "عنوان بخش"),
  textarea("lede", "توضیح بخش"),
];

const itemWithPoints = (): TinaField[] => [
  hidden("id"),
  text("latin", "عنوان انگلیسی"),
  text("title", "عنوان"),
  strings("points", "موارد"),
];

const singleDocumentUi = {
  allowedActions: { create: false, createNestedFolder: false, delete: false },
  global: true,
};

const blogCategories = [
  { label: "هوش مصنوعی", value: "هوش مصنوعی" },
  { label: "ایجنت‌های هوشمند", value: "ایجنت‌های هوشمند" },
  { label: "اتوماسیون", value: "اتوماسیون" },
  { label: "داده و تحلیل", value: "داده و تحلیل" },
  { label: "مهندسی نرم‌افزار", value: "مهندسی نرم‌افزار" },
];

export default defineConfig({
  branch,
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  schema: {
    collections: [
      {
        fields: [
          object("seo", "تنظیمات عمومی SEO", [
            text("siteUrl", "آدرس سایت"),
            text("siteName", "نام سایت"),
            text("titleDefault", "عنوان پیش‌فرض"),
            text("titleTemplate", "الگوی عنوان"),
            textarea("description", "توضیحات پیش‌فرض"),
            text("locale", "Locale"),
            object("ogImage", "تصویر Open Graph", [
              text("url", "مسیر تصویر"),
              text("alt", "متن جایگزین"),
              { label: "عرض", name: "width", type: "number" },
              { label: "ارتفاع", name: "height", type: "number" },
            ]),
          ]),
          object("navigation", "منوی اصلی", [
            text("mobileTitle", "عنوان منوی موبایل"),
            text("cta", "متن CTA منو"),
            object("primary", "آیتم‌های منو", [
              text("label", "عنوان"),
              text("href", "لینک"),
              object("children", "زیرمنو", [text("href", "لینک"), text("label", "عنوان")], true),
            ], true),
          ]),
          object("footer", "فوتر", [
            text("headline", "عنوان"),
            textarea("lede", "توضیح"),
            text("cta", "CTA اصلی"),
            text("secondaryCta", "CTA دوم"),
            text("secondaryHref", "لینک CTA دوم"),
            text("phoneFormTitle", "عنوان فرم شماره"),
            textarea("phoneFormDescription", "توضیح فرم شماره"),
            text("phoneFormLabel", "برچسب شماره"),
            text("phoneFormPlaceholder", "نمونه شماره"),
            text("phoneFormSubmit", "دکمه ارسال شماره"),
            text("phoneFormPending", "متن در حال ارسال"),
            text("phoneFormSuccess", "پیام موفقیت"),
            text("phoneFormError", "پیام خطا"),
            text("phoneFormUnconfigured", "پیام پیکربندی‌نشده"),
            text("addressLabel", "برچسب نشانی"),
            textarea("address", "نشانی"),
            text("phoneLabel", "برچسب تماس"),
            text("phone", "شماره تماس"),
            text("phoneHref", "لینک تماس"),
            text("socialLabel", "برچسب شبکه اجتماعی"),
            text("instagram", "اینستاگرام"),
            text("instagramHref", "لینک اینستاگرام"),
            text("messengerLabel", "برچسب پیام‌رسان"),
            text("whatsappHref", "لینک واتس‌اپ"),
            text("telegramHref", "لینک تلگرام"),
            object("links", "لینک‌ها", [text("href", "لینک"), text("label", "عنوان")], true),
            text("copyrightLatin", "کپی‌رایت انگلیسی"),
            text("copyrightPersian", "کپی‌رایت فارسی"),
          ]),
          object("contactDialog", "فرم شروع همکاری", [
            text("closeLabel", "برچسب بستن"),
            text("successTitle", "عنوان موفقیت"),
            textarea("successBody", "متن موفقیت"),
            text("successButton", "دکمه موفقیت"),
            text("kicker", "عنوان انگلیسی"),
            text("title", "عنوان فرم"),
            textarea("description", "توضیح فرم"),
            text("nameLabel", "برچسب نام"),
            text("mobileLabel", "برچسب موبایل"),
            text("jobLabel", "برچسب شغل"),
            text("submitLabel", "متن دکمه ارسال"),
            text("pendingLabel", "متن در حال ارسال"),
            textarea("unconfiguredMessage", "پیام پیکربندی‌نشده"),
          ]),
        ],
        format: "json",
        label: "تنظیمات سراسری",
        match: { include: "site" },
        name: "site",
        path: "content",
        ui: singleDocumentUi,
      },
      {
        fields: [
          { label: "عنوان", name: "title", type: "string", required: true, isTitle: true },
          { description: "شناسهٔ کوتاه و یکتای URL؛ ترجیحاً انگلیسی و خط‌تیره‌دار", label: "Slug", name: "slug", type: "string", required: true },
          { label: "خلاصه", name: "excerpt", type: "string", required: true, ui: { component: "textarea" } },
          { description: "برای خروجی سریع، WebP یا AVIF با نسبت ۱۶:۱۰ بارگذاری کنید.", label: "تصویر شاخص", name: "coverImage", type: "image", required: true },
          { label: "دسته‌بندی", name: "category", options: blogCategories, type: "string", required: true },
          { label: "نویسنده", name: "author", type: "string", required: true },
          { label: "تاریخ انتشار", name: "publishedDate", type: "datetime", required: true },
          { label: "تاریخ آخرین ویرایش", name: "updatedDate", type: "datetime" },
          { label: "زمان مطالعه (دقیقه)", name: "readingTime", type: "number", required: true },
          { label: "برچسب‌ها", list: true, name: "tags", type: "string", required: true },
          { label: "عنوان SEO", name: "seoTitle", type: "string", required: true },
          { label: "توضیحات SEO", name: "seoDescription", type: "string", required: true, ui: { component: "textarea" } },
          { description: "اختیاری؛ در صورت خالی‌بودن، URL مقاله استفاده می‌شود", label: "Canonical URL", name: "canonicalUrl", type: "string" },
          object("cta", "دعوت به اقدام", [text("label", "متن CTA"), text("href", "لینک صفحهٔ مرتبط")]),
          {
            label: "محتوای مقاله",
            name: "content",
            type: "rich-text",
            required: true,
            overrides: { headingLevels: ["h2", "h3", "h4"] },
          },
        ],
        format: "json",
        label: "Blog / مقالات",
        name: "blog",
        path: "content/blog",
        ui: {
          allowedActions: { create: true, delete: true },
          filename: {
            description: "همان slug مقاله را وارد کنید.",
            showFirst: true,
            slugify: (values) => String(values.slug || values.title || "article")
              .trim()
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9\u0600-\u06ff-]/g, ""),
          },
          router: ({ document }) => `/blog/${document._sys.filename}`,
        },
      },
      {
        fields: [
          object("seo", "SEO صفحه", seoFields()),
          object("hero", "هرو", [text("title", "عنوان"), textarea("lede", "توضیح"), text("cta", "CTA")]),
          object("approach", "رویکرد", [
            text("ariaLabel", "عنوان دسترس‌پذیری"),
            object("steps", "مراحل", [
              hidden("id"), text("latin", "عنوان انگلیسی"), text("persian", "عنوان فارسی"),
              text("statement", "تیتر"), textarea("body", "توضیح"),
            ], true),
            object("diagram", "متن نمودار", [
              strings("sourceLabels", "منابع"), text("coreLabel", "لایه مرکزی"), text("loopLabel", "چرخه"),
            ]),
          ]),
          object("capabilities", "خدمات", [
            text("kickerPersian", "عنوان کوچک فارسی"), text("kickerLatin", "عنوان کوچک انگلیسی"),
            text("titleBeforeBreak", "عنوان، سطر اول"), text("titleAfterBreak", "عنوان، سطر دوم"),
            text("lede", "مقدمه"), text("ledeEmphasis", "مقدمه برجسته"), textarea("sub", "توضیح"),
            text("selectorLabel", "عنوان انتخاب‌گر"),
            object("items", "خدمات", [
              hidden("id"), text("short", "عنوان کوتاه"), text("label", "عنوان"), text("latin", "عنوان انگلیسی"),
              text("headline", "تیتر"), textarea("body", "توضیح"), strings("features", "ویژگی‌ها"), textarea("more", "توضیح بیشتر"),
            ], true),
            text("moreLabel", "متن مشاهده بیشتر"), text("connectionTitle", "عنوان اتصال"),
            textarea("connectionBody", "متن اتصال"), text("connectionEmphasis", "متن برجسته اتصال"),
          ]),
          object("capabilityPreviews", "متن پیش‌نمایش خدمات", [
            text("caption", "عنوان پیش‌نمایش"), text("captionNote", "یادداشت پیش‌نمایش"),
            object("voice", "ایجنت صوتی", [
              text("top", "عنوان بالا"), text("headline", "تیتر"), text("sub", "زیرتیتر"), text("open", "باز کردن"),
              text("close", "بستن"), strings("steps", "مراحل"), text("result", "نتیجه"),
            ]),
            object("sales", "مدیر فروش", [
              text("toolbar", "نوار ابزار"), text("pill", "برچسب"), text("recording", "ضبط"), textarea("quote", "نقل‌قول"),
              text("cite", "منبع نقل‌قول"), text("open", "باز کردن"), text("close", "بستن"), text("concernLabel", "عنوان دغدغه"),
              text("concern", "دغدغه"), text("nextLabel", "عنوان اقدام"), text("next", "اقدام"), text("result", "نتیجه"),
            ]),
            object("chat", "ایجنت پیام‌رسان", [
              strings("channels", "کانال‌ها"), text("toolbar", "نوار ابزار"), textarea("customer", "پیام مشتری"),
              textarea("agent", "پاسخ ایجنت"), text("open", "باز کردن"), text("close", "بستن"), text("team", "تیم"),
              text("topic", "موضوع"), text("history", "تاریخچه"),
            ]),
            object("systems", "زیرساخت", [
              text("request", "درخواست"), text("core", "مرکز"), text("coreNote", "توضیح مرکز"), strings("nodes", "سیستم‌ها"),
              text("open", "باز کردن"), text("close", "بستن"), strings("steps", "مراحل"),
            ]),
          ]),
          object("faq", "پرسش‌های متداول", faqFields()),
        ],
        format: "json",
        label: "صفحه اصلی",
        match: { include: "home" },
        name: "home",
        path: "content",
        ui: singleDocumentUi,
      },
      {
        fields: [
          object("seo", "SEO صفحه", seoFields()),
          object("hero", "هرو", [
            text("badge", "برچسب"), text("title", "عنوان"), textarea("lede", "توضیح"),
            text("primaryCta", "CTA اصلی"), text("secondaryCta", "CTA دوم"), strings("trust", "نکات اعتماد"),
          ]),
          object("channels", "کانال‌ها", [
            ...sectionHeadFields(),
            object("items", "کانال‌ها", [hidden("id"), textarea("body", "توضیح"), text("latin", "عنوان انگلیسی"), text("tag", "برچسب"), text("title", "عنوان")], true),
          ]),
          object("features", "ویژگی‌های پنل", [...sectionHeadFields(), object("items", "ویژگی‌ها", itemWithPoints(), true)]),
          object("pricing", "قیمت‌گذاری", [
            ...sectionHeadFields(),
            object("plans", "پلن‌ها", [text("title", "عنوان"), text("amount", "مبلغ"), text("kind", "نوع پرداخت"), strings("items", "موارد")], true),
            textarea("note", "یادداشت"), text("cta", "CTA"),
          ]),
          object("leadForm", "فرم درخواست", [
            ...sectionHeadFields(), text("nameLabel", "برچسب نام"), text("businessLabel", "برچسب کسب‌وکار"),
            text("mobileLabel", "برچسب موبایل"), text("channelsLabel", "برچسب کانال‌ها"), strings("channels", "کانال‌ها"),
            text("noteLabel", "برچسب توضیح"), text("notePlaceholder", "نمونه توضیح"), text("submitLabel", "دکمه ارسال"),
            text("pendingLabel", "در حال ارسال"), textarea("unconfiguredMessage", "پیام پیکربندی‌نشده"),
            text("successTitle", "عنوان موفقیت"), textarea("successBody", "متن موفقیت"),
          ]),
          object("faq", "پرسش‌های متداول", faqFields(true)),
          object("finalCta", "CTA پایانی", [text("title", "عنوان"), textarea("lede", "توضیح"), text("cta", "CTA")]),
        ],
        format: "json",
        label: "صفحه چت‌ایجنت",
        match: { include: "chat" },
        name: "chat",
        path: "content",
        ui: singleDocumentUi,
      },
      {
        fields: [
          object("seo", "SEO صفحه", seoFields()),
          object("hero", "هرو", [
            text("eyebrow", "عنوان کوچک"), text("title", "عنوان"), text("promise", "وعده"), text("signalStatus", "وضعیت سیگنال"),
            textarea("lede", "توضیح"), text("cta", "CTA"),
            object("features", "ویژگی‌های کلیدی", [text("title", "عنوان"), text("note", "یادداشت")], true),
            text("demoTag", "عنوان دمو"), text("videoUrl", "آدرس ویدئو"), text("videoTitle", "عنوان ویدئو"),
          ]),
          object("pairs", "چالش‌ها و راه‌حل", [
            ...sectionHeadFields(), text("problemLabel", "عنوان مشکل"), text("solutionLabel", "عنوان راه‌حل"),
            object("items", "موارد", [textarea("problem", "مشکل"), textarea("solution", "راه‌حل")], true),
          ]),
          object("features", "ویژگی‌ها", [
            ...sectionHeadFields(), object("items", "ویژگی‌ها", itemWithPoints(), true),
            text("liveTitle", "عنوان پایش زنده"), textarea("liveBody", "توضیح پایش زنده"),
          ]),
          object("industries", "صنایع", [
            ...sectionHeadFields(), text("solvesLabel", "عنوان مسئله حل‌شده"),
            object("items", "صنایع", [
              hidden("id"), textarea("body", "توضیح"), { label: "تصویر", name: "image", type: "image" },
              text("solves", "مسئله حل‌شده"), strings("tags", "برچسب‌ها"), text("title", "عنوان"),
            ], true),
          ]),
          object("useCases", "سناریوها", [
            ...sectionHeadFields(),
            object("items", "سناریوها", [hidden("id"), textarea("body", "توضیح"), text("latin", "عنوان انگلیسی"), strings("process", "مراحل"), text("title", "عنوان")], true),
          ]),
          object("pricing", "قیمت‌گذاری", [
            ...sectionHeadFields(), text("licenseTitle", "عنوان لایسنس"), text("amount", "مبلغ"), text("amountNote", "یادداشت مبلغ"),
            strings("includes", "موارد شامل"), text("apiTitle", "عنوان هزینه API"), text("apiTitleLatin", "عنوان انگلیسی هزینه API"),
            object("apiPoints", "توضیحات هزینه API", [text("label", "عنوان"), textarea("text", "متن"), textarea("emphasis", "متن برجسته")], true),
          ]),
          object("integrations", "یکپارچه‌سازی", [
            ...sectionHeadFields(),
            object("actions", "اتصال‌ها", [hidden("id"), text("system", "نام سیستم"), textarea("text", "توضیح")], true),
            text("mapLabel", "عنوان دسترس‌پذیری نقشه"), text("coreTitle", "عنوان مرکز"), text("coreLatin", "عنوان انگلیسی مرکز"),
            textarea("ctaBody", "توضیح CTA"), text("cta", "CTA"),
          ]),
          object("faq", "پرسش‌های متداول", faqFields()),
          object("finalCta", "CTA پایانی", [text("title", "عنوان"), textarea("lede", "توضیح"), text("cta", "CTA")]),
        ],
        format: "json",
        label: "صفحه ویس‌ایجنت",
        match: { include: "voice-agent" },
        name: "voiceAgent",
        path: "content",
        ui: singleDocumentUi,
      },
    ],
  },
});
