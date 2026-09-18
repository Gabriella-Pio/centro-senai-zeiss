import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { RecordsBoard } from "./RecordsBoard";

export default async function RecordsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return <RecordsBoard userRole={user.role} userName={user.name} />;
}
