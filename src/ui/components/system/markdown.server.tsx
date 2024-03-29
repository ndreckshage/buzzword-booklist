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
    img: ["alt", "src", "width", "height"],
  }
);

export default function Markdown({
  __typename,
  text,
  backgroundColor,
}: MarkdownComponent) {
  return (
    <div
      className={cx(__typename, "py-10", {
        "bg-inherit": backgroundColor === "inherit",
        "bg-emerald-500": backgroundColor === "emerald-500",
        "bg-indigo-500": backgroundColor === "indigo-500",
        "text-white": ["indigo-500", "emerald-500"].includes(backgroundColor),
      })}
    >
      <div
        className="container mx-auto px-4"
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(marked(text || ""), {
            allowedTags,
            allowedAttributes,
            transformTags: {
              a: function (tagName, attribs) {
                return {
                  tagName,
                  attribs: {
                    ...attribs,
                    ...(attribs.href.startsWith("/")
                      ? {}
                      : { target: "_blank" }),
                  },
                };
              },
            },
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
