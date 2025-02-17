"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect if user is no longer logged in
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Chargement...</div>; // Temporary display during session check
  }

  return session?.user ? (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        {" "}
      </div>
    </div>
  ) : <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
  <div className="grid auto-rows-min gap-4 md:grid-cols-3">
    <div className="aspect-video rounded-xl bg-muted/50" />
    <div className="aspect-video rounded-xl bg-muted/50" />
    <div className="aspect-video rounded-xl bg-muted/50" />
  </div>
  <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
    {" "}
  </div>
</div>; // We return nothing, because the user is redirected
}
