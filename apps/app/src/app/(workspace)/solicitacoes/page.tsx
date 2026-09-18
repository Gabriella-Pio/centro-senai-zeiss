import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { DEMO_REQUESTS } from "./demo";
import { RequestsBoard } from "./RequestsBoard";

export default async function RequestsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return <RequestsBoard initialRequests={DEMO_REQUESTS} />;
}
