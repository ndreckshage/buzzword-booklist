// @ts-ignore remove when react 18 types supported
import React, { ReactNode, useTransition, useState } from "react";
import { unstable_useRefreshRoot as useRefreshRoot } from "next/rsc";
import cx from "classnames";

const RefreshDemoButton = ({ children }: { children: ReactNode }) => {
  const refreshRoot = useRefreshRoot();
  const [refreshCount, setRefreshCount] = useState(0);
  const [isPending, startTransition] = useTransition({
    timeoutMs: 5000,
  });

  return (
    <div
      className={cx("transition-opacity", {
        "opacity-100": !isPending,
        "opacity-50": isPending,
      })}
    >
      <div className="flex">{children}</div>
      <button
        className="bg-blue-500 text-white p-4 m-4"
        onClick={() => {
          startTransition(() => {
            setRefreshCount(refreshCount + 1);
            refreshRoot({ refreshCount: refreshCount + 1 });
          });
        }}
      >
        Refetch all
      </button>
    </div>
  );
};

export default RefreshDemoButton;
