import { Client, query as Q } from "faunadb";
import { LinkComponentVariant } from "api/__generated__/resolvers-types";

export default function getBookCarouselComponentsByRefs(client: Client) {
  return async (
    source: readonly { sourceId: string; sourceType: string }[]
  ) => {
    const refs = source.map(({ sourceId, sourceType }) =>
      Q.Ref(Q.Collection(sourceType), sourceId)
    );

    try {
      const result = (await client.query(
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
                        id: Q.Select(["ref", "id"], Q.Var("bookDoc")),
                        googleBooksVolumeId: Q.Select(
                          ["data", "googleBooksVolumeId"],
                          Q.Var("bookDoc")
                        ),
                        image: Q.Select(["data", "image"], Q.Var("bookDoc")),
                      }
                    )
                  )
                ),
              }
            )
          )
        )
      )) as {
        title: string;
        slug: string;
        bookCards: {
          id: string;
          googleBooksVolumeId: string;
          image: string;
        }[];
      }[];

      return result.map((bookCarouselComponent) => ({
        ...bookCarouselComponent,
        link: {
          title: "See all",
          href: `/collections/lists/show?listSlug=${bookCarouselComponent.slug}`,
          variant: LinkComponentVariant.Default,
        },
        bookCards: bookCarouselComponent.bookCards.map((bookCard) => ({
          ...bookCard,
          href: `/books/show?googleBooksVolumeId=${bookCard.googleBooksVolumeId}`,
        })),
      }));
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
