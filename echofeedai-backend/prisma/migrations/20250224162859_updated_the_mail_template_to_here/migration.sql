/*
  Warnings:

  - You are about to drop the column `mailTemplateId` on the `FeedbackInitiate` table. All the data in the column will be lost.
  - Added the required column `mailTemplateId` to the `Source` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FeedbackInitiate" DROP CONSTRAINT "FeedbackInitiate_mailTemplateId_fkey";

-- AlterTable
ALTER TABLE "FeedbackInitiate" DROP COLUMN "mailTemplateId";

-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "mailTemplateId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_mailTemplateId_fkey" FOREIGN KEY ("mailTemplateId") REFERENCES "MailTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
