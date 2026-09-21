import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { TariffBoard } from "./TariffBoard";

export default async function TariffsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={null}>
      <TariffBoard canEdit={user.role === "ADMIN"} />
    </Suspense>
  );
}
