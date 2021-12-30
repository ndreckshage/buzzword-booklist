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
    bookCards: [BookCardComponent!]!
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

  type LayoutComponentStyleOptions {
    flexDirection: String!
  }

  type LayoutComponent {
    id: ID!
    createdBy: String!
    styleOptions: LayoutComponentStyleOptions!
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

  input LayoutContext {
    authorSlug: String
    categorySlug: String
    googleBooksVolumeId: String
    listSlug: String
  }

  type Query {
    currentUser: String
    layoutComponent(id: ID!, layoutContext: LayoutContext!): LayoutComponent
    list(listSlug: String!): List
  }

  type Mutation {
    createList(title: String!): Boolean
    addBookToList(listSlug: String!, googleBooksVolumeId: String!): Boolean
    removeBookFromList(listSlug: String!, googleBooksVolumeId: String!): Boolean
  }
`;
