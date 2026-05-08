"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Minus,
  Link2,
  Image as ImageIcon,
  Upload,
  X,
  Undo,
  Redo,
  Type,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (element) => element.getAttribute("width") || element.style.width || "100%",
        renderHTML: (attributes) => ({
          width: attributes.width,
          style: `width: ${attributes.width}; max-width: 100%; height: auto;`,
        }),
      },
      dataAlign: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align") || "center",
        renderHTML: (attributes) => {
          const align = attributes.dataAlign || "center";
          const margin =
            align === "left"
              ? "margin-left: 0; margin-right: auto;"
              : align === "right"
                ? "margin-left: auto; margin-right: 0;"
                : "margin-left: auto; margin-right: auto;";

          return {
            "data-align": align,
            style: `display: block; ${margin}`,
          };
        },
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const widthStyle = HTMLAttributes.width
      ? `width: ${HTMLAttributes.width}; max-width: 100%; height: auto;`
      : "max-width: 100%; height: auto;";
    const align = HTMLAttributes["data-align"] || "center";
    const margin =
      align === "left"
        ? "margin-left: 0; margin-right: auto;"
        : align === "right"
          ? "margin-left: auto; margin-right: 0;"
          : "margin-left: auto; margin-right: auto;";

    return [
      "img",
      mergeAttributes(HTMLAttributes, {
        style: `${widthStyle} display: block; ${margin}`,
      }),
    ];
  },
});

