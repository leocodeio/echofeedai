/*
  Warnings:

  - You are about to drop the column `mailTemplateId` on the `Source` table. All the data in the column will be lost.
  - Added the required column `mailTemplateIdentifier` to the `Source` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Source" DROP CONSTRAINT "Source_mailTemplateId_fkey";

-- AlterTable
ALTER TABLE "Source" DROP COLUMN "mailTemplateId",
ADD COLUMN     "mailTemplateIdentifier" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_mailTemplateIdentifier_fkey" FOREIGN KEY ("mailTemplateIdentifier") REFERENCES "MailTemplate"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;
