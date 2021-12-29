import { Client, query as Q } from "faunadb";
import { type RootBookCarouselComponentModel } from ".";

export default function getBookCarouselComponentsByJsonRefs(client: Client) {
  return async (jsonRefs: readonly string[]) => {
    const refs = jsonRefs
      .map(
        (json) => JSON.parse(json) as { sourceId: string; sourceType: string }
      )
      .map(({ sourceId, sourceType }) =>
        Q.Ref(Q.Collection(sourceType), sourceId)
      );

    console.log(jsonRefs);

    try {
      const result = await client.query(
        Q.Map(
          refs,
          Q.Lambda(
            "sourceRef",
            Q.Let(
              {
                sourceDoc: Q.Get(Q.Var("sourceRef")),
              },
              {
                title: Q.Select(["data", "title"], Q.Var("sourceDoc")),
                slug: Q.Select(["data", "slug"], Q.Var("sourceDoc")),
                bookCards: Q.Map(
                  Q.Select(["data", "bookRefs"], Q.Var("sourceDoc")),
                  Q.Lambda(
                    "bookRef",
                    Q.Let(
                      {
                        bookDoc: Q.Get(Q.Var("bookRef")),
                      },
                      {
                        // @TODO
                        id: Q.Select(["ref", "id"], Q.Var("bookDoc")),
                        href: Q.Select(
                          ["data", "googleBooksVolumeId"],
                          Q.Var("bookDoc")
                        ),
                        // title: Q.Select(["data", "title"], Q.Var("bookDoc")),
                        // publisher: Q.Select(
                        //   ["data", "publisher"],
                        //   Q.Var("bookDoc")
                        // ),
                        // publishedDate: Q.Select(
                        //   ["data", "publishedDate"],
                        //   Q.Var("bookDoc")
                        // ),
                        // description: Q.Select(
                        //   ["data", "description"],
                        //   Q.Var("bookDoc")
                        // ),
                        // isbn: Q.Select(["data", "isbn"], Q.Var("bookDoc")),
                        // pageCount: Q.Select(
                        //   ["data", "pageCount"],
                        //   Q.Var("bookDoc")
                        // ),
                        image: Q.Select(["data", "image"], Q.Var("bookDoc")),
                      }
                    )
                  )
                ),
              }
            )
          )
        )
      );

      // console.log("result", result[0].bookCards);

      return result;

      // return refs.map((ref) => []);

      // return result as RootBookCarouselComponentModel[];
    } catch (e) {
      console.error(e);

      if (e instanceof Error) {
        // @ts-ignore
        throw new Error(e.description || e.message);
      }

      throw e;
    }
  };
}
