-- AlterTable
ALTER TABLE "FeedbackInitiate" ADD COLUMN     "topics" TEXT[] DEFAULT ARRAY[]::TEXT[];
