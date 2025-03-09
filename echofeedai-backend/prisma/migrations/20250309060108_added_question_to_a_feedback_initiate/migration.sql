-- AlterTable
ALTER TABLE "FeedbackInitiate" ADD COLUMN     "questions" TEXT[] DEFAULT ARRAY[]::TEXT[];
