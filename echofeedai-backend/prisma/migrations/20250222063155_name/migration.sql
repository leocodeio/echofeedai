/*
  Warnings:

  - Added the required column `name` to the `Initiator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Initiator" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "name" TEXT NOT NULL;
