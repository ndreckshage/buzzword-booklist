# goal

blog post

title: streaming a serverless, server driven ui with server components

building as a way to experiment with some new technologies and buzzwords.

serverless frontend/backend ... next app & graphql with vercel
serverless db ... fauna
graphql server driven ui (airbnb ghost)
server components and stremaing
relay
github oauth

part one: user facing site
bookshop.org inspired site. lists of holiday / best books of 2021. link to bookshop.org pages to buy!
carousels and grids of books that we can view by list, genre or author
homepage with cms controlled content
collection pages (lists; authors; genres)
book detail pages

part two: admin tooling
github oauth for admin access (see: https://github.com/vercel/next-server-components)
layouts pages (see all configured layouts)
layout manager (new / edit / delete)
list manager (new / edit / delete)
book manager (new / edit / delete)
missing (author manager; genre manager)

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

- create temp layout + component collections to experiment
- fix typescript errors from recursive layout
- get recursive layout showing up
- add in book list into the recursive layout

- layout create
- layout edit
- add github oauth
- lists view mine
- layouts view mine
- convert to relay / react-fetch / etc
- protect the various lists / layouts
- limit query depth / something. protect gql.
- make it look a lot prettier
- add error boundaries and stuff
- allow a list to specify between grid / list
- get the node query working
- rename slug to key in various places
- begin planning blog post!

## BLOG POST IMPLEMENTATION:

- Setup Nextjs
- Setup Graphql
- Look at bookshop, design schema
- Scrape Data
- Import into Fauna
- Initial Graphql schema
- Server components, loading the data onto the screen
- Creating our carousel
