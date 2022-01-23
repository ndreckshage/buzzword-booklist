import Layout from "ui/components/system/layout.server";
import { LayoutContextType } from "api/__generated__/resolvers-types";

type Props = {
  router: {
    query: {
      layout: string;
      contextType: LayoutContextType;
      contextKey: string;
    };
  };
};

export default function ShowLayout(props: Props) {
  const { layout: layoutId, contextType, contextKey } = props.router.query;

  // @NOTE next params dont work with streaming / nextjs yet
  // @NOTE AND dynamic routes dont work client side, so adjusting to query params
  // const pid = router.asPath.match(/\/manage\/layouts\/(.*)/)?.[1];
  // if (!pid) {
  //   return <>Bad Route Match: {router.asPath}</>;
  // }

  if (typeof layoutId !== "string") {
    return <p>No layout!</p>;
  }

  return (
    <Layout
      id={layoutId}
      contextType={contextType ?? LayoutContextType.None}
      contextKey={contextKey ?? ""}
      showContextPicker
    />
  );
}
