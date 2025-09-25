"use client";

import * as React from "react";

// --- Lib ---
import { parseShortcutKeys } from "@entities/editor/tiptap-utils";

// --- Hooks ---
import { useTiptapEditor } from "@/02-features/editor/hooks/useTiptapEditor";

// --- Tiptap UI ---
import type {
  UndoRedoAction,
  UseUndoRedoConfig,
} from "@/03-widgets/common/tiptap-ui/undo-redo-button";
import {
  UNDO_REDO_SHORTCUT_KEYS,
  useUndoRedo,
} from "@/03-widgets/common/tiptap-ui/undo-redo-button";

// --- UI Primitives ---
import { Badge } from "@/03-widgets/common/tiptap-ui-primitive/badge";
import type { ButtonProps } from "@/03-widgets/common/tiptap-ui-primitive/button";
import { Button } from "@/03-widgets/common/tiptap-ui-primitive/button";

export interface UndoRedoButtonProps extends Omit<ButtonProps, "type">, UseUndoRedoConfig {
  /**
   * Optional text to display alongside the icon.
   */
  text?: string;
  /**
   * Optional show shortcut keys in the button.
   * @default false
   */
  showShortcut?: boolean;
}

export function HistoryShortcutBadge({
  action,
  shortcutKeys = UNDO_REDO_SHORTCUT_KEYS[action],
}: {
  action: UndoRedoAction;
  shortcutKeys?: string;
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for triggering undo/redo actions in a Tiptap editor.
 *
 * For custom button implementations, use the `useHistory` hook instead.
 */
export const UndoRedoButton = React.forwardRef<HTMLButtonElement, UndoRedoButtonProps>(
  (
    {
      editor: providedEditor,
      action,
      text,
      hideWhenUnavailable = false,
      onExecuted,
      showShortcut = false,
      onClick,
      children,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const { isVisible, handleAction, label, canExecute, Icon, shortcutKeys } = useUndoRedo({
      editor,
      action,
      hideWhenUnavailable,
      onExecuted,
    });

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleAction();
      },
      [handleAction, onClick],
    );

    if (!isVisible) {
      return null;
    }

    return (
      <Button
        type="button"
        disabled={!canExecute}
        data-style="ghost"
        data-disabled={!canExecute}
        role="button"
        tabIndex={-1}
        aria-label={label}
        tooltip={label}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}>
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
            {showShortcut && <HistoryShortcutBadge action={action} shortcutKeys={shortcutKeys} />}
          </>
        )}
      </Button>
    );
  },
);

UndoRedoButton.displayName = "UndoRedoButton";
