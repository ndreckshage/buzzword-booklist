import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import cx from "classnames";

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & { overrideClassNames?: string };

const TextInput = (props: InputProps) => {
  const { overrideClassNames, ...rest } = props;
  return (
    <input
      className={cx(
        "placeholder:italic placeholder:text-gray-400 block bg-white w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm",
        overrideClassNames
      )}
      type="text"
      {...rest}
    />
  );
};

export default TextInput;
