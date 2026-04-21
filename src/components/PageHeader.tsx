const PageHeader = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default PageHeader;
