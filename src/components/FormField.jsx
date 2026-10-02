/**
 * Label + input + validation message.
 * Pass the object returned by `bind(name)` plus label/id/type etc.
 * Use `as="select"` and children for a dropdown.
 */
export default function FormField({ label, id, error, as: Tag = "input", className = "form-group", children, ...inputProps }) {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <Tag id={id} aria-invalid={error ? "true" : undefined} aria-describedby={error ? `${id}-error` : undefined} {...inputProps}>
        {children}
      </Tag>
      {error && (
        <span id={`${id}-error`} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
