"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toggle } from "../ui/toggle";
import {
  Bold,
  ItalicIcon,
  List,
  ListOrderedIcon,
  Strikethrough,
} from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

const Tiptap = ({ val }: { val: string }) => {
  const { setValue } = useFormContext();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-4",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-4",
          },
        },
      }),
    ],
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setValue("description", content, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    editorProps: {
      attributes: {
        class:
          "w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
    content: val,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor?.isEmpty) {
      editor.commands.setContent(val);
    }
  }, [val]);

  return (
    <div className="flex flex-col gap-2">
      {editor && (
        <div className="border border-input rounded-md">
          <Toggle
            pressed={editor.isActive("bold")}
            onPressedChange={() => {
              editor.chain().focus().toggleBold().run();
            }}
            size={"sm"}
          >
            <Bold className="w-4 h-4" />
          </Toggle>

          <Toggle
            pressed={editor.isActive("italic")}
            onPressedChange={() => {
              editor.chain().focus().toggleItalic().run();
            }}
            size={"sm"}
          >
            <ItalicIcon className="w-4 h-4" />
          </Toggle>

          <Toggle
            pressed={editor.isActive("strike")}
            onPressedChange={() => {
              editor.chain().focus().toggleStrike().run();
            }}
            size={"sm"}
          >
            <Strikethrough className="w-4 h-4" />
          </Toggle>

          <Toggle
            pressed={editor.isActive("orderedList")}
            onPressedChange={() => {
              editor.chain().focus().toggleOrderedList().run();
            }}
            size={"sm"}
          >
            <ListOrderedIcon className="w-4 h-4" />
          </Toggle>

          <Toggle
            pressed={editor.isActive("bulletList")}
            onPressedChange={() => {
              editor.chain().focus().toggleBulletList().run();
            }}
            size={"sm"}
          >
            <List className="w-4 h-4" />
          </Toggle>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
