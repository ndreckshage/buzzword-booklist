import { useQuery, gql } from "ui/lib/use-data.client";
import { type Maybe } from "api/__generated__/resolvers-types";
import { type ReactNode } from "react";

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      name
    }
  }
`;

const CurrentUserProvider = (props: {
  children: (currentUser: string | null) => ReactNode;
}) => {
  const { data, hydrateClient } = useQuery<{
    currentUser: Maybe<{ name: string }>;
  }>("currentUserAppProvider", CURRENT_USER_QUERY);

  return (
    <>
      {props.children(data.currentUser?.name ?? null)}
      {hydrateClient}
    </>
  );
};

export default CurrentUserProvider;
