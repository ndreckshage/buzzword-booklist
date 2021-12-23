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
      Q.CreateIndex({
        name: "unique_books_by_google_books_volume_id",
        source: Q.Var("collectionRef"),
        terms: [{ field: ["data", "googleBooksVolumeId"] }],
        unique: true,
      })
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
      Q.CreateIndex({
        name: "unique_authors_by_slug",
        source: Q.Var("collectionRef"),
        terms: [{ field: ["data", "slug"] }],
        unique: true,
      })
    )
  );

const createAuthorBookConnections = () =>
  client.query(
    Q.Let(
      {
        collectionRef: Q.Select(
          ["ref"],
          Q.CreateCollection({ name: "AuthorBookConnections" })
        ),
      },
      Q.CreateIndex({
        name: "unique_author_book_connections_by_refs",
        source: Q.Var("collectionRef"),
        terms: [
          { field: ["data", "authorRef"] },
          { field: ["data", "bookRef"] },
        ],
        unique: true,
      })
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
      Q.CreateIndex({
        name: "unique_categories_by_slug",
        source: Q.Var("collectionRef"),
        terms: [{ field: ["data", "slug"] }],
        unique: true,
      })
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
      Q.CreateIndex({
        name: "unique_category_book_connections_by_refs",
        source: Q.Var("collectionRef"),
        terms: [
          { field: ["data", "categoryRef"] },
          { field: ["data", "bookRef"] },
        ],
        unique: true,
      })
    )
  );

const createLists = () =>
  client.query(
    Q.Let(
      {
        collectionRef: Q.Select(["ref"], Q.CreateCollection({ name: "Lists" })),
      },
      Q.CreateIndex({
        name: "unique_lists_by_slug",
        source: Q.Var("collectionRef"),
        terms: [{ field: ["data", "slug"] }],
        unique: true,
      })
    )
  );

const createListBookConnections = () =>
  client.query(
    Q.Let(
      {
        collectionRef: Q.Select(
          ["ref"],
          Q.CreateCollection({ name: "ListBookConnections" })
        ),
      },
      Q.Do(
        Q.CreateIndex({
          name: "unique_list_book_connections_by_refs",
          source: Q.Var("collectionRef"),
          terms: [
            { field: ["data", "listRef"] },
            { field: ["data", "bookRef"] },
          ],
          unique: true,
        }),
        Q.CreateIndex({
          name: "list_book_connections_by_listRef",
          source: Q.Var("collectionRef"),
          terms: [{ field: ["data", "listRef"] }],
        })
      )
    )
  );

const main = async () => {
  // await createBooks();

  // await createAuthors();
  // await createAuthorBookConnections();

  // await createCategories();
  // await createCategoryBookConnections();

  await createLists();
  await createListBookConnections();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
