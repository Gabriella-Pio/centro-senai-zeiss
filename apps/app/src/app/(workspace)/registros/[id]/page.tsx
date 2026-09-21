import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { RecordDetailBoard } from "../RecordDetailBoard";

export default async function RecordDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  return (
    <Suspense fallback={null}>
      <RecordDetailBoard recordId={id} userRole={user.role} userName={user.name} />
    </Suspense>
  );
}
