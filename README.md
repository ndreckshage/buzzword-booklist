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

- dynamic routes dont work client side. useEffect for example. needed to switch to query params
- slugify books on import
- google books api ... create list just use typeahead google books... then find by google id or create.
- do vs let https://stackoverflow.com/questions/69539411/can-i-run-multiple-faunadb-transactions-in-the-one-request

## TODOS

- create temp layout + component collections to experiment
- layout create
- layout edit
- add github oauth
- lists view mine
- layouts view mine
- convert to relay / react-fetch / etc
- protect the various lists / layouts
- limit query depth / something. protect gql.
- make it look a lot prettier
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
