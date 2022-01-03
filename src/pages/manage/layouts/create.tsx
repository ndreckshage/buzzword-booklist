import { useState } from "react";
import { useRouter } from "next/router";
import Text, { TextTypes } from "ui/components/common/text";
import TextInput from "ui/components/common/text-input";
import { useMutation, gql } from "ui/lib/use-data.client";
import cx from "classnames";

const CREATE_LAYOUT_MUTATION = gql`
  mutation CreateLayout($title: String!) {
    createLayout(title: $title)
  }
`;

export default function CreateLayout() {
  const router = useRouter();
  const [layoutTitle, setLayoutTitle] = useState("");
  const [createLayoutMutation, { isPending }] = useMutation<{
    createLayout: boolean;
  }>(CREATE_LAYOUT_MUTATION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLayoutTitle(e.target.value);
  };

  return (
    <div className="container mx-auto px-4">
      <Text as={TextTypes.h1}>Create Layout</Text>
      <label>
        Layout Title:
        <TextInput
          name="layout_title"
          placeholder="Layout title"
          value={layoutTitle}
          onChange={handleChange}
        />
      </label>
      <button
        className={cx(
          "block bg-blue-500 text-white p-5 rounded-md transition-opacity",
          {
            "opacity-100": !isPending,
            "opacity-50": isPending,
          }
        )}
        onClick={(e) => {
          e.preventDefault();
          createLayoutMutation({ title: layoutTitle }).then((data) => {
            if (data.createLayout) router.push("/manage/layouts");
          });
        }}
      >
        Create layout and get started editing...
      </button>
    </div>
  );
}
