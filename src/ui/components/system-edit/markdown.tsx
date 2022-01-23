import { useContext, useEffect, useRef, useState } from "react";
import { gql } from "ui/lib/use-data.client";
import { MarkdownComponent } from "api/__generated__/resolvers-types";
import { LayoutContext } from "./container";

export const MarkdownComponentFragment = gql`
  fragment MarkdownComponentFragment on MarkdownComponent {
    id
    text
    backgroundColor
  }
`;

export default function Markdown(props: MarkdownComponent) {
  const { updateMarkdownComponent } = useContext(LayoutContext);
  const [textState, updateText] = useState(props.text);
  const [backgroundColor, updateBackgroundColor] = useState(
    props.backgroundColor
  );
  const [, forceUpdate] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // workaround for a streaming bug, or somethign
  useEffect(() => {
    if (textareaRef.current?.value !== textState) {
      forceUpdate((v) => v + 1);
    }
  }, [textareaRef]);

  useEffect(() => {
    updateText(props.text);
  }, [props.text]);

  return (
    <div>
      <textarea
        value={textState}
        ref={textareaRef}
        className="resize"
        rows={10}
        onChange={(e) => {
          updateText(e.target.value);
        }}
      />
      <div className="bg-gray-50 border my-4 p-4 flex items-center space-x-2">
        <b>Background color:</b>
        <select
          value={backgroundColor}
          onChange={(e) => {
            updateBackgroundColor(e.target.value);
          }}
        >
          {["inherit", "emerald-500", "indigo-500"].map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => {
          updateMarkdownComponent({
            componentId: props.id,
            text: textState,
            backgroundColor,
          });
        }}
      >
        Save Markdown Component
      </button>
    </div>
  );
}
