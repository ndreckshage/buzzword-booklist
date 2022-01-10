import { Suspense } from "react";
import Refresher from "ui/components/demos/rsc-refresher.client";
import { useQuery, gql } from "ui/lib/use-data.server";

const QUERY = gql`
  query GetList {
    list(listKey: "nicks-list") {
      title
      createdBy
    }
  }
`;

const Demo = ({ cacheKey }: { cacheKey: string }) => {
  const data = useQuery(cacheKey, QUERY);

  return (
    <>
      <div>
        <code>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </code>
      </div>
    </>
  );
};

type Props = {
  refreshCount?: number;
};

const SuspenseDemo = (props: Props) => {
  const refreshCount = props.refreshCount || 0;

  return (
    <>
      <h1>Suspense demo with server components .... </h1>
      <Refresher>
        <Suspense fallback="suspending a1...">
          <Demo cacheKey="a1" />
        </Suspense>
      </Refresher>
    </>
  );
};

export default SuspenseDemo;
