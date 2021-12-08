import { gql, ApolloServer } from "apollo-server-micro";
import Cors from "cors";

import { Client, query as Q } from "faunadb";

const getClient = () => {
  const FAUNA_SECRET = process.env.FAUNA_ADMIN_TEST_KEY;
  if (!FAUNA_SECRET) {
    throw new Error("MISSING FAUNA_ADMIN_TEST_KEY");
  }

  return new Client({
    secret: FAUNA_SECRET,
    domain: "db.us.fauna.com",
  });
};

function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "OPTIONS"],
  })
);

const typeDefs = gql`
  type LinkComponent {
    id: ID!
    text: String!
    href: String!
    variant: String
  }

  type HeaderComponent {
    id: ID!
    title: String!
    links: [LinkComponent!]
  }

  type BookListItemComponent {
    id: ID!
    title: String!
    link: LinkComponent!
  }

  type BookListComponent {
    id: ID!
    header: String!
  }

  type BookDetailHero {
    id: ID!
    title: String!
    subTitle: String!
    link: LinkComponent!
  }

  type BookDetailDescription {
    id: ID!
    copy: String!
  }

  type SaleBanner {
    id: ID!
    copy: String!
  }

  union Component =
      HeaderComponent
    | BookListComponent
    | BookListItemComponent
    | BookDetailHero
    | BookDetailDescription
    | SaleBanner

  type Layout {
    id: ID!
    components: [Component!]
  }

  type Query {
    getLayout(id: ID!): Layout
  }
`;

const resolvers = {
  Query: {
    getLayout: async (parent, { id }, ctx) => {
      const results = await ctx.faunaClient.query(
        Q.Let(
          {
            listDoc: Q.Get(
              Q.Match(Q.Index("unique_lists"), "Books By Libra Writers")
            ),
          },
          {
            id: Q.Select(["ref", "id"], Q.Var("listDoc")),
            name: Q.Select(["data", "name"], Q.Var("listDoc")),
            books: Q.Map(
              Q.Paginate(
                Q.Match(
                  Q.Index("list_items_by_list_ref"),
                  Q.Select(["ref"], Q.Var("listDoc"))
                )
              ),
              Q.Lambda(
                "listItem",
                Q.Let(
                  {
                    bookDoc: Q.Get(
                      Q.Select(["data", "bookRef"], Q.Get(Q.Var("listItem")))
                    ),
                  },
                  {
                    id: Q.Select(["ref", "id"], Q.Var("bookDoc")),
                    title: Q.Select(["data", "title"], Q.Var("bookDoc")),
                    author: Q.Let(
                      {
                        authorDoc: Q.Get(
                          Q.Select(["data", "author"], Q.Var("bookDoc"))
                        ),
                      },
                      {
                        id: Q.Select(["ref", "id"], Q.Var("authorDoc")),
                        name: Q.Select(["data", "name"], Q.Var("authorDoc")),
                        description: Q.Select(
                          ["data", "description"],
                          Q.Var("authorDoc")
                        ),
                      }
                    ),
                    image: Q.Select(["data", "image"], Q.Var("bookDoc")),
                    description: Q.Select(
                      ["data", "description"],
                      Q.Var("bookDoc")
                    ),
                    listPrice: Q.Select(
                      ["data", "listPrice"],
                      Q.Var("bookDoc")
                    ),
                    price: Q.Select(["data", "price"], Q.Var("bookDoc")),
                    bookshopUrl: Q.Select(
                      ["data", "bookshopUrl"],
                      Q.Var("bookDoc")
                    ),
                    publisher: Q.Select(
                      ["data", "publisher"],
                      Q.Var("bookDoc")
                    ),
                    publishDate: Q.Select(
                      ["data", "publishData"],
                      Q.Var("bookDoc")
                    ),
                    dimensions: Q.Select(
                      ["data", "dimensions"],
                      Q.Var("bookDoc")
                    ),
                    language: Q.Select(["data", "language"], Q.Var("bookDoc")),
                    coverType: Q.Select(
                      ["data", "coverType"],
                      Q.Var("bookDoc")
                    ),
                    isbn: Q.Select(["data", "isbn"], Q.Var("bookDoc")),
                    pages: Q.Select(["data", "pages"], Q.Var("bookDoc")),
                    genres: Q.Map(
                      Q.Paginate(
                        Q.Match(
                          Q.Index("genre_items_by_book_ref"),
                          Q.Select(["ref"], Q.Var("bookDoc"))
                        )
                      ),
                      Q.Lambda(
                        "genreItemRef",
                        Q.Let(
                          {
                            genreDoc: Q.Get(
                              Q.Select(
                                ["data", "genreRef"],
                                Q.Get(Q.Var("genreItemRef"))
                              )
                            ),
                          },
                          {
                            id: Q.Select(["ref", "id"], Q.Var("genreDoc")),
                            name: Q.Select(["data", "name"], Q.Var("genreDoc")),
                          }
                        )
                      )
                    ),
                  }
                )
              )
            ),
          }
        )
      );

      console.log("layout", ctx);

      return {
        id,
        components: [
          {
            __typename: "HeaderComponent",
            id: 1,
            title: "Bookshop Demo",
            links: [],
          },
        ],
      };
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    faunaClient: getClient(),
  }),
});

const startServer = apolloServer.start();

export default async function handler(req, res) {
  await cors(req, res);
  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
