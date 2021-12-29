import React from "react";
import Image from "next/image";

export default function AuthButton({
  currentUser,
}: {
  currentUser: string | null;
}) {
  return (
    <>
      {currentUser ? (
        <>
          <Image
            src={`https://avatars.githubusercontent.com/${currentUser}?s=50`}
            width={50}
            height={50}
          />
          <a href={`https://github.com/${currentUser}`} target="_blank">
            {currentUser}
          </a>
          <button
            onClick={() => {
              // @ts-ignore
              window.location = "/api/auth?logout=true";
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            // @ts-ignore
            window.location = "/api/auth";
          }}
        >
          Login
        </button>
      )}
    </>
  );
}
