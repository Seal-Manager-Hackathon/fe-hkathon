export default function Footer({ columns, bottomLinks }) {
  return (
    <footer className="bg-[#edf4f6] px-10 pb-6 pt-12">
      <div className="mx-auto max-w-[1100px]">
        <div className="grid grid-cols-4 gap-8 pb-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-[15px] font-semibold text-[#1f2f3a]">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[14px] text-gray-500 transition-colors hover:text-[#064f5d] cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#d0dce3]" />

        <div className="flex items-center justify-between pt-5">
          <p className="text-[13px] text-gray-400">
            &copy; 2026 SEAL Hackathon. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {bottomLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] text-gray-400 transition-colors hover:text-[#064f5d] cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
