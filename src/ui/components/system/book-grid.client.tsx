import Image from "next/image";
import NextLink from "next/link";
import { type GridComponent } from "api/__generated__/resolvers-types";
import CreatedBy from "../common/created-by";

export default function BookGrid(props: GridComponent) {
  return (
    <>
      <div className="flex mb-12 justify-center items-center space-x-2">
        <h1 className="text-3xl">{props.title}</h1>
        {props.createdBy && (
          <>
            <span>&mdash;</span>
            <CreatedBy createdByType="List" createdBy={props.createdBy} />
          </>
        )}
      </div>
      <div className="grid grid-cols-5 gap-4">
        {props.cards.map((bookCard) => (
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
    </>
  );
}
