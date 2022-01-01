type Props = {
  router: {
    query: {
      sourceKey: string;
    };
  };
};

export default function CollectionsListsShow(props: Props) {
  const sourceKey = props.router.query.sourceKey;

  // TODO! create book carousel grid + list components!

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
    <>
      <h2 className="text-xl m-5 p-5 text-purple-500">List: {sourceKey}</h2>
    </>
  );
}
