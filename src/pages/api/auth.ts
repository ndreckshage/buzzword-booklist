import { NextApiRequest, NextApiResponse } from "next";
import session from "api/session";

const GITHUB_OAUTH_CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID;
const GITHUB_OAUTH_CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET;

if (!GITHUB_OAUTH_CLIENT_ID || !GITHUB_OAUTH_CLIENT_SECRET) {
  throw new Error(
    "MISSING GITHUB_OAUTH_CLIENT_ID / GITHUB_OAUTH_CLIENT_SECRET"
  );
}

interface Request extends NextApiRequest {
  session: {
    currentUser: string;
  } | null;
}

export default async (req: Request, res: NextApiResponse) => {
  session(req, res);
  const { code, logout } = req.query;

  if (logout) {
    // This doesnt actually revoke the oauth token
    req.session = null;
    res.writeHead(302, { Location: `/` });
    return res.end();
  }

  // When there's no `code` param specified,
  // it's a GET from the client side.
  // We go with the login flow.
  if (!code) {
    // Login with GitHub
    res.writeHead(302, {
      Location: `https://github.com/login/oauth/authorize?client_id=${GITHUB_OAUTH_CLIENT_ID}&allow_signup=false`,
    });

    return res.end();
  }

  try {
    const data = await (
      await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        body: JSON.stringify({
          client_id: GITHUB_OAUTH_CLIENT_ID,
          client_secret: GITHUB_OAUTH_CLIENT_SECRET,
          code,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
    ).json();

    if (data.access_token && req.session) {
      const userInfo = await (
        await fetch("https://api.github.com/user", {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `token ${data.access_token}`,
            Accept: "application/json",
          },
        })
      ).json();

      req.session.currentUser = userInfo.login;
    } else {
      req.session = null;
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Failed to auth." });
  }

  res.writeHead(302, { Location: `/` });
  res.end();
};
