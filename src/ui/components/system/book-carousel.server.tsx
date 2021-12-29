import { gql } from "ui/lib/use-data.server";

export default function BookCarousel({ id }: { id: string }) {
  return <p>Book carousel!: {id}</p>;
}

export const BookCarouselComponentFragment = gql`
  fragment BookCarouselComponentFragment on BookCarouselComponent {
    id
  }
`;
