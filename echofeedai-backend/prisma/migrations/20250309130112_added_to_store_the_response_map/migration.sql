-- AlterTable
ALTER TABLE "FeedbackResponse" ADD COLUMN     "responseScoreMap" JSONB NOT NULL DEFAULT '{}';
