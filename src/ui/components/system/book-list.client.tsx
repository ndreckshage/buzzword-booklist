import Image from "next/image";
import NextLink from "next/link";
import { type BookListComponent } from "api/__generated__/resolvers-types";

export default function BookList(props: BookListComponent) {
  return (
    <div>
      {props.bookCards.map((bookCard) => (
        <div key={bookCard.id} className="">
          <NextLink href={bookCard.href}>
            <a>
              <Image
                alt="demo image"
                src={bookCard.image}
                width={200}
                height={300}
              />
            </a>
          </NextLink>
        </div>
      ))}
    </div>
  );
}
