// Only the parser surface used by the lazy chat renderer is declared here.
declare module "markdown-it" {
  type Token = { content: string; attrSet(name: string, value: string): void };
  type Options = { html: boolean; breaks: boolean; linkify: boolean };
  type Renderer = { renderToken(tokens: Token[], index: number, options: Options): string };
  export default class MarkdownIt {
    constructor(options: Options);
    validateLink: (url: string) => boolean;
    utils: { escapeHtml(text: string): string };
    renderer: Renderer & { rules: Record<string, (tokens: Token[], index: number, options: Options, env: unknown, renderer: Renderer) => string> };
    render(text: string): string;
  }
}
