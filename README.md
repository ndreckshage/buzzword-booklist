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

# notes

- bookshop.org inspired demo
- scrape some lists for data
- lists / carousels
- create / add to list
- lazy load more lists

auth:

- auth0 with fauna integration

pages:

- home page
- list view
- create list
- edit list
- book description view

cms:

- titles of the sections
- books in the list
- order of components
- whether the sale banner shows between components

ab tests:

- showing the price
- color of the button

feature toggles:

- maintenance mode
- creating / editing lists

NOTES:
