# Buzzword Booklist

Experimental application that uses:

- Serverless frontend + graphql with Vercel/Next.js
- Serverless database with Fauna
- Server Driven UI system (Catalog data maps to **Component types** in the Graph)
- React Server Components, Streaming
- React Server Side Suspense for Data Fetching, Streaming
- Tailwind CSS

## What does this app do...

-

## Install

- [Create Github application](https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app)
- [Create a Fauna DB](https://fauna.com/)
- Generate a session key with `head -n 4096 /dev/urandom | openssl sha1`
- `yarn`
- `yarn dev`

### .env.local

```
GITHUB_OAUTH_CLIENT_ID = <secret>
GITHUB_OAUTH_CLIENT_SECRET = <secret>
SESSION_KEY= <secret>
FAUNA_KEY = <secret>
```
