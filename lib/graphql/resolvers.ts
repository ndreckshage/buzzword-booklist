import {
  globalIdField,
  toGlobalId,
  fromGlobalId,
  connectionFromArray,
} from "graphql-relay";

import { Resolvers } from "./__generated__/resolvers-types";

const resolvers: Resolvers = {
  Query: {
    async layout(obj, args, context, info) {
      return context.db.getLayout(args.layoutKey);
    },

    async node(obj, args, context, info) {
      return null;
    },
  },

  Component: {
    __resolveType(component) {
      return component.componentType;
    },
  },

  BookCarouselComponent: {
    id: globalIdField(),
    async title(obj, args, context, info) {
      const { title } = await context.db.getBookCarousel(obj.id);
      return title;
    },
  },

  SingleColumnLayout: {
    id: globalIdField(),
  },

  Layout: {
    __resolveType(layout) {
      return layout.layoutType;
    },
  },
};

export default resolvers;
