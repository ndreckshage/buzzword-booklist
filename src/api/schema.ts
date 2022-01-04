export default /* GraphQL */ `
  type BookCardComponent {
    id: ID!
    href: String!
    image: String!
  }

  type BookCarouselComponent {
    id: ID!
    title: String!
    link: LinkComponent!
    bookCards: [BookCardComponent!]!
  }

  type BookGridComponent {
    id: ID!
    title: String!
    bookCards: [BookCardComponent!]!
  }

  type BookListComponent {
    id: ID!
    title: String!
    bookCards: [BookCardComponent!]!
  }

  type HeroComponent {
    id: ID!
    title: String!
    subTitle: String!
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
    flexDirection: String!
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
    key: String!
    createdBy: String!
    books: [Book!]!
  }

  type CurrentUser {
    name: String!
    layoutComponents: [LayoutComponent!]!
    lists: [List!]!
  }

  enum ComponentContextType {
    AUTHOR
    BOOK
    CATEGORY
    LIST
    NONE
  }

  type Query {
    currentUser: CurrentUser
    layout(
      id: ID!
      contextType: ComponentContextType!
      contextKey: String!
    ): LayoutComponent
    component(id: ID!): Component
    list(listKey: String!): List
  }

  type Mutation {
    # books / lists...
    createList(title: String!): Boolean
    addBookToList(listKey: String!, googleBooksVolumeId: String!): Boolean!
    removeBookFromList(listKey: String!, googleBooksVolumeId: String!): Boolean!
    # layouts...
    createLayoutComponent(title: String!): Boolean
    updateLayoutComponent(
      layoutId: ID!
      componentOrder: [ID!]
      flexDirection: String
    ): Boolean!
    createComponentInLayout(layoutId: ID!, componentType: String!): Boolean!
    updateHeroComponent(
      componentId: ID!
      title: String
      subTitle: String
    ): Boolean!
  }
`;
