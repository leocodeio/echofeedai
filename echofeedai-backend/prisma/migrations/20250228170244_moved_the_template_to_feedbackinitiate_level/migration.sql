/*
  Warnings:

  - You are about to drop the column `mailTemplateIdentifier` on the `Source` table. All the data in the column will be lost.
  - Added the required column `mailTemplateIdentifier` to the `FeedbackInitiate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Source" DROP CONSTRAINT "Source_mailTemplateIdentifier_fkey";

-- AlterTable
ALTER TABLE "FeedbackInitiate" ADD COLUMN     "mailTemplateIdentifier" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Source" DROP COLUMN "mailTemplateIdentifier";

-- AddForeignKey
ALTER TABLE "FeedbackInitiate" ADD CONSTRAINT "FeedbackInitiate_mailTemplateIdentifier_fkey" FOREIGN KEY ("mailTemplateIdentifier") REFERENCES "MailTemplate"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;
