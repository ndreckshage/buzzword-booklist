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

  type BookListComponent {
    id: ID!
  }

  type HeroComponent {
    id: ID!
    title: String!
    subTitle: String!
  }

  type LayoutComponent {
    id: ID!
    components: [Component!]!
  }

  union Component =
      LayoutComponent
    | BookCardComponent
    | BookCarouselComponent
    | BookGridComponent
    | BookListComponent
    | HeroComponent

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
    layout(layoutRef: String!): LayoutComponent
    layoutWithCollectionContext(
      layoutRef: String!
      collectionType: String!
      collectionSlug: String!
    ): LayoutComponent
    layoutWithBookContext(
      layoutRef: String!
      googleBooksVolumeId: String!
    ): LayoutComponent
    list(listSlug: String!): List
  }

  type Mutation {
    createList(title: String!): Boolean
    addBookToList(listSlug: String!, googleBooksVolumeId: String!): Boolean
    removeBookFromList(listSlug: String!, googleBooksVolumeId: String!): Boolean
  }
`;
