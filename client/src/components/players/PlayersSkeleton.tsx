import { SmallCardSkeleton } from "@/components/SmallCardSkeleton";

export const PlayersSkeleton = () => {
  return (
    <>
      <div className="grid grid-cols-5 gap-6">
        {Array.from({ length: 20 }, (_, i) => {
          return <SmallCardSkeleton key={i} />;
        })}
      </div>
    </>
  );
};
