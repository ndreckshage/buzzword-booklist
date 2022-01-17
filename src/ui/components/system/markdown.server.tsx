import gql from "graphql-tag";
import { type MarkdownComponent } from "api/__generated__/resolvers-types";
import React from "react";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import cx from "classnames";

const allowedTags = sanitizeHtml.defaults.allowedTags.concat([
  "img",
  "h1",
  "h2",
  "h3",
]);
const allowedAttributes = Object.assign(
  {},
  sanitizeHtml.defaults.allowedAttributes,
  {
    img: ["alt", "src"],
  }
);

export default function Markdown({ text, backgroundColor }: MarkdownComponent) {
  return (
    <div
      className={cx("markdown-component py-10", {
        "bg-inherit": backgroundColor === "inherit",
        "bg-emerald-500": backgroundColor === "emerald-500",
        "bg-indigo-500": backgroundColor === "indigo-500",
        "text-white": backgroundColor === "indigo-500" || "emerald-500",
      })}
    >
      <div
        className="container mx-auto"
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(marked(text || ""), {
            allowedTags,
            allowedAttributes,
          }),
        }}
      />
    </div>
  );
}

export const MarkdownComponentFragment = gql`
  fragment MarkdownComponentFragment on MarkdownComponent {
    id
    text
    backgroundColor
  }
`;
