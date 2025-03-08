-- AlterTable
ALTER TABLE "Initiator" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'initiator';

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'participant';
