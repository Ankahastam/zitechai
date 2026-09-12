import { chatContent, homeContent, voiceAgentContent } from "@/content";

export type FaqItem = {
  number: string;
  question: string;
  answer: string;
};

const numbered = (items: readonly { answer: string; question: string }[]): readonly FaqItem[] =>
  items.map((item, index) => ({ ...item, number: String(index + 1).padStart(2, "0") }));

export const faqItems = numbered(homeContent.faq.items);
export const chatAgentFaqItems = numbered(chatContent.faq.items);
export const voiceAgentFaqItems = numbered(voiceAgentContent.faq.items);
