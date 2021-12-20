type Props = {
  router: { asPath: string };
};

export default function ShowCollection(props: Props) {
  // @NOTE next params dont work with streaming / nextjs yet
  const matches = props.router.asPath.match(/\/collections\/(.*)\/(.*)/);
  const [, collectionType, pid] = matches ? matches : [];
  if (!collectionType || !pid) {
    return <>Bad Route Match: {props.router.asPath}</>;
  }

  return (
    <>
      Show Collection: {collectionType} - {pid}
    </>
  );
}
