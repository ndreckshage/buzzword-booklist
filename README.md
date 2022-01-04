# README

## BLOG

### introduction

title: `Buzzword Booklist 2021 - Tutorial Series 1/10`
subtitle: `Building a Serverless, Suspense for Data, Server Components, Server Driven UIs`
content: introduction, link to the site, link to the source code, explain goals and what we will be building. define terms.
bookshop.org inspired site. lists of holiday / best books of 2021. link to bookshop.org pages to buy!

### next setup; server components and suspense for data fetch

todo
focus on suspense for data fetching, suspense.

### tailwind setup; carousel & grid layout testing

todo

### graphql setup; core entity schema design; initial resolvers

todo
focus on fauna overview

### fauna setup + initial migration; list query, list edit interface + remove mutation

todo

### adding github oauth, protecting remove list item

todo
github oauth for admin access (see: https://github.com/vercel/next-server-components)
https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app

all we need is the username
https://avatars.githubusercontent.com/ndreckshage?s=100
https://github.com/ndreckshage

server components do not have access to request context as of current next version. cant use user personalized data in rsc.

### creating a list + adding a book interface

todo

### schema design + queries for server driven ui, create frontends

todo
graphql server driven ui (airbnb ghost)

### server driven ui manager

todo

### wrap up / summary

todo

## NOTES

- slugify books on import
- google books api ... create list just use typeahead google books... then find by google id or create.
- do vs let https://stackoverflow.com/questions/69539411/can-i-run-multiple-faunadb-transactions-in-the-one-request
- nice hydrogen discussion https://github.com/Shopify/hydrogen/pull/305
- https://codesandbox.io/s/reverent-easley-x2uxo?file=/src/App.js:244-251 / https://github.com/reactwg/react-18/discussions/25
- things were wild getting streaming to work without RSC. found a pretty simple solution though.
- rsc double render on the client; client always
- dynamic routes dont work client side. useEffect for example. needed to switch to query params
- but then with query params ... no ability to refresh
- wish fauna you could click through to documents in the viewer. and could click through to prefiltered indexes that match a single ref
- server components with \_middleware doesnt work
- server components dont work with graphql without going throgh an endpoint (setImmediate)
- cant import fragments from a client component into a server component .. need fragment to be in the layout
- cant do things like `export { default as default } from "./book-carousel.client";` .. still treated as a server component
- nested queries v as you fetch ... forced bc server components uncaught

## TODOS

- update various so that we return raw refIds as well and use that for queries/mutations
- layout edit
- layout create
- add markdown support for hero
- add created by component on book carousels
- add cretaed by component on layouts

- lists view mine
- layouts view mine
- limit query depth / something. protect gql.
- make it look a lot prettier
- add error boundaries and stuff
- allow a list to specify between grid / list
- begin planning blog post!
- show how we can build a custom huruki murakami page and set as author page
- show how we can build a book club page
