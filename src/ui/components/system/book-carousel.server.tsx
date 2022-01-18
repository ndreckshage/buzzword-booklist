import gql from "graphql-tag";
import BookCarousel from "./book-carousel.client";
import { type BookCarouselComponent } from "api/__generated__/resolvers-types";

export default function BookCarouselServer(props: BookCarouselComponent) {
  return (
    <div className="container mx-auto">
      <BookCarousel {...props} />
    </div>
  );
}

export const BookCarouselComponentFragment = gql`
  fragment BookCarouselComponentFragment on BookCarouselComponent {
    id
    title
    link {
      title
      href
      variant
    }
    bookListCreatedBy
    bookCards {
      id
      href
      image
    }
  }
`;
