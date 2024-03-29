export function CustomInput({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) {
  return (
    <input
      className={`block h-12 w-full border-2 p-2 ${!!errors[field.name] ? "border-red-500" : ""}`}
      type="text"
      {...props}
      {...field}
    />
  );
}
