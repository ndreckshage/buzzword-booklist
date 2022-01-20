# Buzzword Booklist

Experimental application that uses:

- Serverless frontend + graphql with Vercel/Next.js
- Serverless database with Fauna
- Server Driven UI system (Catalog data maps to **Component types** in the Graph)
- React Server Components, Streaming
- React Server Side Suspense for Data Fetching, Streaming
- Tailwind CSS

## What does this app do...

### User Pages

These pages use server components, and are served via a [Server driven ui inspired schema](https://github.com/ndreckshage/buzzword-booklist/blob/main/src/api/schema.graphql#L86). This maps catalog data to component types.

- Homepage: https://buzzword-booklist.vercel.app/
- Example List Page: https://buzzword-booklist.vercel.app/lists/show?sourceKey=nicks-recent-reads
- Example Author Page: https://buzzword-booklist.vercel.app/authors/show?sourceKey=haruki-murakami
- Example Category Page: https://buzzword-booklist.vercel.app/categories/show?sourceKey=fiction-literary
- Example Book Page: https://buzzword-booklist.vercel.app/books/show?googleBooksVolumeId=A08c2Ep7QbYC

### Management Pages

After logging in with Github, you can create "Lists" (simple book lists) and "Layouts" (a CMS / page builder). These examples use Server side suspense with data fetching, and standard Graphql entity types.

Replace "nicks-test-list" with your own in the various links.

- https://buzzword-booklist.vercel.app/manage/lists/create >> create a list (example: "nicks-test-list")
- https://buzzword-booklist.vercel.app/manage/lists/edit?list=nicks-test-list >> add a few books (for example I added "the martian" and "cloud cuckoo land")
- https://buzzword-booklist.vercel.app/lists/show?sourceKey=nicks-test-list >> view your list (customer page from above)
- https://buzzword-booklist.vercel.app/manage/layouts/create >> create a layout! (example: "nicks-test-layout")
- https://buzzword-booklist.vercel.app/manage/layouts >> click edit on your layout (refresh if needed ... still working on bugs)
- https://buzzword-booklist.vercel.app/manage/layouts/edit?layout=320377732958519360 >>
  -- add a CarouselComponent to your layout. specify a list and "nicks-test-list"
  -- add a MarkdownComponent to your layout.
- https://buzzword-booklist.vercel.app/manage/layouts/show?layout=320377732958519360 >> view your layout!
- https://buzzword-booklist.vercel.app/manage/layouts/edit?layout=320377732958519360 >> go back to editing
  -- add a GridComponent, select "Use page context"
  -- View your new layout with a few different contexts!
  --- https://buzzword-booklist.vercel.app/manage/layouts/show?layout=320377732958519360&contextType=CATEGORY&contextKey=fiction-literary
  --- https://buzzword-booklist.vercel.app/manage/layouts/show?layout=320377732958519360&contextType=AUTHOR&contextKey=j-k-rowling
  --- https://buzzword-booklist.vercel.app/manage/layouts/show?layout=320377732958519360&contextType=LIST&contextKey=bookshoporg-top-50-bestsellers-2021

These layouts are then how all the above user page are powered.

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
