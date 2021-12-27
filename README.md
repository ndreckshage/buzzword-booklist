# README

## BLOG

### introduction

title: `Buzzword Booklist 2021 - Part 1/8`
subtitle: `Building a Serverless, Suspense for Data, Server Components, Server Driven UIs`
content: introduction, link to the site, link to the source code, explain goals and what we will be building. define terms.
bookshop.org inspired site. lists of holiday / best books of 2021. link to bookshop.org pages to buy!

### react setup; server components and suspense for data fetch; route creation

todo

### graphql setup; initial fauna migration

todo

### initial schema creation for books, books fql, displaying a list

todo

### manage list interface, github oauth for managing books

todo
github oauth for admin access (see: https://github.com/vercel/next-server-components)

### schema creation for server driven ui, create frontends

todo
graphql server driven ui (airbnb ghost)

### server driven ui admin manager

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

```graphql
# could do something like this. HOWEVER. since using streaming and server components, we are going to try out a more streaming forward approach
# render as you fetch

fragment LayoutFragment on Layout {
  __typename
  id
  key
}

fragment ComponentFragment on Component {
  __typename

  ... on HeroComponent {
    id
    title
    subTitle
  }
}

query GetLayout {
  layout(layoutKey: "home-page") {
    ...LayoutFragment
    components {
      ...ComponentFragment
      ... on Layout {
        ...LayoutFragment
        components {
          ...ComponentFragment
          ... on Layout {
            ...LayoutFragment
            components {
              ...ComponentFragment
              # NO MORE HANDLING LAYOUT!
            }
          }
        }
      }
    }
  }
}
```

## TODOS

- get recursive layout showing up
- add in book list into the recursive layout

- layout create
- layout edit
- add github oauth
- lists view mine
- layouts view mine
- protect the various lists / layouts
- limit query depth / something. protect gql.
- make it look a lot prettier
- add error boundaries and stuff
- allow a list to specify between grid / list
- get the node query working
- rename slug to key in various places
- begin planning blog post!
