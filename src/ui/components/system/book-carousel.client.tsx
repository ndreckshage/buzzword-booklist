import { useRef } from "react";
import Image from "next/image";

type BookCarouselProps = {
  id: string;
  title: string;
  href: string;
  bookCards: {
    id: string;
    image: string;
    href: string;
  }[];
};

export default function BookCarousel(props: BookCarouselProps) {
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
      <p className="text-3xl">{props.title}</p>
      <div
        className="relative w-full flex gap-6 overflow-x-auto pb-14 scroll-smooth snap-x snap-always snap-mandatory"
        ref={containerRef}
      >
        {props.bookCards.map((bookCard) => (
          <div key={bookCard.id} className="snap-start shrink-0">
            <Image
              alt="demo image"
              src={bookCard.image}
              className="shrink-0 w-80 h-40 rounded-lg shadow-xl bg-white"
              width={200}
              height={300}
            />
          </div>
        ))}
      </div>
      <button onClick={advance(false)}>prev</button>
      <button onClick={advance(true)}>next</button>
    </div>
  );
}
