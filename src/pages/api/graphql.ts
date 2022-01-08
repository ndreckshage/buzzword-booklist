import { NextApiRequest, NextApiResponse } from "next";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphqlHTTP } from "express-graphql";
import session from "api/session";
import Cors from "cors";

// @ts-ignore
import typeDefs from "api/schema.graphql";
import resolvers from "api/resolvers";
import { createContext } from "api/context";

interface Request extends NextApiRequest {
  session: {
    currentUser?: string;
  };
}

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default async function handler(req: Request, res: NextApiResponse) {
  session(req, res);

  const currentUser = req.session.currentUser
    ? req.session.currentUser
    : // @NOTE helpful for apollo studio which doesnt have session cookie
    process.env.UNSECURE_ALLOW_CURRENT_USER_HEADER === "true" &&
      req.headers["x-current-user"]
    ? String(req.headers["x-current-user"])
    : null;

  await new Promise((resolve, reject) =>
    Cors({ methods: ["GET", "POST", "OPTIONS"] })(req, res, (result) =>
      result instanceof Error ? reject(result) : resolve(result)
    )
  );

  return graphqlHTTP({ schema, context: createContext({ currentUser }) })(
    req as any,
    res
  );
}

export const config = { api: { bodyParser: false } };
