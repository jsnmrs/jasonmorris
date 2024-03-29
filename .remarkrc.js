exports.plugins = [
  "@double-great/remark-lint-alt-text",
  ["remark-frontmatter", ["yaml"]],
  [
    "remark-frontmatter-validator",
    [
      2,
      {
        category: {
          oneOf: ["code", "bikes", "photo", "diy"],
          type: "string",
        },
        date: {
          required: true,
          type: "object",
        },
        layout: {
          match: "post",
          required: true,
          type: "string",
        },
        permalink: {
          required: true,
          type: "string",
        },
        tags: {
          oneOf: ["post", "code", "bikes", "photo", "diy"],
          required: true,
          type: "object",
        },
        title: {
          required: true,
          type: "string",
        },
        offline: {
          type: "boolean",
        },
      },
    ],
  ],
];
