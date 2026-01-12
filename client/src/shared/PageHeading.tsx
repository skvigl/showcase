interface PageHeadingProps {
  title?: string;
  children?: React.ReactNode;
}

export const PageHeading: React.FC<PageHeadingProps> = ({ title, children }) => {
  return <h1 className="text-3xl lg:text-5xl font-medium mb-8">{title ?? children}</h1>;
};
