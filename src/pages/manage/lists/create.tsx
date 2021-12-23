import BookListEditor from "components/manage/lists/book-list-editor.client";
import Text, { TextTypes } from "components/common/text";

export default function CreateList() {
  return (
    <div className="container mx-auto px-4">
      <Text as={TextTypes.h1}>Create Book List</Text>
      <BookListEditor />
    </div>
  );
}
