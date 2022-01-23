import Image from "next/image";
import NextLink from "next/link";
import { type GridComponent } from "api/__generated__/resolvers-types";
import CreatedBy from "../common/created-by";

export default function BookGrid(props: GridComponent) {
  return (
    <>
      <div className="flex mb-12 justify-center items-center space-x-2">
        <h1 className="text-3xl m-0">{props.title}</h1>
        {props.createdBy && (
          <>
            <span>&mdash;</span>
            <CreatedBy createdByType="List" createdBy={props.createdBy} />
          </>
        )}
      </div>
      <div className="grid grid-cols-5 gap-4">
        {props.cards.map((card) => (
          <div key={card.id} className="flex m-5">
            <NextLink href={card.href}>
              <a className="text-inherit text-lg no-underline">
                {card.image && (
                  <Image
                    alt="demo image"
                    src={card.image}
                    width={200}
                    height={300}
                  />
                )}
                <p>
                  <b>{card.title}</b>
                </p>
              </a>
            </NextLink>
          </div>
        ))}
      </div>
    </>
  );
}
