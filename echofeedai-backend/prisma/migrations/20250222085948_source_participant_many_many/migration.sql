/*
  Warnings:

  - You are about to drop the column `sourceId` on the `Participant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_sourceId_fkey";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "sourceId";

-- CreateTable
CREATE TABLE "ParticipantSource" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,

    CONSTRAINT "ParticipantSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ParticipantSource" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ParticipantSource_AB_unique" ON "_ParticipantSource"("A", "B");

-- CreateIndex
CREATE INDEX "_ParticipantSource_B_index" ON "_ParticipantSource"("B");

-- AddForeignKey
ALTER TABLE "ParticipantSource" ADD CONSTRAINT "ParticipantSource_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantSource" ADD CONSTRAINT "ParticipantSource_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantSource" ADD CONSTRAINT "_ParticipantSource_A_fkey" FOREIGN KEY ("A") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantSource" ADD CONSTRAINT "_ParticipantSource_B_fkey" FOREIGN KEY ("B") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;
