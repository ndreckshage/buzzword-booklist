import gql from "graphql-tag";

export default function Hero({
  id,
  title,
  subTitle,
}: {
  id: string;
  title: string;
  subTitle: string;
}) {
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
