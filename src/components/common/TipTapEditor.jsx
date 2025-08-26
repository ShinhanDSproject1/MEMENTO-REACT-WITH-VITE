import React from "react";
import { SimpleEditor } from "@/components/common/tiptap-templates/simple/simple-editor";
import "@/styles/common/tiptap-editor.css";

function TipTapEditor() {
  return (
    <div className="flex justify-center">
      <SimpleEditor />
    </div>
  );
}

export default TipTapEditor;
