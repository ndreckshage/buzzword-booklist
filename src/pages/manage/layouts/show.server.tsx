import Layout from "ui/components/system/layout.server";
import { ComponentContextType } from "api/__generated__/resolvers-types";

type Props = {
  router: {
    query: {
      layoutId: string;
      contextType: ComponentContextType;
      contextKey: string;
    };
  };
};

export default function ShowLayout(props: Props) {
  const { layoutId, contextType, contextKey } = props.router.query;

  // @NOTE next params dont work with streaming / nextjs yet
  // @NOTE AND dynamic routes dont work client side, so adjusting to query params
  // const pid = router.asPath.match(/\/manage\/layouts\/(.*)/)?.[1];
  // if (!pid) {
  //   return <>Bad Route Match: {router.asPath}</>;
  // }

  // return <>Show Layout: {pid}</>;

  return (
    <Layout id={layoutId} contextType={contextType} contextKey={contextKey} />
  );
}
