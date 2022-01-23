module.exports = {
  presets: ["next/babel"],
  plugins: [
    ["styled-components", { ssr: true }],
    [
      "prismjs",
      {
        languages: [
          "javascript",
          "css",
          "markup",
          "graphql",
          "markdown",
          "html",
          "json",
          "sass",
          "typescript",
        ],
        plugins: ["highlight-keywords"],
        theme: "tomorrow",
        css: true,
      },
    ],
  ],
};
