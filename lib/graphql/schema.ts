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

  type LinkComponent implements Node {
    id: ID!
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
  }

  union Component =
      AlertComponent
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

  type TwoColumnLayout implements Node {
    id: ID!
    layoutType: String!
    topComponents: [Component!]!
    leftComponents: [Component!]!
    rightComponents: [Component!]!
    bottomComponents: [Component!]!
  }

  type SingleColumnLayout implements Node {
    id: ID!
    layoutType: String!
    components: [Component!]!
  }

  union Layout = SingleColumnLayout | TwoColumnLayout

  type Query {
    layout(layoutKey: String!): Layout
    collectionPageLayout(collectionType: String!, collectionId: String!): Layout
    bookPageLayout(isbn: Int!): Layout
    node(id: ID!): Node
  }
`;
