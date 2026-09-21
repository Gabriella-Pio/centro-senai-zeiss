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
          className={`record-detail-page__notice record-detail-page__notice--${notice.tone}`}
          role="status"
        >
          <p>{notice.message}</p>
          {notice.href && notice.linkLabel ? (
            <Link href={notice.href} className="record-detail-page__notice-link">
              {notice.linkLabel}
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  );
}
