import { print } from "graphql/language/printer";
import { DocumentNode } from "graphql/language/ast";
import gql from "graphql-tag";

const baseUrl =
  process.env.API_BASE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000");

async function request<D>(
  document: DocumentNode,
  variables?: object,
  extraHeaders?: object
) {
  const response = await fetch(`${baseUrl}/api/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    credentials: "include",
    body: JSON.stringify({
      query: print(document),
      variables,
    }),
  });

  return (await response.json().then(({ data }) => data)) as D;
}

export { request, gql };