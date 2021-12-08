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
  type HeaderComponent {
    id: ID!
  }

  type HeroComponent {
    id: ID!
  }

  type AlertComponent {
    id: ID!
  }

  enum LinkVariant {
    PLAIN_TEXT
    CALL_TO_ACTION
  }

  type LinkComponent {
    id: ID!
    text: String!
    href: String!
    variant: LinkVariant!
  }

  type PageInfo {
    id: ID!
    hasNextPage: Boolean!
  }

  type CarouselItemComponent {
    id: ID!
    image: String!
  }

  type CarouselItemEdge {
    id: ID!
    node: CarouselItemComponent!
  }

  type CarouselItemConnection {
    id: ID!
    pageInfo: PageInfo!
    edges: [CarouselItemEdge!]
  }

  type CarouselComponent {
    id: ID!
    title: String!
    link: LinkComponent!
    carouselItems(
      before: String
      after: String
      first: Int
      last: Int
    ): CarouselItemConnection!
  }

  type GridComponent {
    id: ID!
  }

  type GridItemComponent {
    id: ID!
  }

  type MarkdownComponent {
    id: ID!
  }

  type BookDetailComponent {
    id: ID!
  }

  type ImageComponent {
    id: ID!
  }

  union Component =
      HeaderComponent
    | HeroComponent
    | AlertComponent
    | CarouselComponent
    | CarouselItemComponent
    | GridComponent
    | GridItemComponent
    | MarkdownComponent
    | BookDetailComponent
    | ImageComponent

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
      // try {
      //   const results = await ctx.faunaClient.query(
      //     Q.Let(
      //       {
      //         listDoc: Q.Get(
      //           Q.Match(Q.Index("unique_lists"), "Books By Libra Writers")
      //         ),
      //       },
      //       {
      //         id: Q.Select(["ref", "id"], Q.Var("listDoc")),
      //         name: Q.Select(["data", "name"], Q.Var("listDoc")),
      //         books: Q.Map(
      //           Q.Paginate(
      //             Q.Match(
      //               Q.Index("list_items_by_list_ref"),
      //               Q.Select(["ref"], Q.Var("listDoc"))
      //             )
      //           ),
      //           Q.Lambda(
      //             "listItem",
      //             Q.Let(
      //               {
      //                 bookDoc: Q.Get(
      //                   Q.Select(["data", "bookRef"], Q.Get(Q.Var("listItem")))
      //                 ),
      //               },
      //               {
      //                 id: Q.Select(["ref", "id"], Q.Var("bookDoc")),
      //                 title: Q.Select(["data", "title"], Q.Var("bookDoc")),
      //                 author: Q.Let(
      //                   {
      //                     authorDoc: Q.Get(
      //                       Q.Select(["data", "author"], Q.Var("bookDoc"))
      //                     ),
      //                   },
      //                   {
      //                     id: Q.Select(["ref", "id"], Q.Var("authorDoc")),
      //                     name: Q.Select(["data", "name"], Q.Var("authorDoc")),
      //                     description: Q.Select(
      //                       ["data", "description"],
      //                       Q.Var("authorDoc")
      //                     ),
      //                   }
      //                 ),
      //                 image: Q.Select(["data", "image"], Q.Var("bookDoc")),
      //                 description: Q.Select(
      //                   ["data", "description"],
      //                   Q.Var("bookDoc")
      //                 ),
      //                 listPrice: Q.Select(
      //                   ["data", "listPrice"],
      //                   Q.Var("bookDoc")
      //                 ),
      //                 price: Q.Select(["data", "price"], Q.Var("bookDoc")),
      //                 bookshopUrl: Q.Select(
      //                   ["data", "bookshopUrl"],
      //                   Q.Var("bookDoc")
      //                 ),
      //                 publisher: Q.Select(
      //                   ["data", "publisher"],
      //                   Q.Var("bookDoc")
      //                 ),
      //                 publishDate: Q.Select(
      //                   ["data", "publishDate"],
      //                   Q.Var("bookDoc")
      //                 ),
      //                 dimensions: Q.Select(
      //                   ["data", "dimensions"],
      //                   Q.Var("bookDoc")
      //                 ),
      //                 language: Q.Select(
      //                   ["data", "language"],
      //                   Q.Var("bookDoc")
      //                 ),
      //                 coverType: Q.Select(
      //                   ["data", "coverType"],
      //                   Q.Var("bookDoc")
      //                 ),
      //                 isbn: Q.Select(["data", "isbn"], Q.Var("bookDoc")),
      //                 pages: Q.Select(["data", "pages"], Q.Var("bookDoc")),
      //                 genres: Q.Map(
      //                   Q.Paginate(
      //                     Q.Match(
      //                       Q.Index("genre_items_by_book_ref"),
      //                       Q.Select(["ref"], Q.Var("bookDoc"))
      //                     )
      //                   ),
      //                   Q.Lambda(
      //                     "genreItemRef",
      //                     Q.Let(
      //                       {
      //                         genreDoc: Q.Get(
      //                           Q.Select(
      //                             ["data", "genreRef"],
      //                             Q.Get(Q.Var("genreItemRef"))
      //                           )
      //                         ),
      //                       },
      //                       {
      //                         id: Q.Select(["ref", "id"], Q.Var("genreDoc")),
      //                         name: Q.Select(
      //                           ["data", "name"],
      //                           Q.Var("genreDoc")
      //                         ),
      //                       }
      //                     )
      //                   )
      //                 ),
      //               }
      //             )
      //           )
      //         ),
      //       }
      //     )
      //   );

      //   console.log("results", results);
      // } catch (e) {
      //   console.error(e);
      // }

      return {
        id,
        components: [
          {
            __typename: "CarouselComponent",
            id: 1,
            title: "Bookshop Demo",
            link: {
              id: 1,
              text: "somethign",
              href: "/somethign",
              variant: "CALL_TO_ACTION",
            },
            carouselItems: {
              id: 1,
              edges: [
                {
                  id: 1,
                  node: {
                    id: 1,
                    image: "asdad",
                  },
                },
              ],
              pageInfo: {
                id: 1,
                hasNextPage: false,
              },
            },
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
