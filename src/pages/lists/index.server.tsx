import Layout from "ui/components/system/layout.server";
import { ComponentContextType } from "api/__generated__/resolvers-types";

type Props = {
  router: {
    query: {
      sourceKey: string;
    };
  };
};

export default function CollectionsListsIndex(props: Props) {
  return (
    <Layout
      id="321075323706802244"
      contextType={ComponentContextType.Lists}
      contextKey=""
    />
  );
}
