import {
  globalIdField,
  toGlobalId,
  fromGlobalId,
  connectionFromArray,
} from "graphql-relay";

import { Resolvers } from "./__generated__/resolvers-types";

const resolvers: Resolvers = {
  Query: {
    // layout(obj, args, context, info) {
    //   return {
    //     // id: globalIdField(),
    //     id: toGlobalId("Layout", args.layoutId),
    //   };
    // },

    async node(obj, args, context, info) {
      console.log(context.db.getComponents);
      return null;
    },
  },
};

export default resolvers;
