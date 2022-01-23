import Image from "next/image";
import NextLink from "next/link";
import { type ListComponent } from "api/__generated__/resolvers-types";
import CreatedBy from "../common/created-by";

export default function BookList(props: ListComponent) {
  return (
    <>
      <div className="flex mb-6 space-x-2">
        <h1 className="m-0">{props.title}</h1>
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
          className="flex border-b border-slate-100 pb-5 mb-5 space-x-5"
        >
          <NextLink href={card.href}>
            <a className="flex text-inherit text-xl no-underline items-center">
              {card.image ? (
                <div className="flex mr-5">
                  <Image
                    alt="demo image"
                    src={card.image}
                    width={75}
                    height={100}
                  />
                </div>
              ) : (
                <div style={{ height: 100, width: 1 }} />
              )}
              <p className="m-0">{card.title}</p>
            </a>
          </NextLink>
          {card.createdBy && (
            <div className="flex items-center space-x-5">
              <span>&mdash;</span>
              <CreatedBy createdBy={card.createdBy} />
            </div>
          )}
        </div>
      ))}
    </>
  );
}
