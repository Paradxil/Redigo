-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userid" TEXT,
    "file_filesize" INTEGER,
    "file_mode" TEXT,
    "file_filename" TEXT,
    "export" TEXT,
    CONSTRAINT "File_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "File_export_fkey" FOREIGN KEY ("export") REFERENCES "Export" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_File" ("file_filename", "file_filesize", "file_mode", "id", "userid") SELECT "file_filename", "file_filesize", "file_mode", "id", "userid" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE INDEX "File_userid_idx" ON "File"("userid");
CREATE INDEX "File_export_idx" ON "File"("export");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
