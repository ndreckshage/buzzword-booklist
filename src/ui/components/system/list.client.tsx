import Image from "next/image";
import NextLink from "next/link";
import { type ListComponent } from "api/__generated__/resolvers-types";
import CreatedBy from "../common/created-by";

export default function List(props: ListComponent) {
  return (
    <div className="w-full">
      <div className="flex mb-3 md:mb-6 space-x-2 items-center">
        <p className="font-display text-2xl mb-0">{props.title}</p>
        {props.createdBy && (
          <>
            <span>&mdash;</span>
            <CreatedBy createdByType="List" createdBy={props.createdBy} />
          </>
        )}
      </div>
      {props.cards.map((card) => (
        <div
          key={card.id}
          className="flex border-b border-slate-100 pb-5 mb-5 space-x-5 justify-between no-underline"
        >
          <div className="flex items-center">
            {card.image ? (
              <NextLink href={card.href}>
                <a className="flex mr-5 shrink-0">
                  <Image
                    alt="demo image"
                    src={card.image}
                    width={75}
                    height={100}
                  />
                </a>
              </NextLink>
            ) : (
              <div style={{ height: 100, width: 0 }} />
            )}
            <div>
              <NextLink href={card.href}>
                <a className="no-underline text-inherit">
                  <p className="m-0 text-xl mb-2 truncate max-w-md">
                    {card.title}
                  </p>
                </a>
              </NextLink>
              {card.createdBy && <CreatedBy createdBy={card.createdBy} />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
