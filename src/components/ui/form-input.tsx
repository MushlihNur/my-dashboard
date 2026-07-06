interface FormInputProps {
  label: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  formatNumber?: boolean
}
export default function FormInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  formatNumber = false,
}: FormInputProps) {

  function formatDisplay(val: string): string {
    const numeric = val.replace(/\D/g, "")
    if (!numeric) return ""
    return new Intl.NumberFormat("id-ID").format(Number(numeric))
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!formatNumber || !onChange) {
      onChange?.(e)
      return
    }

    const raw = e.target.value.replace(/\D/g, "")
    const syntheticEvent = {
      ...e,
      target: { ...e.target, value: raw },
    } as React.ChangeEvent<HTMLInputElement>

    onChange(syntheticEvent)
  }

  const displayValue = formatNumber && value
    ? formatDisplay(value)
    : value

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-c3">{label}</label>
      <input 
        type={formatNumber ? "text" : type} 
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        className="w-full px-3 py-2 text-sm border border-c4 rounded-lg outline-none focus:ring-2 focus:ring-c3 focus:border-transparent transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  )
}