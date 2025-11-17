import { Spinner } from "./ui/spinner";

export const Preloader = () => {
  return (
    <div className="relativie h-full grid place-items-center">
      <Spinner className="w-20 h-20 text-cyan-800" />
    </div>
  );
};
