"use client";

import { useEffect } from "react";

export default function Error({ error }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // send to Sentry
    // console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center text-3xl">Oops. Something went wrong!</h2>
    </main>
  );
}
