import Image from "next/image";
import NextLink from "next/link";
import { type BookGridComponent } from "api/__generated__/resolvers-types";

export default function BookGrid(props: BookGridComponent) {
  return (
    <div className="grid grid-cols-4 gap-4">
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
