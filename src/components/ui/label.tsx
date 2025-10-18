import React from "react";

const Label = ({
  children,
  className,
  htmlFor,
}: {
  children: React.ReactNode;
  className?: string;
  htmlFor: string;
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={"text-xs  font-semibold " + (className ?? "")}
    >
      {children}
    </label>
  );
};

export default Label;
