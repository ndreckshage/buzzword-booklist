import Layout from "ui/components/system/layout.server";
import { ComponentContextType } from "api/__generated__/resolvers-types";

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
    <Layout
      id="320326508822396997"
      contextType={ComponentContextType.Book}
      contextKey={googleBooksVolumeId}
    />
  );
}
