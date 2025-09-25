import { SimpleEditor } from "@/03-widgets/common/tiptap-templates/simple/simple-editor";
import "@app/styles/variables.css";

function TipTapEditor() {
  return (
    <div className="flex justify-center">
      <SimpleEditor />
    </div>
  );
}

export default TipTapEditor;
