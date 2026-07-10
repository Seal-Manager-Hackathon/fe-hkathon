import Avatar from '../../../components/Avatar'

/**
 * Avatar upload section for the edit user page.
 * Receives data and handlers via props — no API import.
 *
 * @param {{
 *   src: string,
 *   name: string,
 *   hasFile: boolean,
 *   onFileChange: (file: File|null) => void,
 *   onRemove: () => void,
 * }} props
 */
export default function UserEditAvatar({ src, name, hasFile, onFileChange, onRemove }) {
  function handleChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    onFileChange(file)
  }

  return (
    <div className="mb-6 flex items-center gap-4">
      <Avatar src={src} name={name} size="h-16 w-16" textSize="text-[18px]" />
      <div className="flex items-center gap-2">
        <label className="cursor-pointer rounded-lg bg-[#f4f6f8] px-3 py-2 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]">
          Change Photo
          <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
        </label>
        {hasFile && (
          <button
            onClick={onRemove}
            className="cursor-pointer rounded-lg bg-[#fce4ec] px-3 py-2 text-[13px] font-semibold text-[#c62828] hover:bg-[#ffcdd2]"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}
