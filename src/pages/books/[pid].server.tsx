type Props = {
  router: { asPath: string };
};

export default function BookShow(props: Props) {
  // @NOTE next params dont work with streaming / nextjs yet
  const pid = props.router.asPath.match(/\/books\/(.*)/)?.[1];
  if (!pid) {
    return <>Bad Route Match: {props.router.asPath}</>;
  }

  return (
    <>
      <h2 className="text-xl m-5 p-5 text-purple-500">Book: {pid}</h2>
    </>
  );
}
