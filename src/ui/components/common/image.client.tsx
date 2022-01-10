import Image, { type ImageProps } from "next/image";

export default function ClientImage(props: ImageProps) {
  return <Image {...props} />;
}
