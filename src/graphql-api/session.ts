import { NextApiRequest, NextApiResponse } from "next";
import cookieSession from "cookie-session";

const SESSION_KEY = process.env.SESSION_KEY;
if (!SESSION_KEY) {
  throw "MISSING SESSION_KEY";
}

const session = cookieSession({
  name: "session",
  keys: [SESSION_KEY],
  maxAge: 24 * 60 * 60 * 1000,
});

export default (req: NextApiRequest, res: NextApiResponse) =>
  // @ts-ignore
  session(req, res, () => {});
