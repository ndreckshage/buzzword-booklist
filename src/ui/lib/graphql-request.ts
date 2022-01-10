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
  console.log(
    `DEBUG: ${baseUrl}/api/graphql ; server? ${
      typeof window === "undefined"
    } ; ${JSON.stringify(variables)}`
  );

  try {
    const response = await fetch(`${baseUrl}/api/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...extraHeaders,
      },
      // credentials: "include",
      body: JSON.stringify({
        query: print(document),
        variables,
      }),
    });

    return (await response.json().then(({ data }) => data)) as D;
  } catch (e) {
    console.error(e);
    return {};
  }
}

export { request, gql };
