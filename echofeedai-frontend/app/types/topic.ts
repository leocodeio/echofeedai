import { topicsPayloadSchema } from "@/services/schemas/topics.schema";
import { z } from "zod";

export type TopicsPayload = z.infer<typeof topicsPayloadSchema>;
