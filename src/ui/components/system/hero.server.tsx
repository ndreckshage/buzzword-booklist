import gql from "graphql-tag";
import { type HeroComponent } from "api/__generated__/resolvers-types";

export default function Hero({ id, title, subTitle }: HeroComponent) {
  return (
    <p>
      Hero!: {id} {title} {subTitle}
    </p>
  );
}

export const HeroComponentFragment = gql`
  fragment HeroComponentFragment on HeroComponent {
    id
    title
    subTitle
  }
`;
