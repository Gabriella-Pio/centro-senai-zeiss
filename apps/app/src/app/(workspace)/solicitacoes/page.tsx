import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { RequestsBoard } from "./RequestsBoard";

export default async function RequestsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "ADMIN" && user.role !== "VALIDADOR") {
    redirect("/");
  }

  return (
    <Suspense fallback={null}>
      <RequestsBoard />
    </Suspense>
  );
}
