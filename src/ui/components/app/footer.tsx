import Image from "next/image";
import logo from "./logo.png";

export default function Footer() {
  return (
    <div className="flex items-center justify-center m-20">
      <a href="https://www.humblespark.com/" target="_blank">
        <Image src={logo} alt="HumbleSpark" width={292} height={82} />
      </a>
    </div>
  );
}
