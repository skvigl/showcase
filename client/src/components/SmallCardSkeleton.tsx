import { BaseCard } from "@/shared/BaseCard";

export const SmallCardSkeleton = () => {
  return (
    <BaseCard className={"grid grid-cols-[auto_1fr] gap-4 items-center min-h-24"}>
      <div className="overflow-hidden w-12 h-12 rounded-full bg-gray-200"></div>
      <div className="">
        <div className="bg-gray-200 mb-1">&nbsp;</div>
        <div className="bg-gray-200">&nbsp;</div>
      </div>
    </BaseCard>
  );
};
