import gql from "graphql-tag";
import { type BookImageComponent } from "api/__generated__/resolvers-types";
import Image from "ui/components/common/image.client";

export default function BookImageServer(props: BookImageComponent) {
  if (!props.image) {
    return null;
  }

  return (
    <div className="shrink-0 mx-5">
      <Image src={props.image} width={200} height={300} />
    </div>
  );
}

export const BookImageComponentFragment = gql`
  fragment BookImageComponentFragment on BookImageComponent {
    id
    image
  }
`;
