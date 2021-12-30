import gql from "graphql-tag";
import BookCarousel from "./book-carousel.client";

export default function BookCarouselServer(props: any) {
  return <BookCarousel {...props} />;
}

export const BookCarouselComponentFragment = gql`
  fragment BookCarouselComponentFragment on BookCarouselComponent {
    id
    title
    href
    bookCards {
      id
      href
      image
    }
  }
`;
