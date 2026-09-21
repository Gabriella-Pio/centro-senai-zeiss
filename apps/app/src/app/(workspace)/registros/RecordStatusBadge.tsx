import { LESSON_STATUS_LABELS, SERVICE_STATUS_BADGE_LABELS, type LessonStatus, type ServiceStatus } from "./types";

export function RecordStatusBadge({ status }: { status: ServiceStatus }) {
  return (
    <span className={`record-status record-status--${status.toLowerCase()}`} role="status">
      {SERVICE_STATUS_BADGE_LABELS[status]}
    </span>
  );
}

export function RecordLessonStatusBadge({ status }: { status: LessonStatus }) {
  if (status !== "PENDING") {
    return null;
  }

  return (
    <span className="record-status record-status--lesson-pending" role="status">
      {LESSON_STATUS_LABELS.PENDING}
    </span>
  );
}

export function RecordLessonDetailBadge({ status }: { status: LessonStatus }) {
  return (
    <span className={`record-status record-status--lesson-${status.toLowerCase()}`} role="status">
      Lição · {LESSON_STATUS_LABELS[status]}
    </span>
  );
}
