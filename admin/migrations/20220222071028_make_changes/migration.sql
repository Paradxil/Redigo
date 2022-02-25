-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FormSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userid" TEXT,
    "name" TEXT NOT NULL DEFAULT '',
    "track" TEXT,
    CONSTRAINT "Project_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TrackItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT '',
    "project" TEXT,
    "duration" INTEGER,
    "file" TEXT,
    "data" TEXT,
    "type" TEXT NOT NULL DEFAULT 'video',
    CONSTRAINT "TrackItem_project_fkey" FOREIGN KEY ("project") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TrackItem_file_fkey" FOREIGN KEY ("file") REFERENCES "File" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userid" TEXT,
    "file_filesize" INTEGER,
    "file_mode" TEXT,
    "file_filename" TEXT,
    CONSTRAINT "File_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FormSubmission_email_key" ON "FormSubmission"("email");

-- CreateIndex
CREATE INDEX "Project_userid_idx" ON "Project"("userid");

-- CreateIndex
CREATE INDEX "TrackItem_project_idx" ON "TrackItem"("project");

-- CreateIndex
CREATE INDEX "TrackItem_file_idx" ON "TrackItem"("file");

-- CreateIndex
CREATE INDEX "File_userid_idx" ON "File"("userid");
