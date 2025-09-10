"use client";

import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import * as React from "react";

// --- Tiptap Core Extensions ---
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Selection } from "@tiptap/extensions";
import { StarterKit } from "@tiptap/starter-kit";

// --- UI Primitives ---
import { Button } from "@/widgets/common/tiptap-ui-primitive/button";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/widgets/common/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { HorizontalRule } from "@/widgets/common/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import { ImageUploadNode } from "@/widgets/common/tiptap-node/image-upload-node/image-upload-node-extension";
import "@widgets/common/tiptap-node/blockquote-node/blockquote-node.scss";
import "@widgets/common/tiptap-node/code-block-node/code-block-node.scss";
import "@widgets/common/tiptap-node/heading-node/heading-node.scss";
import "@widgets/common/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@widgets/common/tiptap-node/image-node/image-node.scss";
import "@widgets/common/tiptap-node/list-node/list-node.scss";
import "@widgets/common/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { CodeBlockButton } from "@/widgets/common/tiptap-ui/code-block-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
} from "@/widgets/common/tiptap-ui/color-highlight-popover";
import { HeadingDropdownMenu } from "@/widgets/common/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/widgets/common/tiptap-ui/image-upload-button";
import { LinkContent } from "@/widgets/common/tiptap-ui/link-popover";
import { TextAlignButton } from "@/widgets/common/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/widgets/common/tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "@/widgets/common/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/widgets/common/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/widgets/common/tiptap-icons/link-icon";

// --- Hooks ---
import { useCursorVisibility } from "@hooks/device/useCursorVisibility";
import { useIsMobile } from "@hooks/device/useMobile";
import { useWindowSize } from "@hooks/dom/useWindowSize";

// --- Lib ---
import {
  handleImageUpload,
  MAX_FILE_SIZE,
} from "@entities/editor/tiptap-utils";

// --- Styles ---
import "@widgets/common/tiptap-templates/simple/simple-editor.scss";

// ======================
//      NEW: Props
// ======================
export interface SimpleEditorProps {
  /** HTML string. 제공하면 controlled 모드로 동작 */
  value?: string;
  /** 초기값 (uncontrolled). value가 없을 때만 사용 */
  defaultValue?: string;
  /** 내용 변경 시 호출 (HTML 전달) */
  onChange?: (html: string) => void;
  /** 에디터 wrapper 추가 클래스 */
  className?: string;
  /** 편집 가능 여부 */
  editable?: boolean;
  /** 에디터 최소 높이 (예: 320, "20rem") */
  minHeight?: number | string;
}

const MainToolbarContent = ({
  isMobile,
  onHighlighterClick,
  onLinkClick,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
}) => {
  return (
    <>
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <ColorHighlightPopover />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link";
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
);

export function SimpleEditor({
  value,
  defaultValue,
  onChange,
  className,
  editable = true,
  minHeight = 320,
}: SimpleEditorProps) {
  const isMobile = useIsMobile();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main");
  const toolbarRef = React.useRef<HTMLDivElement>(null);

  // 초기 content: controlled이면 value, 아니면 defaultValue, 둘 다 없으면 빈 문자열
  const initialContent = value ?? defaultValue ?? "";

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editable,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
        style: `min-height: ${
          typeof minHeight === "number" ? `${minHeight}px` : minHeight
        };`,
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content: initialContent,
    // 에디터 내부 변경 → 부모로 HTML 전달
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  // 외부 value가 바뀌면 에디터와 동기화 (controlled 모드)
  React.useEffect(() => {
    if (!editor) return;
    if (value === undefined) return; // uncontrolled 모드
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // editable prop 변경 반영
  React.useEffect(() => {
    if (!editor) return;
    editor.setEditable(!!editable);
  }, [editable, editor]);

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  return (
    <div className={`simple-editor-wrapper ${className ?? ""}`}>
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </div>
  );
}
