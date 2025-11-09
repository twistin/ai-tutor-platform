-- CreateTable
CREATE TABLE "student_messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "studentId" INTEGER NOT NULL,
    "response" TEXT,
    "respondedAt" DATETIME,
    "respondedBy" INTEGER,
    "lessonId" INTEGER,
    "moduleId" INTEGER,
    CONSTRAINT "student_messages_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "student_messages_studentId_idx" ON "student_messages"("studentId");

-- CreateIndex
CREATE INDEX "student_messages_status_idx" ON "student_messages"("status");

-- CreateIndex
CREATE INDEX "student_messages_createdAt_idx" ON "student_messages"("createdAt");
