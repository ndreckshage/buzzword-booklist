export default /* GraphQL */ `
  interface Node {
    id: ID!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  enum AlertVariant {
    ERROR
    SUCCESS
    WARNING
    INFO
  }

  type AlertComponent implements Node {
    id: ID!
    variant: AlertVariant!
  }

  type BannerComponent implements Node {
    id: ID!
  }

  enum LinkVariant {
    DEFAULT
    CALL_TO_ACTION
  }

  type LinkComponent {
    text: String!
    href: String!
    variant: LinkVariant!
  }

  type BookCarouselItemComponent implements Node {
    id: ID!
    href: String!
    image: String!
  }

  type BookCarouselItemComponentEdge {
    cursor: String
    node: BookCarouselItemComponent
  }

  type BookCarouselItemComponentConnection {
    totalCount: Int!
    edges: [BookCarouselItemComponentEdge]
    pageInfo: PageInfo!
  }

  type BookCarouselComponent implements Node {
    id: ID!
    title: String!
    link: LinkComponent
    items(
      first: Int
      after: String
      last: Int
      before: String
    ): BookCarouselItemComponentConnection
  }

  type BookGridItemComponent implements Node {
    id: ID!
  }

  type BookGridComponent implements Node {
    id: ID!
  }

  type BookListItemComponent implements Node {
    id: ID!
  }

  type BookListComponent implements Node {
    id: ID!
  }

  type BookPageActionComponent implements Node {
    id: ID!
  }

  type BookPageAuthorComponent implements Node {
    id: ID!
  }

  type BookPageDetailsComponent implements Node {
    id: ID!
  }

  type BookPageDescriptionComponent implements Node {
    id: ID!
  }

  type BookPageGenreComponent implements Node {
    id: ID!
  }

  type BookPageImageComponent implements Node {
    id: ID!
  }

  type BookPagePriceComponent implements Node {
    id: ID!
  }

  type HeroComponent implements Node {
    id: ID!
    title: String!
  }

  union Component =
      Layout
    | AlertComponent
    | BannerComponent
    | BookCarouselComponent
    | BookGridComponent
    | BookListComponent
    | BookPageActionComponent
    | BookPageAuthorComponent
    | BookPageDetailsComponent
    | BookPageDescriptionComponent
    | BookPageGenreComponent
    | BookPageImageComponent
    | BookPagePriceComponent
    | HeroComponent

  type Layout implements Node {
    id: ID!
    components: [Component!]!
  }

  # type Author implements Node {
  #   id: ID!
  #   name: String!
  #   slug: String!
  # }

  # type Category implements Node {
  #   id: ID!
  #   name: String!
  #   slug: String!
  # }

  type Book implements Node {
    id: ID!
    googleBooksVolumeId: String!
    title: String!
    image: String!
    # authors: [Author!]!
    # categories: [Category!]!
  }

  type ListBookEdge {
    cursor: String
    node: Book
  }

  type ListBookConnection {
    totalCount: Int!
    edges: [ListBookEdge]
    pageInfo: PageInfo!
  }

  type List implements Node {
    id: ID!
    title: String!
    slug: String!
    books(
      first: Int
      after: String
      last: Int
      before: String
    ): ListBookConnection
  }

  type Query {
    layout(layoutKey: String!): Layout
    collectionPageLayout(collectionType: String!, collectionId: String!): Layout
    bookPageLayout(isbn: Int!): Layout
    list(listSlug: String!): List
    node(id: ID!): Node
  }

  type Mutation {
    createList(title: String!): Boolean
    addBookToList(listSlug: String!, googleBooksVolumeId: String!): Boolean
    removeBookFromList(listSlug: String!, googleBooksVolumeId: String!): Boolean
  }
`;
