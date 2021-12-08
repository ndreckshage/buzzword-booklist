window.fetchBook = async (bookLink, list) => {
  console.log(`Fetching BOOK ${bookLink}`);
  try {
    const bookHtml = await fetch(bookLink).then((r) => r.text());
    const bookDoc = new DOMParser().parseFromString(bookHtml, "text/html");

    const bookInfo = {
      // list
      listName: list?.name,
      listId: list?.id,
      // author
      author: bookDoc.querySelector('span[itemprop="author"]').innerText.trim(),
      authorDescription: bookDoc
        .querySelector(".space-y-4.show-lists")
        .innerText.trim(),
      // book
      title: bookDoc.querySelector('h1[itemprop="name"]').innerText.trim(),
      image: bookDoc.querySelector('#main-image [itemprop="image"]').src,
      description: bookDoc
        .querySelector('meta[name="description"]')
        .content.trim(),
      listPrice: parseInt(
        (
          parseFloat(
            bookDoc.querySelector('.mb-8 div[itemprop="offers"]').dataset
              .listPrice
          ) * 100
        ).toFixed(2),
        10
      ),
      price: parseInt(
        (
          parseFloat(
            bookDoc.querySelector('.mb-8 div[itemprop="offers"]').dataset.price
          ) * 100
        ).toFixed(),
        10
      ),
      url: bookDoc.querySelector('.mb-8 div[itemprop="offers"]').dataset
        .itemUrl,
      publisher: bookDoc.querySelector('.mb-8 div[itemprop="offers"]').dataset
        .publisher,
      publishDate: bookDoc
        .querySelector('[itemprop="datePublished"]')
        .innerText.trim(),
      dimensions: bookDoc.querySelector('[itemprop="size"]').innerText.trim(),
      language: bookDoc
        .querySelector('[itemprop="inLanguage"]')
        .innerText.trim(),
      type: bookDoc.querySelector('[itemprop="bookFormat"]').innerText.trim(),
      eanUpc: parseInt(
        bookDoc.querySelector('[itemprop="isbn"]').innerText.trim(),
        10
      ),
      pages: parseInt(
        bookDoc.querySelector('[itemprop="numberOfPages"]').innerText.trim(),
        10
      ),
      // genres
      genres: Array.from(bookDoc.querySelectorAll('a[itemprop="genre"]')).map(
        (a) => a.innerText.trim()
      ),
    };

    window.bookDict = window.bookDict || {};
    window.bookDict[`${list.id}::${bookInfo.eanUpc}`] = bookInfo;
  } catch (e) {
    console.warn(`Failed on ${bookLink}`, e);
  }
};

window.fetchList = async (list) => {
  console.log(`Fetching LIST https://bookshop.org/lists/${list.id}`);
  const listHtml = await fetch(`https://bookshop.org/lists/${list.id}`).then(
    (r) => r.text()
  );

  const listDoc = new DOMParser().parseFromString(listHtml, "text/html");
  const bookLinks = Array.from(listDoc.querySelectorAll(".product-image")).map(
    (node) => node.closest("a").href
  );

  console.log("Links to fetch...", bookLinks);

  for (let j = 0; j < bookLinks.length; j++) {
    const bookLink = bookLinks[j];
    await fetchBook(bookLink, list);
  }

  console.log("Complete!");
};

window.listsToScrape = [
  { id: "bookshop-2020-best-sellers", name: "Bookshop 2020 Best Sellers" },
  { id: "books-by-libra-writers", name: "Books By Libra Writers" },
  { id: "a-haruki-murakami-checklist", name: "A Haruki Murakami Checklist" },
  { id: "novels-set-in-japan", name: "Novels Set In Japan" },
];
