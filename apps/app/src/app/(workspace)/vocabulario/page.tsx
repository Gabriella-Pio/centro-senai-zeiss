import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { VocabularyBoard } from "./VocabularyBoard";

export default async function VocabularyPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return <VocabularyBoard canEdit={user.role === "ADMIN"} />;
}
