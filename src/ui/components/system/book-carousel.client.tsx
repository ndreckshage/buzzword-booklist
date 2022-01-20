import { useRef } from "react";
import Image from "next/image";
import Link from "./link.client";
import NextLink from "next/link";
import cx from "classnames";
import { type CarouselComponent } from "api/__generated__/resolvers-types";
import CreatedBy from "../common/created-by";

const Arrow = ({
  direction,
  onClick,
}: {
  direction: string;
  onClick: () => void;
}) => (
  <button
    className={cx(
      "absolute top-1/2 transform -translate-y-1/2 bg-white rounded-md drop-shadow-xl",
      {
        "-left-8": direction === "left",
        "-right-8": direction === "right",
      }
    )}
    onClick={onClick}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={48}
      width={48}
      viewBox="0 0 24 24"
      fill="#111"
    >
      {direction === "left" && (
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      )}
      {direction === "right" && (
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
      )}
    </svg>
  </button>
);

export default function BookCarousel(props: CarouselComponent) {
  const containerRef = useRef<HTMLDivElement>(null);

  const advance = (forward: boolean) => () => {
    if (containerRef.current) {
      const x = forward
        ? containerRef.current.scrollLeft + containerRef.current.offsetWidth
        : containerRef.current.scrollLeft - containerRef.current.offsetWidth;

      containerRef.current.scrollTo(x, 0);
    }
  };

  return (
    <div className="container my-4">
      <div className="flex justify-between">
        <p className="text-2xl">
          {props.title}{" "}
          {props.link && (
            <span className="text-lg">
              <Link {...props.link} />
            </span>
          )}
        </p>
        <CreatedBy createdByType="List" createdBy={props.createdBy} />
      </div>
      <div className="relative">
        <div
          className="relative w-full flex gap-6 overflow-x-auto scroll-smooth snap-x snap-always snap-mandatory p-5"
          ref={containerRef}
        >
          {props.cards.map((bookCard) => (
            <div
              key={bookCard.id}
              className="snap-start shrink-0 drop-shadow-lg"
            >
              <NextLink href={bookCard.href}>
                <a>
                  <Image
                    alt="demo image"
                    src={bookCard.image}
                    className="shrink-0 w-80 h-40 rounded-lg shadow-xl bg-white"
                    width={200}
                    height={300}
                  />
                </a>
              </NextLink>
            </div>
          ))}
        </div>
        {props.cards.length > 0 && (
          <>
            <Arrow direction="left" onClick={advance(false)} />
            <Arrow direction="right" onClick={advance(true)} />
          </>
        )}
      </div>
    </div>
  );
}
