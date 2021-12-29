import { ReactNode } from "react";
import cx from "classnames";

export enum TextTypes {
  h1 = "h1",
  h2 = "h2",
  h3 = "h3",
  h4 = "h4",
  h5 = "h5",
  h6 = "h6",
  p = "p",
  span = "span",
}

type Props = {
  children: ReactNode;
  as: TextTypes;
};

const Text = (props: Props) => (
  <props.as
    className={cx({
      "text-xl": props.as === TextTypes.h1,
      "text-green-500": props.as === TextTypes.h1,
      "my-5": props.as === TextTypes.h1,
    })}
  >
    {props.children}
  </props.as>
);

export default Text;
