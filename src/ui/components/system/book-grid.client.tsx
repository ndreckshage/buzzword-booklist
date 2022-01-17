import Image from "next/image";
import NextLink from "next/link";
import { type BookGridComponent } from "api/__generated__/resolvers-types";

export default function BookGrid(props: BookGridComponent) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {props.bookCards.map((bookCard) => (
        <div key={bookCard.id} className="flex m-5">
          <NextLink href={bookCard.href}>
            <a className="text-inherit text-lg no-underline">
              <Image
                alt="demo image"
                src={bookCard.image}
                width={200}
                height={300}
              />
              <p>{bookCard.title}</p>
            </a>
          </NextLink>
        </div>
      ))}
    </div>
  );
}
