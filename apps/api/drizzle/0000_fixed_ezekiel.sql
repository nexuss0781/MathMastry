CREATE TYPE "public"."ai_message_status" AS ENUM('complete', 'partial', 'failed');--> statement-breakpoint
CREATE TYPE "public"."ai_role" AS ENUM('user', 'assistant', 'tool');--> statement-breakpoint
CREATE TYPE "public"."chat_mode" AS ENUM('socratic', 'explain', 'quiz', 'deep_dive');--> statement-breakpoint
CREATE TYPE "public"."concept_status" AS ENUM('locked', 'available', 'active');--> statement-breakpoint
CREATE TYPE "public"."curriculum_status" AS ENUM('draft', 'active', 'paused', 'done');--> statement-breakpoint
CREATE TYPE "public"."edge_kind" AS ENUM('prerequisite', 'related', 'transfer');--> statement-breakpoint
CREATE TYPE "public"."edge_origin" AS ENUM('glossary', 'ai', 'human');--> statement-breakpoint
CREATE TYPE "public"."enrichment_status" AS ENUM('seed', 'draft', 'reviewed');--> statement-breakpoint
CREATE TYPE "public"."item_status" AS ENUM('pending', 'done', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('queued', 'running', 'done', 'failed');--> statement-breakpoint
CREATE TYPE "public"."note_kind" AS ENUM('note', 'idea', 'question');--> statement-breakpoint
CREATE TYPE "public"."retention_kind" AS ENUM('none', 'fresh', 'retained');--> statement-breakpoint
CREATE TYPE "public"."review_kind" AS ENUM('explain', 'apply', 'connect', 'recall');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid NOT NULL,
	"role" "ai_role" NOT NULL,
	"content" text NOT NULL,
	"citations" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"model" text,
	"tokens_in" integer DEFAULT 0 NOT NULL,
	"tokens_out" integer DEFAULT 0 NOT NULL,
	"status" "ai_message_status" DEFAULT 'complete' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"concept_id" uuid,
	"mode" "chat_mode" DEFAULT 'socratic' NOT NULL,
	"title" text DEFAULT 'New thread' NOT NULL,
	"summary" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_usage" (
	"user_id" text NOT NULL,
	"day" date NOT NULL,
	"messages" integer DEFAULT 0 NOT NULL,
	"assessments" integer DEFAULT 0 NOT NULL,
	"tokens_in" integer DEFAULT 0 NOT NULL,
	"tokens_out" integer DEFAULT 0 NOT NULL,
	"cost_cents" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "ai_usage_user_id_day_pk" PRIMARY KEY("user_id","day")
);
--> statement-breakpoint
CREATE TABLE "concept_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"concept_id" uuid NOT NULL,
	"level" smallint NOT NULL,
	"note" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "concept_edges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_id" uuid NOT NULL,
	"to_id" uuid NOT NULL,
	"kind" "edge_kind" NOT NULL,
	"weight" real DEFAULT 1 NOT NULL,
	"origin" "edge_origin" DEFAULT 'glossary' NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "concept_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"concept_id" uuid NOT NULL,
	"ref_no" integer NOT NULL,
	"title" text NOT NULL,
	"url" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "concepts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"domain_id" uuid NOT NULL,
	"term" text NOT NULL,
	"one_liner" text NOT NULL,
	"mechanism" text,
	"assumptions" text[] DEFAULT '{}'::text[] NOT NULL,
	"failure_modes" text[] DEFAULT '{}'::text[] NOT NULL,
	"transfer_hooks" text[] DEFAULT '{}'::text[] NOT NULL,
	"examples" text[] DEFAULT '{}'::text[] NOT NULL,
	"enrichment_status" "enrichment_status" DEFAULT 'seed' NOT NULL,
	"content_version" integer DEFAULT 1 NOT NULL,
	"embedding" real[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artifact" text NOT NULL,
	"version" integer NOT NULL,
	"checksum" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "curricula" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"goal" text NOT NULL,
	"target_level" smallint DEFAULT 1 NOT NULL,
	"weekly_minutes" integer DEFAULT 300 NOT NULL,
	"start_date" date NOT NULL,
	"target_date" date,
	"status" "curriculum_status" DEFAULT 'draft' NOT NULL,
	"plan_version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "curriculum_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"curriculum_id" uuid NOT NULL,
	"concept_id" uuid NOT NULL,
	"target_level" smallint DEFAULT 1 NOT NULL,
	"week" integer NOT NULL,
	"position" integer NOT NULL,
	"estimated_minutes" integer DEFAULT 25 NOT NULL,
	"status" "item_status" DEFAULT 'pending' NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "daily_activity" (
	"user_id" text NOT NULL,
	"day" date NOT NULL,
	"minutes" integer DEFAULT 0 NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"concepts_advanced" integer DEFAULT 0 NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "daily_activity_user_id_day_pk" PRIMARY KEY("user_id","day")
);
--> statement-breakpoint
CREATE TABLE "domains" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"msc_codes" text[] DEFAULT '{}'::text[] NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"gap" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "job_status" DEFAULT 'queued' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"run_after" timestamp with time zone DEFAULT now() NOT NULL,
	"locked_at" timestamp with time zone,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"concept_id" uuid NOT NULL,
	"kind" "note_kind" DEFAULT 'note' NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"display_name" text,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"goal" text,
	"weekly_minutes" integer DEFAULT 300 NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"onboarded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"concept_id" uuid NOT NULL,
	"kind" "review_kind" NOT NULL,
	"prompt" text NOT NULL,
	"answer" text NOT NULL,
	"rubric" jsonb,
	"score" integer DEFAULT 0 NOT NULL,
	"max_score" integer DEFAULT 0 NOT NULL,
	"passed" boolean DEFAULT false NOT NULL,
	"grader_model" text DEFAULT 'fixture' NOT NULL,
	"latency_ms" integer DEFAULT 0 NOT NULL,
	"idempotency_key" text NOT NULL,
	"disputed" boolean DEFAULT false NOT NULL,
	"dispute_reason" text,
	"resolution_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_concept_state" (
	"user_id" text NOT NULL,
	"concept_id" uuid NOT NULL,
	"level" smallint DEFAULT 0 NOT NULL,
	"claimed_level" smallint DEFAULT 0 NOT NULL,
	"retention" "retention_kind" DEFAULT 'none' NOT NULL,
	"status" "concept_status" DEFAULT 'available' NOT NULL,
	"confidence" smallint DEFAULT 0 NOT NULL,
	"stability" real DEFAULT 0 NOT NULL,
	"difficulty" real DEFAULT 0 NOT NULL,
	"reps" integer DEFAULT 0 NOT NULL,
	"lapses" integer DEFAULT 0 NOT NULL,
	"fsrs_state" integer DEFAULT 0 NOT NULL,
	"last_review_at" timestamp with time zone,
	"next_review_at" timestamp with time zone,
	"leveled_up_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_concept_state_user_id_concept_id_pk" PRIMARY KEY("user_id","concept_id")
);
--> statement-breakpoint
CREATE TABLE "user_streaks" (
	"user_id" text PRIMARY KEY NOT NULL,
	"current" integer DEFAULT 0 NOT NULL,
	"longest" integer DEFAULT 0 NOT NULL,
	"last_evidence_day" date,
	"grace_used_week" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_thread_id_ai_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."ai_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_threads" ADD CONSTRAINT "ai_threads_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_threads" ADD CONSTRAINT "ai_threads_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_usage" ADD CONSTRAINT "ai_usage_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concept_claims" ADD CONSTRAINT "concept_claims_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concept_claims" ADD CONSTRAINT "concept_claims_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concept_edges" ADD CONSTRAINT "concept_edges_from_id_concepts_id_fk" FOREIGN KEY ("from_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concept_edges" ADD CONSTRAINT "concept_edges_to_id_concepts_id_fk" FOREIGN KEY ("to_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concept_sources" ADD CONSTRAINT "concept_sources_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concepts" ADD CONSTRAINT "concepts_domain_id_domains_id_fk" FOREIGN KEY ("domain_id") REFERENCES "public"."domains"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curricula" ADD CONSTRAINT "curricula_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curriculum_items" ADD CONSTRAINT "curriculum_items_curriculum_id_curricula_id_fk" FOREIGN KEY ("curriculum_id") REFERENCES "public"."curricula"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curriculum_items" ADD CONSTRAINT "curriculum_items_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_activity" ADD CONSTRAINT "daily_activity_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_concept_state" ADD CONSTRAINT "user_concept_state_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_concept_state" ADD CONSTRAINT "user_concept_state_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_streaks" ADD CONSTRAINT "user_streaks_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "account_provider_unique" ON "account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "account_user_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_messages_thread_idx" ON "ai_messages" USING btree ("thread_id","created_at");--> statement-breakpoint
CREATE INDEX "ai_threads_user_idx" ON "ai_threads" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "concept_claims_user_idx" ON "concept_claims" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "concept_edges_unique" ON "concept_edges" USING btree ("from_id","to_id","kind");--> statement-breakpoint
CREATE INDEX "concept_edges_from_idx" ON "concept_edges" USING btree ("from_id");--> statement-breakpoint
CREATE INDEX "concept_edges_to_idx" ON "concept_edges" USING btree ("to_id");--> statement-breakpoint
CREATE UNIQUE INDEX "concept_sources_unique" ON "concept_sources" USING btree ("concept_id","ref_no");--> statement-breakpoint
CREATE INDEX "concept_sources_concept_idx" ON "concept_sources" USING btree ("concept_id");--> statement-breakpoint
CREATE UNIQUE INDEX "concepts_slug_unique" ON "concepts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "concepts_domain_idx" ON "concepts" USING btree ("domain_id");--> statement-breakpoint
CREATE INDEX "concepts_enrichment_idx" ON "concepts" USING btree ("enrichment_status");--> statement-breakpoint
CREATE INDEX "curricula_user_status_idx" ON "curricula" USING btree ("user_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "curriculum_items_unique" ON "curriculum_items" USING btree ("curriculum_id","concept_id");--> statement-breakpoint
CREATE INDEX "curriculum_items_week_idx" ON "curriculum_items" USING btree ("curriculum_id","week","position");--> statement-breakpoint
CREATE INDEX "daily_activity_user_day_idx" ON "daily_activity" USING btree ("user_id","day");--> statement-breakpoint
CREATE UNIQUE INDEX "domains_slug_unique" ON "domains" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "jobs_status_run_idx" ON "jobs" USING btree ("status","run_after");--> statement-breakpoint
CREATE INDEX "notes_user_concept_idx" ON "notes" USING btree ("user_id","concept_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "reviews_idempotency_unique" ON "reviews" USING btree ("user_id","idempotency_key");--> statement-breakpoint
CREATE INDEX "reviews_user_created_idx" ON "reviews" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "reviews_user_concept_idx" ON "reviews" USING btree ("user_id","concept_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "session_token_unique" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "session_user_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_unique" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_concept_state_due_idx" ON "user_concept_state" USING btree ("user_id","next_review_at");--> statement-breakpoint
CREATE INDEX "user_concept_state_level_idx" ON "user_concept_state" USING btree ("user_id","level");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");