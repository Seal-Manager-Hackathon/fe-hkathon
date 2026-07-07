import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import {
  Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote, Undo2, Redo2, Link2,
  Heading1, Heading2, Heading3, RemoveFormatting,
} from 'lucide-react'
import { useEffect, useCallback } from 'react'

export default function RichTextEditor({ value, onChange, placeholder = 'Write something...' }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      LinkExtension.configure({ openOnClick: false }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[180px] px-4 py-3 focus:outline-none text-[14px] leading-relaxed text-[#1f2f3a]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) return null

  const btn = (action, icon, isActive) => (
    <button
      type="button"
      onClick={action}
      className={`cursor-pointer rounded p-1.5 text-[13px] transition-colors ${isActive ? 'bg-[#064f5d] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
    >
      {icon}
    </button>
  )

  return (
    <div className="rounded-lg border border-[#d8e0e6] overflow-hidden focus-within:border-[#064f5d] focus-within:ring-1 focus-within:ring-[#064f5d]/10 transition-colors">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[#e8ecf0] bg-[#fafbfc] px-2 py-1.5">
        {btn(() => editor.chain().focus().toggleBold().run(), <Bold className="h-3.5 w-3.5" />, editor.isActive('bold'))}
        {btn(() => editor.chain().focus().toggleItalic().run(), <Italic className="h-3.5 w-3.5" />, editor.isActive('italic'))}
        {btn(() => editor.chain().focus().toggleStrike().run(), <Strikethrough className="h-3.5 w-3.5" />, editor.isActive('strike'))}
        {btn(() => editor.chain().focus().toggleCode().run(), <Code className="h-3.5 w-3.5" />, editor.isActive('code'))}
        <div className="w-px h-5 bg-[#d8e0e6] mx-1" />
        {btn(() => editor.chain().focus().toggleHeading({ level: 1 }).run(), <Heading1 className="h-3.5 w-3.5" />, editor.isActive('heading', { level: 1 }))}
        {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 className="h-3.5 w-3.5" />, editor.isActive('heading', { level: 2 }))}
        {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 className="h-3.5 w-3.5" />, editor.isActive('heading', { level: 3 }))}
        <div className="w-px h-5 bg-[#d8e0e6] mx-1" />
        {btn(() => editor.chain().focus().toggleBulletList().run(), <List className="h-3.5 w-3.5" />, editor.isActive('bulletList'))}
        {btn(() => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="h-3.5 w-3.5" />, editor.isActive('orderedList'))}
        {btn(() => editor.chain().focus().toggleBlockquote().run(), <Quote className="h-3.5 w-3.5" />, editor.isActive('blockquote'))}
        {btn(setLink, <Link2 className="h-3.5 w-3.5" />, editor.isActive('link'))}
        <div className="w-px h-5 bg-[#d8e0e6] mx-1" />
        {btn(() => editor.chain().focus().undo().run(), <Undo2 className="h-3.5 w-3.5" />, false)}
        {btn(() => editor.chain().focus().redo().run(), <Redo2 className="h-3.5 w-3.5" />, false)}
        {btn(() => editor.chain().focus().clearNodes().unsetAllMarks().run(), <RemoveFormatting className="h-3.5 w-3.5" />, false)}
      </div>
      <EditorContent editor={editor} className="rich-text-editor" />
    </div>
  )
}
