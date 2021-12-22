import fetch from "node-fetch";

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
  async importBook(obj, args, context) {
    // slugify(string, {lower:true, strict:true}))

    const book = (await fetch(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${args.isbn}&jscmd=data&format=json`
    )
      .then((r) => r.json())
      .then((json: any) => {
        const book = json[`ISBN:${args.isbn}`];
        return book
          ? {
              isbn: args.isbn,
              title: book.title,
              slug: "",
              subtitle: book.subtitle,
              authors: book.authors.map((a) => a.name),
              publishers: book.publishers.map((a) => a.name),
              subjects: book.subjects.map((a) => a.name),
              publishDate: book.publish_date,
              pages: book.number_of_pages,
              links: book.links,
              cover: book.cover,
            }
          : null;
      })
      .catch((err) => console.error(err))) as {
      isbn: string;
      title: string;
      subtitle: string;
      authors: string[];
      publishers: string[];
      publishDate: string;
      pages: number;
      cover: { small: string; medium: string; large: string };
    } | null;

    // get book by isbn
    // fetch from open book api
    // get author by name
    // fetch from open book api
    // get genre .. upsert maybe
    console.log("import book", book);
    return false;
  },
};
