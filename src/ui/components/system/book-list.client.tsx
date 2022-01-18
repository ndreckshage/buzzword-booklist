import Image from "next/image";
import NextLink from "next/link";
import { type BookListComponent } from "api/__generated__/resolvers-types";
import CreatedBy from "../common/created-by";

export default function BookList(props: BookListComponent) {
  return (
    <>
      <div className="flex mb-6 space-x-2">
        <h1>{props.title}</h1>
        {props.bookListCreatedBy && (
          <>
            <span>&mdash;</span>
            <CreatedBy
              createdByType="List"
              createdBy={props.bookListCreatedBy}
            />
          </>
        )}
      </div>
      {props.bookCards.map((bookCard) => (
        <div key={bookCard.id} className="border-b border-slate-100 pb-5 mb-5">
          <NextLink href={bookCard.href}>
            <a className="flex text-inherit text-xl no-underline items-center space-x-5">
              <Image
                alt="demo image"
                src={bookCard.image}
                width={75}
                height={100}
              />
              <p>{bookCard.title}</p>
            </a>
          </NextLink>
        </div>
      ))}
    </>
  );
}
