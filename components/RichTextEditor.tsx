// import { useState, useEffect } from "react";

// import { Editor, EditorState, convertFromRaw, convertToRaw } from "draft-js";
// import "draft-js/dist/Draft.css";

// import dynamic from "next/dynamic";
// // import apiClient from '../api/api_client'

// // const Editor = dynamic(
// //   () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
// //   { ssr: false }
// // );

// import DOMPurify from "dompurify";

// function MyEditor() {
//   const [editorState, setEditorState] = useState(() =>
//     EditorState.createEmpty()
//   );
//   const [convertedContent, setConvertedContent] = useState(null);
//   // useEffect(() => {
//   //   let html = convertToRaw(editorState.getCurrentContent());
//   //   setConvertedContent(html);
//   // }, [editorState]);

//   console.log(convertedContent);

//   const uploadImageCallBack = async (file) => {
//     // const imgData = await apiClient.uploadInlineImageForArticle(file);
//     return Promise.resolve({
//       data: {
//         link: "${process.env.NEXT_PUBLIC_API_URL}${imgData[0].formats.small.url}",
//       },
//     });
//   };

//   return (
//     <div>
//       <Editor
//         editorState={editorState}
//         onEditorStateChange={setEditorState}
//         toolbarClassName="toolbar-class"
//         wrapperClassName="wrapper-class"
//         editorClassName="editor-class"
//       />
//       <div
//         className="preview"
//         // dangerouslySetInnerHTML={createMarkup(convertedContent)}
//       ></div>
//     </div>
//   );
// }

// function createMarkup(html) {
//   return {
//     __html: DOMPurify.sanitize(html),
//   };
// }

// export default MyEditor;

import dynamic from "next/dynamic";
import React, { useState } from "react";

import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const MyRichEditor = () => {
  const [value, setValue] = useState("");
  const modules = {
    toolbar: [
      // [
      //   {
      //     font: Font.whitelist,
      //   },
      // ],

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
