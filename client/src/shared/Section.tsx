import React, { PropsWithChildren } from "react";

import { Container } from "./Container";
import { cn } from "./utils";

interface SectionProps extends PropsWithChildren {
  title?: string;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ title, className, children }) => {
  return (
    <section className={cn("p-6 lg:p-8", className)}>
      <Container>
        {title && <h2 className="text-3xl lg:text-4xl font-medium mb-8">{title}</h2>}
        {children}
      </Container>
    </section>
  );
};
