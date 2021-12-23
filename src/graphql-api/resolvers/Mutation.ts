import type { MutationResolvers } from "../__generated__/resolvers-types";
import { ResolverContext } from "../context";

const isbns = [
  "9780063052291",
  "9781250217349",
  "9781984806758",
  "9781250805805",
  "9781982140168",
  "9781984818416",
  "9781984856029",
  "9780062975164",
  "9780812993325",
  "9780593198148",
  "9780385545686",
  "9780062955791",
  "9780525657743",
  "9780385547123",
  "9781631492563",
  "9780393242836",
  "9780593330753",
];

export default {
  async upsertList(obj, args, context) {
    const { success, list } = await context.repo.bookList.upsertBookList(
      args.listInput
    );

    if (success && list) {
      return list;
    }

    return null;
  },
} as MutationResolvers<ResolverContext>;
