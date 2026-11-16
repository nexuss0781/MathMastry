export type Level = 0 | 1 | 2 | 3;
export type Retention = "none" | "fresh" | "retained";

export interface MeResponse {
  user: { id: string; name: string; email: string; image: string | null; emailVerified: boolean; createdAt: string } | null;
  profile: {
    displayName: string | null;
    timezone: string;
    goal: string | null;
    weeklyMinutes: number;
    role: string;
    onboardedAt: string | null;
  } | null;
  capabilities: { google: boolean; aiMode: "fixture" | "openai" };
}

export interface DomainProgress {
  slug: string;
  name: string;
  description: string;
  gap: boolean;
  total: number;
  l1: number;
  l2: number;
  l3: number;
  active: number;
  progress: number;
}

export interface ConceptCardView {
  slug: string;
  term: string;
  oneLiner: string;
  domain: string;
  domainSlug: string;
  enrichmentStatus: "seed" | "draft" | "reviewed";
  level: Level;
  claimedLevel: Level;
  retention: Retention;
  status: "locked" | "available" | "active";
  confidence: number;
  unlocked: boolean;
  missingPrerequisites: Array<{ slug: string; term: string }>;
  prerequisites: Array<{ slug: string; term: string; weight: number }>;
  related: Array<{ slug: string; term: string; weight: number }>;
  nextReviewAt: string | null;
  lastReviewAt: string | null;
  leveledUpAt: string | null;
}

export interface ConceptDetail extends ConceptCardView {
  mechanism: string | null;
  assumptions: string[];
  failureModes: string[];
  transferHooks: string[];
  examples: string[];
  sources: Array<{ refNo: number; title: string; url: string }>;
  dependents: Array<{ slug: string; term: string; weight: number }>;
  state: {
    level: number;
    stability: number;
    difficulty: number;
    reps: number;
    lapses: number;
    nextReviewAt: string | null;
    lastReviewAt: string | null;
    confidence: number;
  } | null;
  notes: Array<{ id: string; kind: string; body: string; createdAt: string }>;
  reviews: Array<{
    id: string;
    kind: string;
    score: number;
    maxScore: number;
    passed: boolean;
    feedback: string | null;
    graderModel: string;
    createdAt: string;
    disputed: boolean;
  }>;
  prompts: Record<"explain" | "apply" | "connect", string>;
}

export interface ReviewScore {
  kind: "explain" | "apply" | "connect";
  scores: Record<string, number>;
  total: number;
  max: number;
  pass: boolean;
  feedback: string;
  missing: string[];
  confidence: number;
}

export interface AssessmentResult {
  duplicate: boolean;
  review: {
    id: string;
    kind: string;
    prompt: string;
    answer: string;
    score: number;
    maxScore: number;
    passed: boolean;
    rubric: { scores?: Record<string, number>; feedback?: string; missing?: string[]; confidence?: number } | null;
    graderModel: string;
    createdAt: string;
  };
  score: ReviewScore;
  state: {
    level: Level;
    claimedLevel: Level;
    retention: Retention;
    confidence: number;
    nextReviewAt: string | null;
    intervalDays: number;
    lapses: number;
  } | null;
  transition: { levelUp: boolean; levelDown: boolean; retained: boolean; reason: string } | null;
  xp: number;
  streak: { current: number; longest: number; graceUsed: boolean } | null;
  grader: { model: string; confidence: number; mode: string };
}

export interface QueueItem {
  slug: string;
  term: string;
  domain: string;
  domainSlug: string;
  level: Level;
  retention: Retention;
  nextReviewAt: string | null;
  daysOverdue: number;
  prompt: string;
}

export interface NewConcept {
  slug: string;
  term: string;
  oneLiner: string;
  domain: string;
  domainSlug: string;
  level: 0;
  status: "available";
}

export interface QueueResponse {
  due: QueueItem[];
  newConcepts: NewConcept[];
  today: string;
}

export interface Summary {
  totalConcepts: number;
  levels: { l0: number; l1: number; l2: number; l3: number };
  retained: number;
  touched: number;
  due: number;
  streak: { current: number; longest: number; lastEvidenceDay: string | null; graceUsedWeek: string | null };
  averageConfidence: number;
  domains: DomainProgress[];
  recentActivity: Array<{ day: string; xp: number; minutes: number; reviews: number; conceptsAdvanced: number }>;
}

export interface HeatmapResponse {
  cells: Array<{ day: string; xp: number; level: 0 | 1 | 2 | 3 | 4; weekday: number }>;
  totalXp: number;
  activeDays: number;
  minutes: number;
  reviews: number;
  endDay: string;
}

export interface CurriculumListItem {
  id: string;
  title: string;
  goal: string;
  status: "draft" | "active" | "paused" | "done";
  weeklyMinutes: number;
  startDate: string;
  targetDate: string | null;
  createdAt: string;
  total: number;
  done: number;
  progress: number;
}

export interface CurriculumItem {
  id: string;
  slug: string;
  term: string;
  oneLiner: string;
  domain: string;
  domainSlug: string;
  targetLevel: number;
  currentLevel: number;
  week: number;
  position: number;
  estimatedMinutes: number;
  status: "pending" | "done" | "skipped";
  completedAt: string | null;
}

export interface CurriculumDetail {
  id: string;
  title: string;
  goal: string;
  status: "draft" | "active" | "paused" | "done";
  weeklyMinutes: number;
  startDate: string;
  targetDate: string | null;
  createdAt: string;
  updatedAt: string;
  progress: number;
  done: number;
  total: number;
  weeks: Array<{ week: number; items: CurriculumItem[] }>;
  goalConcepts: CurriculumItem[];
}

export interface ThreadSummary {
  id: string;
  title: string;
  mode: "socratic" | "explain" | "quiz" | "deep_dive";
  conceptId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  citations: string[];
  model: string | null;
  status: string;
  createdAt: string;
}

export interface ThreadDetail {
  id: string;
  title: string;
  mode: "socratic" | "explain" | "quiz" | "deep_dive";
  conceptId: string | null;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface GraphData {
  nodes: Array<{
    slug: string;
    term: string;
    domain: string;
    domainName: string;
    level: Level;
    retention: Retention;
  }>;
  edges: Array<{ source: string; target: string; kind: "prerequisite"; weight: number }>;
  domains: Array<{ slug: string; name: string; gap: boolean }>;
}

export interface SearchItem {
  slug: string;
  term: string;
  domain: string;
  domainSlug: string;
  oneLiner: string;
  level: Level;
  status: string;
  score: number;
}

export interface UsageResponse {
  day: string;
  messages: number;
  messageLimit: number;
  assessments: number;
  assessmentLimit: number;
  tokensIn: number;
  tokensOut: number;
}

export interface PublicAtlas {
  totalConcepts: number;
  totalDomains: number;
  totalSources: number;
  totalEdges: number;
  domains: Array<{
    slug: string;
    name: string;
    description: string;
    count: number;
    sources: number;
    sample: Array<{ slug: string; term: string }>;
  }>;
}
