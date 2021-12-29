export default /* GraphQL */ `
  type BookCardComponent {
    id: ID!
    href: String!
    image: String!
  }

  type BookCarouselComponent {
    id: ID!
    title: String!
    href: String!
    items: [BookCardComponent!]!
  }

  type BookGridComponent {
    id: ID!
  }

  type BookListItemComponent {
    id: ID!
  }

  type BookListComponent {
    id: ID!
  }

  type HeroComponent {
    id: ID!
    title: String!
    subTitle: String!
  }

  union Component =
      Layout
    | BookCardComponent
    | BookCarouselComponent
    | BookGridComponent
    | BookListComponent
    | HeroComponent

  type Layout {
    id: ID!
    key: String!
    components: [Component!]!
  }

  type Book {
    id: ID!
    googleBooksVolumeId: String!
    title: String!
    image: String!
  }

  type List {
    id: ID!
    title: String!
    slug: String!
    createdBy: String!
    books: [Book!]!
  }

  type Query {
    currentUser: String
    layout(layoutKey: String!): Layout
    collectionPageLayout(
      collectionType: String!
      collectionSlug: String!
    ): Layout
    bookPageLayout(googleBooksVolumeId: String!): Layout
    list(listSlug: String!): List
  }

  type Mutation {
    createList(title: String!): Boolean
    addBookToList(listSlug: String!, googleBooksVolumeId: String!): Boolean
    removeBookFromList(listSlug: String!, googleBooksVolumeId: String!): Boolean
  }
`;
