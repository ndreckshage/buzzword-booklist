import gql from "graphql-tag";
import { type BookImageComponent } from "api/__generated__/resolvers-types";
import Image from "ui/components/common/image.client";

export default function BookImageServer(props: BookImageComponent) {
  if (!props.image) {
    return null;
  }

  return <Image src={props.image} width={200} height={300} />;
}

export const BookImageComponentFragment = gql`
  fragment BookImageComponentFragment on BookImageComponent {
    id
    image
  }
`;
