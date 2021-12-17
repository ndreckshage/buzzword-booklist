import { NextApiRequest, NextApiResponse } from "next";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphqlHTTP } from "express-graphql";
import Cors from "cors";

import typeDefs from "../../lib/graphql/schema";
import resolvers from "../../lib/graphql/resolvers";
import { createContext } from "../../lib/graphql/context";

// @NOTE not sure
interface Request extends NextApiRequest {
  url: string;
}

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default async function handler(req: Request, res: NextApiResponse) {
  await new Promise((resolve, reject) =>
    Cors({ methods: ["GET", "POST", "OPTIONS"] })(req, res, (result) =>
      result instanceof Error ? reject(result) : resolve(result)
    )
  );

  return graphqlHTTP({ schema, context: createContext() })(req, res);
}

export const config = { api: { bodyParser: false } };
