import { useState } from "react";
import { useRouter } from "next/router";
import Text, { TextTypes } from "components/common/text";
import TextInput from "components/common/text-input";
import fetchGraphQL from "lib/graphql-request";
import slugify from "slugify";

export default function CreateList() {
  const router = useRouter();
  const [listTitle, setListTitle] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListTitle(e.target.value);
  };

  const listSlug = slugify(listTitle, { lower: true, strict: true });
  // const expectedUrl = `/collections/lists/${listSlug}`;
  const expectedUrl = `/collections/lists?list=${listSlug}`;
  // const manageUrl = `/manage/lists/${listSlug}/edit`;
  const manageUrl = `/manage/lists/edit?list=${listSlug}`;

  return (
    <div className="container mx-auto px-4">
      <Text as={TextTypes.h1}>Create Book List</Text>
      <Text as={TextTypes.h3}>
        List title and URL cannot be changed once created!
      </Text>
      <label>
        List Title:
        <TextInput
          name="list_title"
          placeholder="List title"
          value={listTitle}
          onChange={handleChange}
        />
      </label>
      {listSlug && <Text as={TextTypes.p}>List URL: {expectedUrl}</Text>}
      <button
        className="block bg-blue-500 text-white p-5 rounded-md"
        onClick={async (e) => {
          e.preventDefault();

          const response = await fetchGraphQL(
            `
              mutation CreateList($title: String!) {
                createList(title: $title)
              }
            `,
            { title: listTitle }
          );

          if (response.data.createList) {
            router.push(manageUrl);
          }
        }}
      >
        Create list and get started adding books...
      </button>
    </div>
  );
}
