import gql from "graphql-tag";
import { type MarkdownComponent } from "api/__generated__/resolvers-types";
import React from "react";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

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

export default function Markdown({ id, text }: MarkdownComponent) {
  return (
    <>
      <p>Markdown!: {id}</p>
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(marked(text || ""), {
            allowedTags,
            allowedAttributes,
          }),
        }}
      />
    </>
  );
}

export const MarkdownComponentFragment = gql`
  fragment MarkdownComponentFragment on MarkdownComponent {
    id
    text
  }
`;
