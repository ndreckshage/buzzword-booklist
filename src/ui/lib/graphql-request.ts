import { print } from "graphql/language/printer";
import { DocumentNode } from "graphql/language/ast";
import gql from "graphql-tag";

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_ENV
  ? "https://buzzword-booklist.vercel.app"
  : `http://localhost:3000`;

async function request<D>(
  document: DocumentNode,
  variables?: object,
  extraHeaders?: object
) {
  return fetch(`${baseUrl}/api/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    ...(typeof window === "undefined" ? {} : { credentials: "include" }),
    body: JSON.stringify({
      query: print(document),
      variables,
    }),
  })
    .then((r) => r.json())
    .then(({ data }) => data)
    .catch((err) => err) as Promise<D>;
}

export { request, gql };
