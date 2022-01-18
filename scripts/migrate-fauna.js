require("dotenv").config({ path: "./.env.local" });
const { Client, query: Q } = require("faunadb");

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
    Q.Let(
      {
        collectionRef: Q.Select(["ref"], Q.CreateCollection({ name: "Books" })),
      },
      Q.Do(
        Q.CreateIndex({
          name: "unique_books_by_googleBooksVolumeId",
          source: Q.Var("collectionRef"),
          terms: [{ field: ["data", "googleBooksVolumeId"] }],
          unique: true,
        }),
        Q.CreateIndex({
          name: "books_by_listCount",
          source: Q.Var("collectionRef"),
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
    Q.Let(
      {
        collectionRef: Q.Select(
          ["ref"],
          Q.CreateCollection({ name: "Authors" })
        ),
      },
      Q.Do(
        Q.CreateIndex({
          name: "unique_authors_by_key",
          source: Q.Var("collectionRef"),
          terms: [{ field: ["data", "key"] }],
          unique: true,
        }),
        Q.CreateIndex({
          name: "authors_by_listCount",
          source: Q.Var("collectionRef"),
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
    Q.Let(
      {
        collectionRef: Q.Select(
          ["ref"],
          Q.CreateCollection({ name: "Categories" })
        ),
      },
      Q.Do(
        Q.CreateIndex({
          name: "unique_categories_by_key",
          source: Q.Var("collectionRef"),
          terms: [{ field: ["data", "key"] }],
          unique: true,
        }),
        Q.CreateIndex({
          name: "categories_by_listCount",
          source: Q.Var("collectionRef"),
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
    Q.Let(
      {
        collectionRef: Q.Select(
          ["ref"],
          Q.CreateCollection({ name: "CategoryBookConnections" })
        ),
      },
      Q.Do(
        Q.CreateIndex({
          name: "unique_category_book_connections_by_refs",
          source: Q.Var("collectionRef"),
          terms: [
            { field: ["data", "categoryRef"] },
            { field: ["data", "bookRef"] },
          ],
          unique: true,
        }),
        Q.CreateIndex({
          name: "category_book_connections_by_categoryRef",
          source: Q.Var("collectionRef"),
          terms: [{ field: ["data", "categoryRef"] }],
        })
      )
    )
  );

const createLists = () =>
  client.query(
    Q.Let(
      {
        collectionRef: Q.Select(["ref"], Q.CreateCollection({ name: "Lists" })),
      },
      Q.Do(
        Q.CreateIndex({
          name: "unique_lists_by_key",
          source: Q.Var("collectionRef"),
          terms: [{ field: ["data", "key"] }],
          unique: true,
        }),
        Q.CreateIndex({
          name: "lists_by_createdBy",
          source: Q.Var("collectionRef"),
          terms: [{ field: ["data", "createdBy"] }],
        })
      )
    )
  );

const createComponents = () =>
  client.query(
    Q.Let(
      {
        collectionRef: Q.Select(
          ["ref"],
          Q.CreateCollection({ name: "Components" })
        ),
      },
      Q.CreateIndex({
        name: "components_by_createdBy",
        source: Q.Var("collectionRef"),
        terms: [{ field: ["data", "createdBy"] }],
      })
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
