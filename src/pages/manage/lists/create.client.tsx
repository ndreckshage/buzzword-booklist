import { useState } from "react";
import { useRouter } from "next/router";
import TextInput from "ui/components/common/text-input";
import { useMutation, gql } from "ui/lib/use-data.client";
import cx from "classnames";
import slugify from "slugify";

const CREATE_LIST_MUTATION = gql`
  mutation CreateList($title: String!) {
    createList(title: $title)
  }
`;

export default function CreateList() {
  const router = useRouter();
  const [listTitle, setListTitle] = useState("");
  const [createListMutation, { isPending }] =
    useMutation<{ createList: boolean }>(CREATE_LIST_MUTATION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListTitle(e.target.value);
  };

  const listKey = slugify(listTitle, { lower: true, strict: true });
  // const expectedUrl = `/lists/${listKey}`;
  const expectedUrl = `/lists?list=${listKey}`;
  // const manageUrl = `/manage/lists/${listKey}/edit`;
  const manageUrl = `/manage/lists/edit?list=${listKey}`;

  return (
    <div className="container mx-auto px-4 my-5 md:my-10">
      <h1>Create Book List</h1>
      <label>
        <p>List Title:</p>
        <TextInput
          name="list_title"
          placeholder="List title"
          value={listTitle}
          onChange={handleChange}
        />
      </label>
      {listKey && <p>List URL: {expectedUrl}</p>}
      <div className="my-5">
        <button
          className={cx("transition-opacity", {
            "opacity-100": !isPending,
            "opacity-50": isPending,
          })}
          onClick={(e) => {
            e.preventDefault();
            createListMutation({ title: listTitle }).then((data) => {
              if (data.createList) router.push(manageUrl);
            });
          }}
        >
          Create list and get started adding books...
        </button>
      </div>
    </div>
  );
}
