import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { AssistantBoard } from "./AssistantBoard";

export default async function AssistantPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <AssistantBoard
      userName={user.name}
      canCreate={user.role !== "CONSULTA"}
      canEditLabSettings={user.role === "ADMIN"}
    />
  );
}
