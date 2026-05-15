export default function Icon({ name, size = 20, fill = 0, className = '' }) {
  return (
    <span
      className={`material-symbols-rounded select-none ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
        lineHeight: 1,
      }}
    >
      {name}
    </span>
  )
}
