import React, { useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "components/RichTextEditor/RichTextEditor.css";

const Quill = ReactQuill.Quill;
var Font = Quill.import("formats/font");
Font.whitelist = Font.whitelist.concat([
  "Roboto",
  "SegoeUI",
  "Montserrat",
  "Lato",
  "Rubik",
]);
Quill.register(Font, true);

interface MyRichEditorProps {
  isDebug?: boolean | false;
  initValue?: any;
  handleEditorCallback?: (currentValue: string) => void;
}

const MyRichEditor = ({
  isDebug,
  handleEditorCallback,
  initValue,
}: MyRichEditorProps) => {
  const [value, setValue] = useState(initValue || "");
  const quillRef = useRef() as any;

  const videoHandler = async () => {
    const quillObj = quillRef?.current?.getEditor();
    const range = quillObj?.getSelection();
    var value = prompt("Please copy paste the video url here.");
    if (value) {
      quillObj.editor.insertEmbed(range.index, "video", value, "user");
    }
  };

  const imageHandler = async () => {
    const quillObj = quillRef?.current?.getEditor();

    // const range = quillObj?.getSelection();
    // var value = prompt("Please copy paste the image url here.");
    // if (value) {
    //   quillObj.editor.insertEmbed(range.index, "image", value);
    // }

    const tooltip = quillObj?.theme.tooltip;
    const originalSave = tooltip.save;
    const originalHide = tooltip.hide;

    tooltip.save = function () {
      const range = quillObj?.getSelection(true);
      const value = this.textbox.value;
      if (value) {
        quillObj.editor.insertEmbed(range.index, "image", value);
      }
    };
    // Called on hide and save.
    tooltip.hide = function () {
      tooltip.save = originalSave;
      tooltip.hide = originalHide;
      tooltip.hide();
    };
    tooltip.edit("image");
    tooltip.textbox.placeholder = "Embed URL";

    // const input = document.createElement("input");
    // input.setAttribute("type", "file");
    // input.setAttribute("accept", "image/*");
    // input.click();
    // input.onchange = async () => {
    //   var file: any = input && input.files ? input.files[0] : null;

    //   console.log(file);
    //   const quillObj = quillRef?.current?.getEditor();
    //   const range = quillObj?.getSelection();

    //   if (file) {
    //     const formData = new FormData();
    //     formData.append("file", file);

    //     const responseUpload = await fetch("/api/files", {
    //       method: "POST",
    //       body: formData,
    //     });

    //     const data = await responseUpload.json();
    //     if (data.success === true) {
    //       quillObj.editor.insertEmbed(range.index, "image", data.data.url);
    //     } else {
    //       console.error(data);
    //     }
    //   }
    // };
  };

  // const modules = {
  //   toolbar: [
  //     [
  //       {
  //         font: [],
  //       },
  //       {
  //         size: [false, "small", "large", "huge"],
  //       },
  //     ],

  //     // [{ header: [1, 2, 3, 4, 5, 6, false] }],

  //     ["bold", "italic", "underline", "strike"],

  //     [{ color: [] }, { background: [] }],

  //     [
  //       // { direction: "rtl" }, // text direction
  //       { script: "super" }, // superscript
  //       { script: "sub" }, //subscript
  //     ],

  //     [{ header: 1 }, { header: 2 }, "blockquote", "code-block"],

  //     [
  //       { direction: "rtl" }, // text direction,
  //       { align: [] },
  //     ],

  //     [
  //       { list: "ordered" },
  //       { list: "bullet" },
  //       { indent: "-1" },
  //       { indent: "+1" },
  //     ],

  //     ["link", "image", "video"],

  //     // ["clean"],
  //   ],
  //   // handlers: {
  //   //   image: imageHandler,
  //   // },
  // };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [
            {
              font: Font.whitelist,
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
        handlers: {
          image: imageHandler,
          // video: videoHandler,
        },
      },
    }),
    []
  );

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
        ref={quillRef}
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
