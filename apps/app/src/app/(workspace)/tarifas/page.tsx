import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { TariffBoard } from "./TariffBoard";

export default async function TariffsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return <TariffBoard canEdit={user.role === "ADMIN"} />;
}