export default function BlogEditor({ value, onChange }: Props) {
  const lowlight = createLowlight();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      ResizableImage,
      CodeBlockLowlight.configure({ lowlight }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none min-h-[400px] focus:outline-none px-6 py-4",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState("");
  const imageAttrs = editor.getAttributes("image") as { width?: string; dataAlign?: string };
  const imageWidthPercent = Number.parseInt((imageAttrs.width || "100%").replace("%", ""), 10) || 100;

  const openLinkDialog = () => {
    setLinkUrl((editor.getAttributes("link") as { href?: string }).href || "");
    setLinkError("");
    setIsLinkDialogOpen(true);
  };

  const applyLink = () => {
    const trimmed = linkUrl.trim();
    if (!trimmed) {
      setLinkError("Please enter a URL.");
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
    setLinkUrl("");
    setLinkError("");
    setIsLinkDialogOpen(false);
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkUrl("");
    setLinkError("");
    setIsLinkDialogOpen(false);
  };

  const updateImageWidth = (value: string) => {
    const nextValue = Number.parseInt(value, 10);
    if (!Number.isFinite(nextValue)) return;
    const clamped = Math.min(100, Math.max(1, nextValue));
    editor.chain().focus().updateAttributes("image", { width: `${clamped}%` }).run();
  };

  const insertImageUrl = () => {
    const trimmed = imageUrl.trim();
    if (!trimmed) {
      setImageError("Please enter an image URL.");
      return;
    }

    editor
      .chain()
      .focus()
      .setImage({ src: trimmed })
      .updateAttributes("image", { width: "100%", dataAlign: "center" })
      .run();
    setImageUrl("");
    setImageError("");
    setIsImageDialogOpen(false);
  };

  const uploadEditorImage = async (file?: File) => {
    if (!file) return;

    setUploadingImage(true);
    setImageError("");

    try {
      const form = new FormData();
      form.append("file", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: form,
      });
      const data = (await response.json()) as { url?: string; message?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.message || "Upload failed");
      }

      editor
        .chain()
        .focus()
        .setImage({ src: data.url })
        .updateAttributes("image", { width: "100%", dataAlign: "center" })
        .run();
      setImageUrl("");
      setIsImageDialogOpen(false);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Unable to upload image");
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 p-3 bg-gradient-to-b from-gray-50 to-white">
      {/* History */}
      <div className="flex gap-0.5 border-r border-gray-300 pr-2 mr-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          tooltip="Undo"
          disabled={!editor.can().undo()}
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          tooltip="Redo"
          disabled={!editor.can().redo()}
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Text Type */}
      <div className="flex gap-0.5 border-r border-gray-300 pr-2 mr-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive("paragraph")}
          tooltip="Paragraph"
        >
          <Type className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          tooltip="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          tooltip="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          tooltip="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Text Style */}
      <div className="flex gap-0.5 border-r border-gray-300 pr-2 mr-1">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          tooltip="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          tooltip="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          tooltip="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          tooltip="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
          tooltip="Inline Code"
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Lists */}
      <div className="flex gap-0.5 border-r border-gray-300 pr-2 mr-1">
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          tooltip="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          tooltip="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Alignment */}
      <div className="flex gap-0.5 border-r border-gray-300 pr-2 mr-1">
        <ToolbarButton
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          tooltip="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          tooltip="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          tooltip="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Quote / Divider */}
      <div className="flex gap-0.5 border-r border-gray-300 pr-2 mr-1">
        <ToolbarButton
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          tooltip="Block Quote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          tooltip="Horizontal Line"
        >
          <Minus className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Media */}
      <div className="flex gap-0.5">
        <ToolbarButton
          onClick={openLinkDialog}
          active={editor.isActive("link")}
          tooltip="Insert Link"
        >
          <Link2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            setImageError("");
            setIsImageDialogOpen(true);
          }}
          disabled={uploadingImage}
          tooltip={uploadingImage ? "Uploading image" : "Insert Image"}
        >
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => uploadEditorImage(event.target.files?.[0])}
        />
      </div>

      {editor.isActive("image") && (
        <div className="flex items-center gap-1 border-l border-gray-300 pl-2 ml-1">
          <label className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-700">
            W
            <input
              type="number"
              min={1}
              max={100}
              value={imageWidthPercent}
              onChange={(event) => updateImageWidth(event.target.value)}
              className="h-7 w-14 rounded-md border border-gray-200 px-2 text-sm font-semibold outline-none focus:border-blue-400"
              title="Image width percent"
            />
            %
          </label>
          <ToolbarButton
            active={(imageAttrs.dataAlign || "center") === "left"}
            onClick={() => editor.chain().focus().updateAttributes("image", { dataAlign: "left" }).run()}
            tooltip="Align image left"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            active={(imageAttrs.dataAlign || "center") === "center"}
            onClick={() => editor.chain().focus().updateAttributes("image", { dataAlign: "center" }).run()}
            tooltip="Align image center"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            active={(imageAttrs.dataAlign || "center") === "right"}
            onClick={() => editor.chain().focus().updateAttributes("image", { dataAlign: "right" }).run()}
            tooltip="Align image right"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
        </div>
      )}

      {isLinkDialogOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 px-4 py-6"
          onClick={() => setIsLinkDialogOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Insert Link</h3>
                <p className="mt-1 text-sm text-gray-500">Paste a URL for the selected text.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsLinkDialogOpen(false)}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">
              URL
            </label>
            <input
              type="url"
              value={linkUrl}
              onChange={(event) => {
                setLinkUrl(event.target.value);
                setLinkError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applyLink();
                }
              }}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
              autoFocus
            />

            <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {editor.isActive("link") && (
                <button
                  type="button"
                  onClick={removeLink}
                  className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Remove Link
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsLinkDialogOpen(false)}
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyLink}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                OK
              </button>
            </div>

            {linkError && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {linkError}
              </p>
            )}
          </div>
        </div>
      )}

      {isImageDialogOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 px-4 py-6"
          onClick={() => setIsImageDialogOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Insert Image</h3>
                <p className="mt-1 text-sm text-gray-500">Paste an image URL or upload from your computer.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsImageDialogOpen(false)}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(event) => {
                setImageUrl(event.target.value);
                setImageError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  insertImageUrl();
                }
              }}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
              autoFocus
            />

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={insertImageUrl}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Insert URL
              </button>
              <button
                type="button"
                disabled={uploadingImage}
                onClick={() => imageInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-600 transition hover:border-blue-400 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Upload className="h-4 w-4" />
                {uploadingImage ? "Uploading..." : "Import Image"}
              </button>
            </div>

            {imageError && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {imageError}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ToolbarButton({
  active,
  disabled,
  onClick,
  children,
  tooltip,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tooltip: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`
        relative p-2 rounded-lg transition-all duration-150
        ${
          active
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
      `}
    >
      {children}
    </button>
  );
}
