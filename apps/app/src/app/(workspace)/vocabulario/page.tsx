import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { DEMO_VOCABULARY } from "./demo";
import { VocabularyBoard } from "./VocabularyBoard";

export default async function VocabularyPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return <VocabularyBoard initialTerms={DEMO_VOCABULARY} canEdit={user.role === "ADMIN"} />;
}
