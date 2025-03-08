/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Initiator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Initiator_name_key" ON "Initiator"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_name_key" ON "Participant"("name");
