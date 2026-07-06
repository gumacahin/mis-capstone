/* eslint-env node */
/* global module */

const allowedImperativeVerbs = [
  "Add",
  "Fix",
  "Refactor",
  "Update",
  "Remove",
  "Improve",
  "Document",
  "Test",
  "Build",
  "Chore",
  "Bump",
  "Migrate",
  "Align",
  "Split",
  "Hide",
  "Bound",
  "Record",
  "Review",
];

const imperativeVerbPattern = new RegExp(
  `^(${allowedImperativeVerbs.join("|")})\\b`,
);

module.exports = {
  rules: {
    "header-max-length": [2, "always", 72],
    "header-no-trailing-period": [2, "always"],
    "header-imperative-verb": [2, "always"],
  },
  plugins: [
    {
      rules: {
        "header-no-trailing-period": (parsed) => {
          const header = parsed.header?.trim() ?? "";
          const isValid = header.length > 0 && !header.endsWith(".");
          return [isValid, "Commit subject must not end with a period"];
        },
        "header-imperative-verb": (parsed) => {
          const header = parsed.header?.trim() ?? "";
          const isMergeCommit = header.startsWith("Merge ");
          if (isMergeCommit) {
            return [true];
          }

          const isValid = imperativeVerbPattern.test(header);
          return [
            isValid,
            `Commit subject must start with an imperative verb (${allowedImperativeVerbs.join(", ")})`,
          ];
        },
      },
    },
  ],
};
