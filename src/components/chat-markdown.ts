import MarkdownIt from "markdown-it";

// Raw HTML and remote images never enter the conversation surface.
const markdown = new MarkdownIt({ html: false, breaks: true, linkify: false });
markdown.validateLink = (url: string) => /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(url);
markdown.renderer.rules.image = (tokens, index) => markdown.utils.escapeHtml(tokens[index].content);
markdown.renderer.rules.link_open = (tokens, index, options, _env, renderer) => {
  tokens[index].attrSet("target", "_blank");
  tokens[index].attrSet("rel", "noopener noreferrer");
  return renderer.renderToken(tokens, index, options);
};

export function renderChatMarkdown(text: string) {
  return markdown.render(text);
}
