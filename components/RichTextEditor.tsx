import dynamic from "next/dynamic";
import React, { useState } from "react";

import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface MyRichEditorProps {
  isDebug?: boolean | false;
  handleEditorCallback?: (currentValue: string) => void;
}

const MyRichEditor = ({ isDebug, handleEditorCallback }: MyRichEditorProps) => {
  const [value, setValue] = useState("");

  const modules = {
    toolbar: [
      [
        {
          font: [],
        },
        {
          size: [false, "small", "large", "huge"],
        },
      ],

      // [{ header: [1, 2, 3, 4, 5, 6, false] }],

      ["bold", "italic", "underline", "strike"],

      [{ color: [] }, { background: [] }],

      [
        // { direction: "rtl" }, // text direction
        { script: "super" }, // superscript
        { script: "sub" }, //subscript
      ],

      [{ header: 1 }, { header: 2 }, "blockquote", "code-block"],

      [
        { direction: "rtl" }, // text direction,
        { align: [] },
      ],

      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],

      ["link", "image", "video"],

      // ["clean"],
    ],
  };

  const formats = [
    "font",
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "background",
    "align",
    "color",
    "list",
    "bullet",
    "indent",
    "direction",
    "script",
    "link",
    "image",
    "video",
    // "clean",
  ];

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (handleEditorCallback) {
      handleEditorCallback(newValue);
    }
  };

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
      />
      {isDebug && (
        <div>
          Your input text
          <div dangerouslySetInnerHTML={{ __html: value }} />
        </div>
      )}
    </div>
  );
};
export default MyRichEditor;
