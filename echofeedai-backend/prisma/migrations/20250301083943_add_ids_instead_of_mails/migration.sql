/*
  Warnings:

  - You are about to drop the column `participantMails` on the `FeedbackInitiate` table. All the data in the column will be lost.
  - You are about to drop the column `sourceId` on the `FeedbackResponse` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FeedbackResponse" DROP CONSTRAINT "FeedbackResponse_sourceId_fkey";

-- AlterTable
ALTER TABLE "FeedbackInitiate" DROP COLUMN "participantMails",
ADD COLUMN     "participantIds" TEXT[];

-- AlterTable
ALTER TABLE "FeedbackResponse" DROP COLUMN "sourceId";

-- CreateTable
CREATE TABLE "_FeedbackInitiateToParticipant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FeedbackInitiateToParticipant_AB_unique" ON "_FeedbackInitiateToParticipant"("A", "B");

-- CreateIndex
CREATE INDEX "_FeedbackInitiateToParticipant_B_index" ON "_FeedbackInitiateToParticipant"("B");

-- AddForeignKey
ALTER TABLE "_FeedbackInitiateToParticipant" ADD CONSTRAINT "_FeedbackInitiateToParticipant_A_fkey" FOREIGN KEY ("A") REFERENCES "FeedbackInitiate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeedbackInitiateToParticipant" ADD CONSTRAINT "_FeedbackInitiateToParticipant_B_fkey" FOREIGN KEY ("B") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
