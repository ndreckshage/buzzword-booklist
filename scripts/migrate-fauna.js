require("dotenv").config({ path: "./.env.local" });
const { Client, query: q } = require("faunadb");

const FAUNA_KEY = process.env.FAUNA_KEY;
if (!FAUNA_KEY) {
  throw new Error("MISSING FAUNA_KEY");
}

const client = new Client({
  secret: FAUNA_KEY,
  domain: "db.us.fauna.com",
});

const createBooks = () =>
  client.query(
    q.Let(
      {
        collectionRef: q.Select(["ref"], q.CreateCollection({ name: "Books" })),
      },
      q.Do(
        q.CreateIndex({
          name: "unique_books_by_googleBooksVolumeId",
          source: q.Var("collectionRef"),
          terms: [{ field: ["data", "googleBooksVolumeId"] }],
          unique: true,
        }),
        q.CreateIndex({
          name: "books_by_listCount",
          source: q.Var("collectionRef"),
          values: [
            { field: ["data", "listCount"], reverse: true },
            { field: ["ref"] },
          ],
        })
      )
    )
  );

const createAuthors = () =>
  client.query(
    q.Let(
      {
        collectionRef: q.Select(
          ["ref"],
          q.CreateCollection({ name: "Authors" })
        ),
      },
      q.Do(
        q.CreateIndex({
          name: "unique_authors_by_key",
          source: q.Var("collectionRef"),
          terms: [{ field: ["data", "key"] }],
          unique: true,
        }),
        q.CreateIndex({
          name: "authors_by_listCount",
          source: q.Var("collectionRef"),
          values: [
            { field: ["data", "listCount"], reverse: true },
            { field: ["ref"] },
          ],
        })
      )
    )
  );

const createCategories = () =>
  client.query(
    q.Let(
      {
        collectionRef: q.Select(
          ["ref"],
          q.CreateCollection({ name: "Categories" })
        ),
      },
      q.Do(
        q.CreateIndex({
          name: "unique_categories_by_key",
          source: q.Var("collectionRef"),
          terms: [{ field: ["data", "key"] }],
          unique: true,
        }),
        q.CreateIndex({
          name: "categories_by_listCount",
          source: q.Var("collectionRef"),
          values: [
            { field: ["data", "listCount"], reverse: true },
            { field: ["ref"] },
          ],
        })
      )
    )
  );

const createCategoryBookConnections = () =>
  client.query(
    q.Let(
      {
        collectionRef: q.Select(
          ["ref"],
          q.CreateCollection({ name: "CategoryBookConnections" })
        ),
      },
      q.Do(
        q.CreateIndex({
          name: "unique_category_book_connections_by_refs",
          source: q.Var("collectionRef"),
          terms: [
            { field: ["data", "categoryRef"] },
            { field: ["data", "bookRef"] },
          ],
          unique: true,
        }),
        q.CreateIndex({
          name: "category_book_connections_by_categoryRef",
          source: q.Var("collectionRef"),
          terms: [{ field: ["data", "categoryRef"] }],
        })
      )
    )
  );

const createLists = () =>
  client.query(
    q.Let(
      {
        collectionRef: q.Select(["ref"], q.CreateCollection({ name: "Lists" })),
      },
      q.Do(
        q.CreateIndex({
          name: "unique_lists_by_key",
          source: q.Var("collectionRef"),
          terms: [{ field: ["data", "key"] }],
          unique: true,
        }),
        q.CreateIndex({
          name: "lists_by_createdBy",
          source: q.Var("collectionRef"),
          terms: [{ field: ["data", "createdBy"] }],
        }),
        q.CreateIndex({
          name: "lists_with_books",
          source: {
            collection: q.Var("collectionRef"),
            fields: {
              hasBooks: q.Query(
                q.Lambda(
                  "doc",
                  q.IsNonEmpty(q.Select(["data", "bookRefs"], q.Var("doc")))
                )
              ),
            },
          },
          terms: [{ binding: "hasBooks" }],
        })
      )
    )
  );

const createComponents = () =>
  client.query(
    q.Let(
      {
        collectionRef: q.Select(
          ["ref"],
          q.CreateCollection({ name: "Components" })
        ),
      },
      q.Do(
        q.CreateIndex({
          name: "components_by_createdBy",
          source: q.Var("collectionRef"),
          terms: [{ field: ["data", "createdBy"] }],
        }),
        q.CreateIndex({
          name: "components_by_componentType",
          source: q.Var("collectionRef"),
          terms: [{ field: ["data", "componentType"] }],
        }),
        q.CreateIndex({
          name: "components_by_isRoot_and_componentType",
          source: {
            collection: q.Collection("Components"),
            fields: {
              isRoot: q.Query(
                q.Lambda(
                  "doc",
                  q.Equals(q.Select(["data", "nested"], q.Var("doc")), false)
                )
              ),
            },
          },
          terms: [{ binding: "isRoot" }, { field: ["data", "componentType"] }],
        })
      )
    )
  );

const main = async () => {
  await createBooks();
  await createAuthors();
  await createCategories();
  await createCategoryBookConnections();
  await createLists();
  await createComponents();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
