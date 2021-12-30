type Props = {
  router: {
    query: {
      googleBooksVolumeId: string;
    };
  };
};

export default function BookShow(props: Props) {
  const googleBooksVolumeId = props.router.query.googleBooksVolumeId;

  // @NOTE next params dont work with streaming / nextjs yet
  // @NOTE AND dynamic routes dont work client side, so adjusting to query params
  // const pid = props.router.asPath.match(/\/books\/(.*)/)?.[1];
  // if (!pid) {
  //   return <>Bad Route Match: {props.router.asPath}</>;
  // }

  if (typeof googleBooksVolumeId !== "string") {
    return <p>No book!</p>;
  }

  return (
    <>
      <h2 className="text-xl m-5 p-5 text-purple-500">
        Book: {googleBooksVolumeId}
      </h2>
    </>
  );
}
