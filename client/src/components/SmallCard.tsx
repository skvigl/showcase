import Image from "next/image";

import { BaseCard } from "@/shared/BaseCard";

interface SmallCardProps {
  src: string;
  title: string;
  subtitle: string;
}

export const SmallCard: React.FC<SmallCardProps> = ({ src, title, subtitle }) => {
  return (
    <BaseCard className={"grid grid-cols-[auto_1fr] gap-4 items-center min-h-24"}>
      <div className="overflow-hidden w-12 h-12 rounded-full">
        <Image src={src} width={48} height={48} alt="" />
      </div>
      <div className="truncate">
        <div className="truncate text-sm text-gray-500 uppercase">{subtitle}</div>
        <div className="truncate">{title}</div>
      </div>
    </BaseCard>
  );
};
