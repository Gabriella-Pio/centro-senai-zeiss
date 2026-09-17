import { redirect } from "next/navigation";
import { getSessionUser, serverApi } from "@/lib/session";
import { DEMO_MODE, getDemoUsers } from "@/lib/demo";
import { UsersBoard } from "./UsersBoard";
import type { ListedUser } from "./types";

export default async function UsersPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const people = DEMO_MODE ? getDemoUsers() : await serverApi<ListedUser[]>("/users");

  return <UsersBoard people={people} currentUserId={user.id} />;
}
