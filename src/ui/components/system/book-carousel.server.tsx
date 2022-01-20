import gql from "graphql-tag";
import BookCarousel from "./book-carousel.client";
import { type CarouselComponent } from "api/__generated__/resolvers-types";

export default function BookCarouselServer(props: CarouselComponent) {
  return (
    <div className="container mx-auto">
      <BookCarousel {...props} />
    </div>
  );
}

export const CarouselComponentFragment = gql`
  fragment CarouselComponentFragment on CarouselComponent {
    id
    title
    link {
      title
      href
      variant
    }
    createdBy
    cards {
      id
      href
      image
    }
  }
`;
