import { z } from "zod";

export const assessmentKindSchema = z.enum(["explain", "apply", "connect"]);
export const recallGradeSchema = z.enum(["yes", "partial", "no"]);
export const chatModeSchema = z.enum(["socratic", "explain", "quiz", "deep_dive"]);
export const noteKindSchema = z.enum(["note", "idea", "question"]);

const timezoneSchema = z.string().min(1).max(64).refine(
  (value) => {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: value });
      return true;
    } catch {
      return false;
    }
  },
  { message: "Invalid IANA timezone" },
);

export const assessmentSubmissionSchema = z.object({
  conceptSlug: z.string().min(1).max(160),
  kind: assessmentKindSchema,
  answer: z.string().min(3).max(20_000),
  idempotencyKey: z.string().min(8).max(128),
});

export const recallSubmissionSchema = z.object({
  conceptSlug: z.string().min(1).max(160),
  grade: recallGradeSchema,
  idempotencyKey: z.string().min(8).max(128),
});

export const curriculumRequestSchema = z.object({
  goal: z.string().min(3).max(500),
  weeklyMinutes: z.number().int().min(30).max(3000),
  horizonWeeks: z.number().int().min(1).max(104),
});

export const profileUpdateSchema = z.object({
  displayName: z.string().min(1).max(80).optional(),
  timezone: timezoneSchema.optional(),
  weeklyMinutes: z.number().int().min(30).max(3000).optional(),
  goal: z.string().max(500).optional(),
});

export const noteInputSchema = z.object({
  conceptSlug: z.string().min(1).max(160),
  kind: noteKindSchema,
  body: z.string().min(1).max(10_000),
});

export const chatRequestSchema = z.object({
  conceptSlug: z.string().min(1).max(160).optional(),
  threadId: z.string().uuid().optional(),
  mode: chatModeSchema.default("socratic"),
  message: z.string().min(1).max(8000),
});

export const claimedLevelSchema = z.object({
  conceptSlug: z.string().min(1).max(160),
  level: z.union([z.literal(0), z.literal(1)]),
  note: z.string().min(3).max(1000),
});

export const disputeSchema = z.object({
  reason: z.string().min(3).max(2000),
});

export const exportQuerySchema = z.object({
  format: z.enum(["json", "md", "anki"]).default("json"),
});

export type AssessmentSubmission = z.infer<typeof assessmentSubmissionSchema>;
export type RecallSubmission = z.infer<typeof recallSubmissionSchema>;
export type CurriculumRequest = z.infer<typeof curriculumRequestSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
export type NoteInput = z.infer<typeof noteInputSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ClaimedLevelInput = z.infer<typeof claimedLevelSchema>;
export type ExportFormat = z.infer<typeof exportQuerySchema>["format"];
