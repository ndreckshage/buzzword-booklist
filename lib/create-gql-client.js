import { GraphQLClient } from "graphql-request";

const PUBLIC_CLIENT_KEY = process.env.FAUNA_PUBLIC_CLIENT_KEY;
const FAUNA_GRAPHQL_BASE_URL = "https://graphql.us.fauna.com/graphql";

export default function createGqlClient() {
  return new GraphQLClient(FAUNA_GRAPHQL_BASE_URL, {
    headers: {
      authorization: `Bearer ${PUBLIC_CLIENT_KEY}`,
    },
  });
}
