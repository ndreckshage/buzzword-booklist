import { gql, ApolloServer } from "apollo-server-micro";
import Cors from "cors";

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
    getLayout: (ctx, { id }) => {
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

const apolloServer = new ApolloServer({ typeDefs, resolvers });
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
