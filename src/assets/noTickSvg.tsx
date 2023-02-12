export default function NoTickSvg({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-label="Cross"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 14.8537L6.44472 20.409C5.65669 21.197 4.37905 21.197 3.59102 20.409C2.80299 19.621 2.80299 18.3433 3.59102 17.5553L9.1463 12L3.59102 6.44472C2.80299 5.65669 2.80299 4.37905 3.59102 3.59102C4.37905 2.80299 5.65669 2.80299 6.44472 3.59102L12 9.1463L17.5553 3.59102C18.3433 2.80299 19.621 2.80299 20.409 3.59102C21.197 4.37905 21.197 5.65669 20.409 6.44472L14.8537 12L20.409 17.5553C21.197 18.3433 21.197 19.621 20.409 20.409C19.621 21.197 18.3433 21.197 17.5553 20.409L12 14.8537Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
