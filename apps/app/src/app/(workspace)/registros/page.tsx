import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { DEMO_RECORDS } from "./demo";
import { RecordsBoard } from "./RecordsBoard";

export default async function RecordsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return <RecordsBoard initialRecords={DEMO_RECORDS} />;
}
