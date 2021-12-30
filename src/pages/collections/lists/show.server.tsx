type Props = {
  router: {
    query: {
      listSlug: string;
    };
  };
};

export default function CollectionsListsShow(props: Props) {
  const listSlug = props.router.query.listSlug;

  // @NOTE next params dont work with streaming / nextjs yet
  // @NOTE AND dynamic routes dont work client side, so adjusting to query params
  //   const matches = props.router.asPath.match(/\/collections\/(.*)\/(.*)/);
  //   const [, collectionType, pid] = matches ? matches : [];
  //   if (!collectionType || !pid) {
  //     return <>Bad Route Match: {props.router.asPath}</>;
  //   }

  if (typeof listSlug !== "string") {
    return <p>No book!</p>;
  }

  return (
    <>
      <h2 className="text-xl m-5 p-5 text-purple-500">List: {listSlug}</h2>
    </>
  );
}
