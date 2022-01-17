import { useRef } from "react";
import Image from "next/image";
import cx from "classnames";

const bookImages = [
  "http://books.google.com/books/publisher/content?id=B4MhEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71U-eVCBMln56F85Fkj9ter89DdSNT3f7GgY1LjvBFbRLgfA5pUaNb-VQUsoocB7-5Fi91X5Oic7dLf4KTqvm495QXbjXeOBA8KmAdUrPDS-zULiNYZNeo1v_3waxkoYsRpMtAO&source=gbs_api",
  "http://books.google.com/books/publisher/content?id=vmM9BAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70ZNx4XlKIbHQ2xS1d0AdT2fwQadnABDV8GU9mzKQQ5nZhcdzM_y_eTB5HYtGwopw4J30ro1UK91KLRxj6oX4A81lQmelWj9QergSOIS5YDxlfCpHD5Q8L6NEn8UErE-DjJ96Vm&source=gbs_api",
  "http://books.google.com/books/publisher/content?id=WAc_EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72_zDkIOzaAlfVbNysi2ZK9U401WrsCPNJuE2wBtHl-_RtRkhqrVC7NM7pqmJFzMJRx7f7f_7qbSeh5xfrqoX4iYwVqjvJjaA6zvBITH5Ga8nBoVhcCd6SvKeXzGNVC-7BUNveT&source=gbs_api",
  "http://books.google.com/books/publisher/content?id=ShMIEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70BROgRZLB36fTMheYY_69yQoNdnr1IcwoHSqpJBOz1aDinwg-o0rEvPDMYFF7ulfrH0fwh0U8swVu_uIxMKL0a49mlbYSke6BDTDL8M1ex6lJxOwvw--c1f_alCqpQSYJs5RkK&source=gbs_api",
  "http://books.google.com/books/publisher/content?id=_er2DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70txmR1AA-Zw0Xed9jSzSXTllb-3GheStvf1WRXg1ea3Wn-tF4fTh0NGapjuhb6v0mKjdXTX0XZbyAVtknrIszOg77pZC7tZL_xo0EdDYb5HOxK_-yohpztFCgClD2sh-sMEEy_&source=gbs_api",
  "http://books.google.com/books/publisher/content?id=ZPD4DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71R14VhESS9yzi98C00-Rvv8DIDY_f24wd06SuBn6D-tXcgeYlr63El_5K1vc2RmWH9n7mMdTjkCvq2QUija55GxvOAFVaBhI365b3HGpk7er5bJNmcuvVOvPaWxYe6W6rx10QJ&source=gbs_api",
  "http://books.google.com/books/content?id=SzC5zgEACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70PzofEXfk7fYyFdrdGrgwcuf2ASOjQfCKBuwQXatK5slk9najflltEJKLRa4HkXCwMu1iSafuDhgRBvzHAzeac_butLLvH1yIKl3G6Ztu2f5q4-EBEAXTLEyRGMWhLWbq6sT87&source=gbs_api",
  "http://books.google.com/books/publisher/content?id=p_b1DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73wG1klnokDe4FOeHUchjxxPLyCdQtH5llIcw1H5vC4z9jLXcvTDDzsg-w0TgD-KmrTtuISFXBnovOTjzD3_O8-sp__ETBrbgTXp8ZbQ2e_brihDOv16AzYKoHLUTeLP99EQSbb&source=gbs_api",
  "http://books.google.com/books/publisher/content?id=gxGuDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70t6Gibl3vIE8wRqXccI1x7x_q0lXMhHIGCDxeEPSWYV7s5L7pyFEU0_PnjLDxsyKbsfIYMN9pzyDDoxOf2rlYEHUSbyPrajg4uEqy1ypfPW_ED-vOyddV6hYMB5Y5r-ohyfRHW&source=gbs_api",
];

const Arrow = ({
  direction,
  onClick,
}: {
  direction: string;
  onClick: () => void;
}) => (
  <button
    className={cx(
      "absolute top-1/2 transform -translate-y-1/2 bg-white rounded-md drop-shadow-xl",
      {
        "left-0": direction === "left",
        "right-0": direction === "right",
      }
    )}
    onClick={onClick}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={48}
      width={48}
      viewBox="0 0 24 24"
      fill="#111"
    >
      {direction === "left" && (
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      )}
      {direction === "right" && (
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
      )}
    </svg>
  </button>
);

const Carousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const advance = (forward: boolean) => () => {
    if (containerRef.current) {
      const x = forward
        ? containerRef.current.scrollLeft + containerRef.current.offsetWidth
        : containerRef.current.scrollLeft - containerRef.current.offsetWidth;

      containerRef.current.scrollTo(x, 0);
    }
  };

  return (
    <div className="container px-4 mx-10 relative">
      <div
        className="relative w-full flex gap-6 overflow-x-auto scroll-smooth snap-x snap-always snap-mandatory p-5"
        ref={containerRef}
      >
        {bookImages.map((src) => (
          <div key={src} className="snap-start shrink-0 drop-shadow-lg">
            <Image
              alt="demo image"
              src={src}
              className="shrink-0 w-80 h-40 rounded-lg shadow-xl bg-white"
              width={200}
              height={300}
            />
          </div>
        ))}
      </div>
      <Arrow direction="left" onClick={advance(false)} />
      <Arrow direction="right" onClick={advance(true)} />
    </div>
  );
};

export default Carousel;
