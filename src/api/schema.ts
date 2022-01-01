export default /* GraphQL */ `
  type BookCardComponent {
    id: ID!
    href: String!
    image: String!
  }

  enum BookListContext {
    AUTHOR
    CATEGORY
    LIST
  }

  type BookCarouselComponent {
    id: ID!
    title: String!
    link: LinkComponent!
    bookCards: [BookCardComponent!]!
  }

  type BookGridComponent {
    id: ID!
    title(sourceType: BookListContext!, sourceKey: String!): String!
    bookCards(
      sourceType: BookListContext!
      sourceKey: String!
    ): [BookCardComponent!]!
  }

  type BookListComponent {
    id: ID!
    title(sourceType: BookListContext!, sourceKey: String!): String!
    bookCards(
      sourceType: BookListContext!
      sourceKey: String!
    ): [BookCardComponent!]!
  }

  type HeroComponent {
    id: ID!
    title: String!
    subTitle: String!
  }

  type LayoutComponentStyleOptions {
    flexDirection: String!
  }

  enum LinkComponentVariant {
    DEFAULT
    BUTTON
  }

  type LinkComponent {
    title: String!
    href: String!
    variant: LinkComponentVariant!
  }

  type LayoutComponent {
    id: ID!
    title: String!
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

  type CurrentUser {
    name: String!
    layoutComponents: [LayoutComponent!]!
    lists: [List!]!
  }

  type Query {
    currentUser: CurrentUser
    component(id: ID!): Component
    list(listSlug: String!): List
  }

  type Mutation {
    createList(title: String!): Boolean
    addBookToList(listSlug: String!, googleBooksVolumeId: String!): Boolean
    removeBookFromList(listSlug: String!, googleBooksVolumeId: String!): Boolean
  }
`;
