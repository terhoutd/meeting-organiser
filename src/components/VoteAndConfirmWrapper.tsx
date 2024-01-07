export function VoteAndConfirmWrapper({
  children,
  horizontal = false,
}: {
  children: React.ReactNode;
  horizontal?: boolean;
}) {
  return (
    <div className="flex h-screen flex-col">
      <div className="mb-[61px] h-screen w-full overflow-y-auto overflow-x-hidden lg:mx-auto lg:mb-0 lg:mt-5 lg:w-auto ">
        <div
          className={`flex ${
            horizontal ? "flex-row" : "flex-col"
          } bg-white lg:h-[700px] lg:flex-row  `}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
