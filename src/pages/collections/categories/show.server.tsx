import Layout from "ui/components/system/layout.server";
import { ComponentContextType } from "api/__generated__/resolvers-types";

type Props = {
  router: {
    query: {
      sourceKey: string;
    };
  };
};

export default function CollectionsCategoriesShow(props: Props) {
  const sourceKey = props.router.query.sourceKey;

  // @NOTE next params dont work with streaming / nextjs yet
  // @NOTE AND dynamic routes dont work client side, so adjusting to query params
  //   const matches = props.router.asPath.match(/\/collections\/(.*)\/(.*)/);
  //   const [, collectionType, pid] = matches ? matches : [];
  //   if (!collectionType || !pid) {
  //     return <>Bad Route Match: {props.router.asPath}</>;
  //   }

  if (typeof sourceKey !== "string") {
    return <p>No book!</p>;
  }

  return (
    <Layout
      id="319426381823868993"
      contextType={ComponentContextType.Category}
      contextKey={sourceKey}
    />
  );
}