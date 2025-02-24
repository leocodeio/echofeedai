/*
  Warnings:

  - A unique constraint covering the columns `[companyName]` on the table `Source` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Source_companyName_key" ON "Source"("companyName");
