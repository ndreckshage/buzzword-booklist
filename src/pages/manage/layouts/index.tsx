import { Suspense } from "react";
import Link from "next/link";
import { useQuery, gql } from "ui/lib/use-data.client";
import cx from "classnames";

const GET_LAYOUTS_QUERY = gql`
  query GetLayouts {
    currentUser {
      layoutComponents {
        id
        title
      }
    }
  }
`;

function ManageLayouts() {
  const { data, hydrateClient, isPending } = useQuery<{
    currentUser?: {
      layoutComponents: {
        id: string;
        title: string;
      }[];
    };
  }>("currentUser::getLayouts", GET_LAYOUTS_QUERY);

  return (
    <>
      <p>Manage Layouts</p>
      <Link href="/manage/layouts/create">
        <a>Create Layout</a>
      </Link>
      <hr className="my-5" />
      <ul>
        {data.currentUser?.layoutComponents.map((layoutComponents) => (
          <li key={layoutComponents.id}>
            <Link href={`/manage/layouts/edit?layout=${layoutComponents.id}`}>
              <a>Edit {layoutComponents.title}</a>
            </Link>{" "}
            |
            <Link href={`/layouts/show?layout=${layoutComponents.id}`}>
              <a>View {layoutComponents.title}</a>
            </Link>
          </li>
        ))}
      </ul>
      {hydrateClient}
    </>
  );
}

export default function ManageLayoutsPage() {
  return (
    <Suspense fallback="Loading layouts...">
      <ManageLayouts />
    </Suspense>
  );
}
