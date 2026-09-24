import Link from "next/link";
import type { RecordDetailNotice } from "@/lib/record-lifecycle";

export function RecordDetailNotices({ notices }: { notices: RecordDetailNotice[] }) {
  if (notices.length === 0) {
    return null;
  }

  return (
    <div className="record-detail-page__notices" aria-label="Avisos do registro">
      {notices.map((notice) => (
        <div
          key={notice.id}
          className={`workspace-notice workspace-notice--${notice.tone} workspace-notice--with-action record-detail-page__notice`}
          role="status"
        >
          <p>{notice.message}</p>
          {notice.href && notice.linkLabel ? (
            <Link href={notice.href} className="workspace-notice__link">
              {notice.linkLabel}
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  );
}
