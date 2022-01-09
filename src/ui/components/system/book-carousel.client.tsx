import { useRef } from "react";
import Image from "next/image";
import Link from "./link.client";
import NextLink from "next/link";
import { type BookCarouselComponent } from "api/__generated__/resolvers-types";

export default function BookCarousel(props: BookCarouselComponent) {
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
    <div className="container px-10">
      <p className="text-3xl">
        {props.title} {props.link && <Link {...props.link} />}
      </p>
      <div
        className="relative w-full flex gap-6 overflow-x-auto pb-14 scroll-smooth snap-x snap-always snap-mandatory"
        ref={containerRef}
      >
        {props.bookCards.map((bookCard) => (
          <div key={bookCard.id} className="snap-start shrink-0">
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
      {props.bookCards.length > 0 && (
        <>
          <button onClick={advance(false)}>prev</button>
          <button onClick={advance(true)}>next</button>
        </>
      )}
    </div>
  );
}
