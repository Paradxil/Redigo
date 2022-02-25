-- CreateTable
CREATE TABLE "Export" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "project" TEXT,
    CONSTRAINT "Export_project_fkey" FOREIGN KEY ("project") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExportSize" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT '',
    "width" INTEGER,
    "height" INTEGER,
    "framerate" INTEGER
);

-- CreateTable
CREATE TABLE "_Export_sizes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Export" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "ExportSize" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Export_project_idx" ON "Export"("project");

-- CreateIndex
CREATE UNIQUE INDEX "_Export_sizes_AB_unique" ON "_Export_sizes"("A", "B");

-- CreateIndex
CREATE INDEX "_Export_sizes_B_index" ON "_Export_sizes"("B");
