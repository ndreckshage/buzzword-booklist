require("dotenv").config({ path: "./.env.local" });
const bookshopData = require("./bookshop-data.json");
const { Client, query: Q } = require("faunadb");

const FAUNA_SECRET = process.env.FAUNA_ADMIN_TEST_KEY;
if (!FAUNA_SECRET) {
  throw new Error("MISSING FAUNA_ADMIN_TEST_KEY");
}

const client = new Client({
  secret: FAUNA_SECRET,
  domain: "db.us.fauna.com",
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const createCollections = async () => {
  await client.query(Q.CreateCollection({ name: "Authors" }));
  await client.query(Q.CreateCollection({ name: "Books" }));
  await client.query(Q.CreateCollection({ name: "Lists" }));
  await client.query(Q.CreateCollection({ name: "ListItems" }));
  await client.query(Q.CreateCollection({ name: "Genres" }));
  await client.query(Q.CreateCollection({ name: "GenreItems" }));
};

const createIndexes = async () => {
  await client.query(
    Q.CreateIndex({
      name: "unique_genres",
      source: Q.Collection("Genres"),
      terms: [{ field: ["data", "name"] }],
      unique: true,
    })
  );

  await client.query(
    Q.CreateIndex({
      name: "unique_authors",
      source: Q.Collection("Authors"),
      terms: [{ field: ["data", "name"] }],
      unique: true,
    })
  );

  await client.query(
    Q.CreateIndex({
      name: "unique_books",
      source: Q.Collection("Books"),
      terms: [{ field: ["data", "isbn"] }],
      unique: true,
    })
  );

  await client.query(
    Q.CreateIndex({
      name: "unique_lists",
      source: Q.Collection("Lists"),
      terms: [{ field: ["data", "name"] }],
      unique: true,
    })
  );

  await client.query(
    Q.CreateIndex({
      name: "unique_list_items",
      source: Q.Collection("ListItems"),
      terms: [{ field: ["data", "bookRef"] }, { field: ["data", "listRef"] }],
      unique: true,
    })
  );

  await client.query(
    Q.CreateIndex({
      name: "list_items_by_list_ref",
      source: Q.Collection("ListItems"),
      terms: [{ field: ["data", "listRef"] }],
    })
  );

  await client.query(
    Q.CreateIndex({
      name: "unique_genre_items",
      source: Q.Collection("GenreItems"),
      terms: [{ field: ["data", "bookRef"] }, { field: ["data", "genreRef"] }],
      unique: true,
    })
  );

  await client.query(
    Q.CreateIndex({
      name: "genre_items_by_book_ref",
      source: Q.Collection("GenreItems"),
      terms: [{ field: ["data", "bookRef"] }],
    })
  );

  await client.query(
    Q.CreateIndex({
      name: "genre_items_by_genre_ref",
      source: Q.Collection("GenreItems"),
      terms: [{ field: ["data", "genreRef"] }],
    })
  );

  await client.query(
    Q.CreateIndex({
      name: "genres_sorted_by_book_count",
      source: Q.Collection("Genres"),
      values: [
        { field: ["data", "bookCount"], reverse: true },
        { field: ["ref"] },
      ],
    })
  );
};

const getOrCreateGenres = async (genres) =>
  Promise.all(
    genres.map(
      async (name) =>
        (
          await client.query(
            Q.If(
              Q.Exists(Q.Match(Q.Index("unique_genres"), name)),
              Q.Get(Q.Match(Q.Index("unique_genres"), name)),
              Q.Create(Q.Collection("Genres"), { data: { name, bookCount: 0 } })
            )
          )
        ).ref
    )
  );

const getOrCreateAuthor = async ({ name, description }) =>
  (
    await client.query(
      Q.If(
        Q.Exists(Q.Match(Q.Index("unique_authors"), name)),
        Q.Get(Q.Match(Q.Index("unique_authors"), name)),
        Q.Create(Q.Collection("Authors"), { data: { name, description } })
      )
    )
  ).ref;

const getOrCreateBook = async (bookData) =>
  (
    await client.query(
      Q.If(
        Q.Exists(Q.Match(Q.Index("unique_books"), bookData.isbn)),
        Q.Get(Q.Match(Q.Index("unique_books"), bookData.isbn)),
        Q.Create(Q.Collection("Books"), { data: bookData })
      )
    )
  ).ref;

const getOrCreateList = async (name) =>
  (
    await client.query(
      Q.If(
        Q.Exists(Q.Match(Q.Index("unique_lists"), name)),
        Q.Get(Q.Match(Q.Index("unique_lists"), name)),
        Q.Create(Q.Collection("Lists"), { data: { name } })
      )
    )
  ).ref;

const getOrCreateListItem = async ({ bookRef, listRef }) =>
  (
    await client.query(
      Q.If(
        Q.Exists(Q.Match(Q.Index("unique_list_items"), [bookRef, listRef])),
        Q.Get(Q.Match(Q.Index("unique_list_items"), [bookRef, listRef])),
        Q.Create(Q.Collection("ListItems"), { data: { bookRef, listRef } })
      )
    )
  ).ref;

const getOrCreateGenreItems = async ({ genreRefs, bookRef }) =>
  Promise.all(
    genreRefs.map(
      async (genreRef) =>
        (
          await client.query(
            Q.If(
              Q.Exists(
                Q.Match(Q.Index("unique_genre_items"), [bookRef, genreRef])
              ),
              Q.Get(
                Q.Match(Q.Index("unique_genre_items"), [bookRef, genreRef])
              ),
              Q.Do(
                Q.Create(Q.Collection("GenreItems"), {
                  data: { genreRef, bookRef },
                }),
                Q.Update(genreRef, {
                  data: {
                    bookCount: Q.Add(
                      1,
                      Q.Select(["data", "bookCount"], Q.Get(genreRef))
                    ),
                  },
                })
              )
            )
          )
        ).ref
    )
  );

const main = async () => {
  // await createCollections();
  // await sleep(1000);
  // await createIndexes();

  const bookshopDataArr = Object.values(bookshopData);

  for (let i = 0; i < bookshopDataArr.length; i++) {
    // if (i >= 10) {
    //   console.log("stop at 1!");
    //   return;
    // }

    const bookData = bookshopDataArr[i];

    const genreRefs = await getOrCreateGenres(bookData.genres);
    console.log(genreRefs);

    const authorRef = await getOrCreateAuthor({
      name: bookData.author,
      description: bookData.authorDescription,
    });
    console.log(authorRef);

    const bookRef = await getOrCreateBook({
      title: bookData.title,
      author: authorRef,
      image: bookData.image,
      description: bookData.description,
      listPrice: bookData.listPrice,
      price: bookData.price,
      bookshopUrl: bookData.url,
      publisher: bookData.publisher,
      publishDate: bookData.publishDate,
      dimensions: bookData.dimensions,
      language: bookData.language,
      coverType: bookData.type,
      isbn: bookData.eanUpc,
      pages: bookData.pages,
    });
    console.log(bookRef);

    const genreItemRefs = await getOrCreateGenreItems({ genreRefs, bookRef });
    console.log(genreItemRefs);

    const listRef = await getOrCreateList(bookData.listName);
    console.log(listRef);

    const bookListRef = await getOrCreateListItem({ bookRef, listRef });
    console.log(bookListRef);

    console.log(`Created book/list ${i}!`);
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// const mainQuery = async () => {
//   const results = await client.query(
//     Q.Let(
//       {
//         listDoc: Q.Get(
//           Q.Match(Q.Index("unique_lists"), "Books By Libra Writers")
//         ),
//       },
//       {
//         id: Q.Select(["ref", "id"], Q.Var("listDoc")),
//         name: Q.Select(["data", "name"], Q.Var("listDoc")),
//         books: Q.Map(
//           Q.Paginate(
//             Q.Match(
//               Q.Index("list_items_by_list_ref"),
//               Q.Select(["ref"], Q.Var("listDoc"))
//             )
//           ),
//           Q.Lambda(
//             "listItem",
//             Q.Let(
//               {
//                 bookDoc: Q.Get(
//                   Q.Select(["data", "bookRef"], Q.Get(Q.Var("listItem")))
//                 ),
//               },
//               {
//                 id: Q.Select(["ref", "id"], Q.Var("bookDoc")),
//                 title: Q.Select(["data", "title"], Q.Var("bookDoc")),
//                 author: Q.Let(
//                   {
//                     authorDoc: Q.Get(
//                       Q.Select(["data", "author"], Q.Var("bookDoc"))
//                     ),
//                   },
//                   {
//                     id: Q.Select(["ref", "id"], Q.Var("authorDoc")),
//                     name: Q.Select(["data", "name"], Q.Var("authorDoc")),
//                     description: Q.Select(
//                       ["data", "description"],
//                       Q.Var("authorDoc")
//                     ),
//                   }
//                 ),
//                 image: Q.Select(["data", "image"], Q.Var("bookDoc")),
//                 description: Q.Select(
//                   ["data", "description"],
//                   Q.Var("bookDoc")
//                 ),
//                 listPrice: Q.Select(["data", "listPrice"], Q.Var("bookDoc")),
//                 price: Q.Select(["data", "price"], Q.Var("bookDoc")),
//                 bookshopUrl: Q.Select(
//                   ["data", "bookshopUrl"],
//                   Q.Var("bookDoc")
//                 ),
//                 publisher: Q.Select(["data", "publisher"], Q.Var("bookDoc")),
//                 publishDate: Q.Select(
//                   ["data", "publishData"],
//                   Q.Var("bookDoc")
//                 ),
//                 dimensions: Q.Select(["data", "dimensions"], Q.Var("bookDoc")),
//                 language: Q.Select(["data", "language"], Q.Var("bookDoc")),
//                 coverType: Q.Select(["data", "coverType"], Q.Var("bookDoc")),
//                 isbn: Q.Select(["data", "isbn"], Q.Var("bookDoc")),
//                 pages: Q.Select(["data", "pages"], Q.Var("bookDoc")),
//                 genres: Q.Map(
//                   Q.Paginate(
//                     Q.Match(
//                       Q.Index("genre_items_by_book_ref"),
//                       Q.Select(["ref"], Q.Var("bookDoc"))
//                     )
//                   ),
//                   Q.Lambda(
//                     "genreItemRef",
//                     Q.Let(
//                       {
//                         genreDoc: Q.Get(
//                           Q.Select(
//                             ["data", "genreRef"],
//                             Q.Get(Q.Var("genreItemRef"))
//                           )
//                         ),
//                       },
//                       {
//                         id: Q.Select(["ref", "id"], Q.Var("genreDoc")),
//                         name: Q.Select(["data", "name"], Q.Var("genreDoc")),
//                       }
//                     )
//                   )
//                 ),
//               }
//             )
//           )
//         ),
//       }
//     )
//   );

//   console.log(JSON.stringify(results, null, 2));
// };

// Map(
//   Paginate(Match(Index("genres_sorted_by_book_count")), { size: 10 }),
//   Lambda(
//     "genreArr",
//     Let(
//       {
//         genreDoc: Get(Select(1, Var("genreArr")))
//       },
//       {
//         id: Select(["ref", "id"], Var("genreDoc")),
//         name: Select(["data", "name"], Var("genreDoc")),
//         bookCount: Select(['data', 'bookCount'], Var('genreDoc')),
//         books: Map(
//           Paginate(Match(Index("genre_items_by_genre_ref"), Select(["ref"], Var("genreDoc"))), { size: 3 }),
//           Lambda('genreItemRef', Let({
//             bookDoc: Get(Select(['data', 'bookRef'], Get(Var('genreItemRef'))))
//           }, {
//             title: Select(['data', 'title'], Var('bookDoc'))
//           }))
//         )
//       }
//     )
//   )
// )

// mainQuery().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });
