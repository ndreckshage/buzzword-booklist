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

  getLayout(key: string) {
    return this.client.query(
      Q.Let(
        { layoutDoc: Q.Get(Q.Match(Q.Index("layout_by_key"), key)) },
        {
          id: Q.Select(["ref", "id"], Q.Var("layoutDoc")),
          layoutType: Q.Select(["data", "layoutType"], Q.Var("layoutDoc")),
          components: Q.Map(
            Q.Select(["data", "componentRefs"], Q.Var("layoutDoc")),
            Q.Lambda(
              "componentRef",
              Q.Let(
                {
                  componentDoc: Q.Get(Q.Var("componentRef")),
                },
                {
                  id: Q.Select(["ref", "id"], Q.Var("componentDoc")),
                  componentType: Q.Select(
                    ["data", "componentType"],
                    Q.Var("componentDoc")
                  ),
                }
              )
            )
          ),
        }
      )
    );
  }

  async getBookCarousel(componentId: string) {
    try {
      const response = await this.client.query(
        Q.Let(
          {
            componentDoc: Q.Get(Q.Ref(Q.Collection("Components"), componentId)),
          },
          Q.Let(
            {
              listRef: Q.Get(
                Q.Select(["data", "dataRef"], Q.Var("componentDoc"))
              ),
            },
            {
              id: Q.Select(["ref", "id"], Q.Var("componentDoc")),
              title: Q.Select(["data", "name"], Q.Var("listRef")),
            }
          )
        )
      );

      return response;
    } catch (e) {
      console.error(e);
    }
  }
}
