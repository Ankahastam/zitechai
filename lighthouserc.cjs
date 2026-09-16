module.exports = {
  ci: {
    assert: {
      assertions: {
        "categories:accessibility": ["warn", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:performance": ["warn", { minScore: 0.75 }],
        "categories:seo": ["error", { minScore: 0.95 }],
      },
    },
    collect: {
      numberOfRuns: 1,
      staticDistDir: "./out",
      url: [
        "http://localhost/",
        "http://localhost/about.html",
        "http://localhost/blog.html",
        "http://localhost/blog/ai-agent-vs-chatbot.html",
      ],
    },
    upload: {
      outputDir: "./.lighthouseci/reports",
      target: "filesystem",
    },
  },
};
