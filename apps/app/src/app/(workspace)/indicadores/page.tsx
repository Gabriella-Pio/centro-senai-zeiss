import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { IndicatorsBoard } from "./IndicatorsBoard";

export default async function IndicatorsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return <IndicatorsBoard />;
}
