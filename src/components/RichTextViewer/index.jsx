export default function RichTextViewer({ content }) {
  if (!content) return <p className="text-[14px] text-gray-400">No description provided.</p>
  return (
    <div
      className="prose prose-sm max-w-none text-[14px] leading-relaxed text-[#1f2f3a]
        prose-headings:text-[#1f2f3a] prose-headings:font-bold
        prose-h1:text-[22px] prose-h2:text-[18px] prose-h3:text-[16px]
        prose-p:my-1 prose-ul:my-1 prose-ol:my-1
        prose-li:my-0.5
        prose-a:text-[#1565c0] prose-a:underline
        prose-strong:text-[#1f2f3a]
        prose-code:bg-[#f4f6f8] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[13px] prose-code:font-mono prose-code:text-[#c62828]
        prose-pre:bg-[#1f2f3a] prose-pre:text-[#e0e0e0] prose-pre:rounded-lg prose-pre:p-4 prose-pre:text-[13px]
        prose-blockquote:border-l-4 prose-blockquote:border-[#064f5d] prose-blockquote:bg-[#f4f8fb] prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-gray-500"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
