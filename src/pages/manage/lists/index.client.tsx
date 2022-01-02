import Link from "next/link";
import cx from "classnames";
import { useQuery, gql } from "ui/lib/use-data.client";
import { Suspense } from "react";

const linkClass = cx({
  underline: true,
  "text-blue-600": true,
  "hover:text-blue-800": true,
  "visited:text-purple-600": true,
});

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
  const { data, hydrateClient, isPending } = useQuery<{
    currentUser?: {
      lists: {
        id: string;
        key: string;
        title: string;
      }[];
    };
  }>("currentUser::getLists", GET_LISTS_QUERY);

  return (
    <>
      <p>Manage Lists</p>
      <Link href="/manage/lists/create">
        <a className={linkClass}>Create List</a>
      </Link>
      <hr className="my-5" />
      <ul>
        {data.currentUser?.lists.map((list) => (
          <li key={list.id}>
            <Link href={`/manage/lists/edit?list=${list.key}`}>
              <a className={linkClass}>Edit {list.title}</a>
            </Link>
          </li>
        ))}
      </ul>
      {hydrateClient}
    </>
  );
}

export default function ManageListsPage() {
  return (
    <Suspense fallback="Loading lists...">
      <ManageLists />
    </Suspense>
  );
}
