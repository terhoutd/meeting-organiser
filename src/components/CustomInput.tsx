export function CustomInput({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) {
  console.log("CustomInput field", field);
  console.log("CustomInput errors", errors);

  return <input className=" block h-10 w-full border-2 px-2" type="text" {...props} {...field} />;
}
