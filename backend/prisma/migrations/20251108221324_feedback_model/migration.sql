-- CreateTable
CREATE TABLE "feedback" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "comment" TEXT NOT NULL,
    "rating" INTEGER,
    "studentId" INTEGER NOT NULL,
    "professorId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "progressId" INTEGER,
    CONSTRAINT "feedback_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "feedback_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "feedback_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "feedback_progressId_fkey" FOREIGN KEY ("progressId") REFERENCES "progress" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "feedback_studentId_idx" ON "feedback"("studentId");

-- CreateIndex
CREATE INDEX "feedback_professorId_idx" ON "feedback"("professorId");

-- CreateIndex
CREATE INDEX "feedback_lessonId_idx" ON "feedback"("lessonId");

-- CreateIndex
CREATE INDEX "feedback_createdAt_idx" ON "feedback"("createdAt");
