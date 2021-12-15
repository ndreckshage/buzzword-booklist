import { Client, query as Q, Var } from "faunadb";
import { toGlobalId, fromGlobalId } from "graphql-relay";

export default class Database {
  client: InstanceType<typeof Client>;

  constructor() {
    const FAUNA_SECRET = process.env.FAUNA_ADMIN_KEY;
    if (!FAUNA_SECRET) {
      throw new Error("MISSING FAUNA_ADMIN_KEY");
    }

    this.client = new Client({
      secret: FAUNA_SECRET,
      domain: "db.us.fauna.com",
    });
  }

  async getComponents() {
    return null;
  }
}
