# Buzzword Booklist

[See the blog post for application details!](https://medium.com/@nickdreckshage/buzzword-booklist-207fcf9f045b)

## Install

- [Create Github application](https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app). Add keys to env vars.
- [Create a Fauna DB](https://fauna.com/). Add a server key in the Fauna UI. Add keys to env vars.
- Generate a session key with `head -n 4096 /dev/urandom | openssl sha1`. Add to env vars.

```
GITHUB_OAUTH_CLIENT_ID = <secret>
GITHUB_OAUTH_CLIENT_SECRET = <secret>
SESSION_KEY= <secret>
FAUNA_KEY = <secret>
```

- Migrate Fauna by running `node migrate-fauna.js`
- `yarn`
- `yarn dev`

- Open up `pages/index.tsx` and return `null` for now. You're going to need to create some lists / layouts before these pages work. Then head on over to the manage page to start that...
- Create the homepage layout, and then add that ID in `pages/index.tsx`.
- Repeat for other pages.
- Done!
