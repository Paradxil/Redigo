-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Export" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT DEFAULT 'waiting',
    "error" TEXT NOT NULL DEFAULT '',
    "project" TEXT,
    CONSTRAINT "Export_project_fkey" FOREIGN KEY ("project") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Export" ("id", "project", "status") SELECT "id", "project", "status" FROM "Export";
DROP TABLE "Export";
ALTER TABLE "new_Export" RENAME TO "Export";
CREATE INDEX "Export_project_idx" ON "Export"("project");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
