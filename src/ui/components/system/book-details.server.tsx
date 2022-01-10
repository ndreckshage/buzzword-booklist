import gql from "graphql-tag";
import { type BookDetailsComponent } from "api/__generated__/resolvers-types";
import React from "react";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

const allowedTags = sanitizeHtml.defaults.allowedTags.concat([
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

export default function Markdown({ id, text }: BookDetailsComponent) {
  return (
    <>
      <p>Book Details</p>
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

export const BookDetailsComponentFragment = gql`
  fragment BookDetailsComponentFragment on BookDetailsComponent {
    id
    text
  }
`;
