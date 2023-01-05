import dynamic from "next/dynamic";
import React, { useState } from "react";

import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const MyRichEditor = () => {
  const [value, setValue] = useState("");

  const modules = {
    toolbar: [
      [
        {
          font: [],
        },
      ],

      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      ["bold", "italic", "underline", "strike", "blockquote"],

      [{ color: [] }, { background: [] }],

      [{ align: [] }],

      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [
        { direction: "rtl" }, // text direction
        { script: "super" }, // superscript
        { script: "sub" }, //subscript
      ],
      ["link", "image", "video"],

      ["clean"],
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
    "background",
    "color",
    "list",
    "bullet",
    "indent",
    "direction",
    "script",
    "link",
    "image",
    "video",
  ];

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        formats={formats}
      />
      <div>
        Your input text
        <div dangerouslySetInnerHTML={{ __html: value }} />
      </div>
    </div>
  );
};
export default MyRichEditor;
