import gql from "graphql-tag";
import Carousel from "./carousel.client";
import { type CarouselComponent } from "api/__generated__/resolvers-types";

export default function CarouselServer(props: CarouselComponent) {
  return (
    <div className="container mx-auto">
      <Carousel {...props} />
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
