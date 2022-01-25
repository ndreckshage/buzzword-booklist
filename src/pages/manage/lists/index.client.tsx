import Link from "next/link";
import { useQuery, gql } from "ui/lib/use-data.client";
import { Suspense } from "react";

const GET_LISTS_QUERY = gql`
  query GetLists {
    currentUser {
      lists {
        id
        key
        title
      }
    }
  }
`;

function ManageLists() {
  const { data, hydrateClient } = useQuery<{
    currentUser?: {
      lists: {
        id: string;
        key: string;
        title: string;
      }[];
    };
  }>("currentUser::getLists", GET_LISTS_QUERY);

  return (
    <div className="container mx-auto px-4 my-5 md:my-10">
      <h1>Manage Lists</h1>
      <Link href="/manage/lists/create">
        <a>Create List</a>
      </Link>
      <hr className="my-5" />
      <ul>
        {data.currentUser?.lists.map((list) => (
          <li key={list.id}>
            <Link href={`/manage/lists/edit?list=${list.key}`}>
              <a>Edit {list.title}</a>
            </Link>
          </li>
        ))}
      </ul>
      {hydrateClient}
    </div>
  );
}

export default function ManageListsPage() {
  return (
    <Suspense
      fallback={<div className="container mx-auto my-10">Loading Lists..</div>}
    >
      <ManageLists />
    </Suspense>
  );
}
