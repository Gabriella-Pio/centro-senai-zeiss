import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { ValidationBoard } from "./ValidationBoard";

export default async function ValidationPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "ADMIN" && user.role !== "VALIDADOR") {
    redirect("/");
  }

  return (
    <Suspense fallback={null}>
      <ValidationBoard />
    </Suspense>
  );
}
