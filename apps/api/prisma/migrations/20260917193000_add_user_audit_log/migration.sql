CREATE TABLE "UserAuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "UserAuditLog_targetId_createdAt_idx" ON "UserAuditLog"("targetId", "createdAt");
CREATE INDEX "UserAuditLog_actorId_createdAt_idx" ON "UserAuditLog"("actorId", "createdAt");