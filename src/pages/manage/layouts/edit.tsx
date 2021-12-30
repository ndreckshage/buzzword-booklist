import { Suspense } from "react";
import { useRouter } from "next/router";
import { useQuery, gql } from "ui/lib/use-data.client";

// const LAYOUT_QUERY = gql`
//   query GetLayout($id: ID!) {
//     layout(id: $id) {
//       id
//       createdBy
//       components {
//         __typename

//         ... on LayoutComponent {
//           id
//         }

//         ...HeroComponentFragment
//         ...BookCarouselComponentFragment
//       }
//     }
//   }
//   ${HeroComponentFragment}
//   ${BookCarouselComponentFragment}
// `;

const EditLayout = ({ id }: { id: string }) => {
  return <p>edit layout</p>;
};

export default function EditLayoutPage() {
  const router = useRouter();
  const layoutId = router.query.layout;

  // // @NOTE next params dont work with streaming / nextjs yet
  //  // @NOTE AND dynamic routes dont work client side, so adjusting to query params
  // const pid = router.asPath.match(/\/manage\/layouts\/(.*)\/edit/)?.[1];
  // if (!pid) {
  //   return <>Bad Route Match: {router.asPath}</>;
  // }

  if (typeof layoutId !== "string") {
    return <p>No layout to edit!</p>;
  }

  return (
    <Suspense fallback="Loading book list...">
      <EditLayout id={layoutId} />
    </Suspense>
  );
}
