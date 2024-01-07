export function CustomTextarea({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) {
  return (
    <textarea
      className=" block h-16 w-full border-2 p-2"
      maxlength="3000"
      wrap="soft"
      {...props}
      {...field}
    />
  );
}
