/*
  Warnings:

  - You are about to drop the `ParticipantSource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ParticipantSource` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ParticipantSource" DROP CONSTRAINT "ParticipantSource_participantId_fkey";

-- DropForeignKey
ALTER TABLE "ParticipantSource" DROP CONSTRAINT "ParticipantSource_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "_ParticipantSource" DROP CONSTRAINT "_ParticipantSource_A_fkey";

-- DropForeignKey
ALTER TABLE "_ParticipantSource" DROP CONSTRAINT "_ParticipantSource_B_fkey";

-- DropTable
DROP TABLE "ParticipantSource";

-- DropTable
DROP TABLE "_ParticipantSource";

-- CreateTable
CREATE TABLE "SourceParticipantMap" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,

    CONSTRAINT "SourceParticipantMap_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SourceParticipantMap" ADD CONSTRAINT "SourceParticipantMap_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceParticipantMap" ADD CONSTRAINT "SourceParticipantMap_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
