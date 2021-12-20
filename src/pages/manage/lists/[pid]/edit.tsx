import { useRouter } from "next/router";

export default function EditList() {
  const router = useRouter();
  // @NOTE next params dont work with streaming / nextjs yet
  const pid = router.asPath.match(/\/manage\/lists\/(.*)\/edit/)?.[1];
  if (!pid) {
    return <>Bad Route Match: {router.asPath}</>;
  }

  return <>Edit List: {pid}</>;
}
