import { useState } from "react";
import { useRouter } from "next/router";
import TextInput from "ui/components/common/text-input";
import { useMutation, gql } from "ui/lib/use-data.client";
import cx from "classnames";

const CREATE_LAYOUT_MUTATION = gql`
  mutation createLayoutComponent($title: String!) {
    createLayoutComponent(title: $title)
  }
`;

export default function CreateLayout() {
  const router = useRouter();
  const [layoutTitle, setLayoutTitle] = useState("");
  const [createLayoutMutation, { isPending }] = useMutation<{
    createLayoutComponent: boolean;
  }>(CREATE_LAYOUT_MUTATION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLayoutTitle(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 my-10">
      <h1>Create Layout</h1>
      <label>
        <p>Layout Title:</p>
        <TextInput
          name="layout_title"
          placeholder="Layout title"
          value={layoutTitle}
          onChange={handleChange}
        />
      </label>
      <div className="my-5">
        <button
          className={cx({
            "opacity-100": !isPending,
            "opacity-50": isPending,
          })}
          onClick={(e) => {
            e.preventDefault();
            createLayoutMutation({ title: layoutTitle }).then((data) => {
              if (data.createLayoutComponent) router.push("/manage/layouts");
            });
          }}
        >
          Create layout and get started editing...
        </button>
      </div>
    </div>
  );
}
