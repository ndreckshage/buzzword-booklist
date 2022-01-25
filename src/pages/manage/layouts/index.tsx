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
    <div className="container mx-auto px-4 my-10">
      <h1>Manage Layouts</h1>
      <Link href="/manage/layouts/create">
        <a>Create Layout</a>
      </Link>
      <hr className="my-5" />
      <ul>
        {data.currentUser?.layoutComponents.map((layoutComponents) => (
          <li key={layoutComponents.id}>
            <b>{layoutComponents.title}:</b>{" "}
            <Link href={`/layouts/show?layout=${layoutComponents.id}`}>
              <a>View</a>
            </Link>{" "}
            |{" "}
            <Link href={`/manage/layouts/edit?layout=${layoutComponents.id}`}>
              <a>Edit</a>
            </Link>
          </li>
        ))}
      </ul>
      {hydrateClient}
    </div>
  );
}

export default function ManageLayoutsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto my-10">Loading Layouts..</div>
      }
    >
      <ManageLayouts />
    </Suspense>
  );
}
