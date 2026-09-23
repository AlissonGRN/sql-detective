import { Link } from 'react-router'

interface MenuOptionProps {
  label: string
  to: string
  primary?: boolean
}

export function MenuOption({
  label,
  to,
  primary = false,
}: MenuOptionProps) {
  const baseClasses = `
    group
    relative
    flex
    w-full
    items-center
    justify-between
    border-l-4
    px-5
    py-4
    text-left
    font-mono
    text-sm
    font-bold
    tracking-wide
    shadow-md
    transition
    duration-150
    hover:translate-x-2
  `

  const variantClasses = primary
    ? `
        border-[#4e1414]
        bg-[#7b2020]
        text-[#f0e8d7]
        hover:bg-[#922828]
      `
    : `
        border-transparent
        bg-[#e3d9bd]
        text-[#27231c]
        hover:border-[#7b2020]
        hover:bg-[#eee7d3]
      `

  return (
    <Link
      to={to}
      className={`${baseClasses} ${variantClasses}`}
    >
      <span>{label}</span>

      <span
        className="
          translate-x-[-6px]
          opacity-0
          transition
          duration-150
          group-hover:translate-x-0
          group-hover:opacity-100
        "
      >
        →
      </span>
    </Link>
  )
}