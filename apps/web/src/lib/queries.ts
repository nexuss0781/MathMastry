import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { api } from "./api";
import { invalidateEvidence, invalidateNotes } from "./actions";
import type {
  ConceptDetail,
  ConceptCardView,
  CurriculumDetail,
  CurriculumItem,
  CurriculumListItem,
  DomainProgress,
  GraphData,
  HeatmapResponse,
  MeResponse,
  PublicAtlas,
  QueueResponse,
  SearchItem,
  Summary,
  ThreadDetail,
  ThreadSummary,
  UsageResponse,
} from "./types";

export const qk = {
  me: ["me"] as const,
  config: ["config"] as const,
  publicAtlas: ["public", "atlas"] as const,
  domains: ["domains"] as const,
  concepts: ["concepts"] as const,
  concept: (slug: string) => ["concept", slug] as const,
  search: (query: string) => ["search", query] as const,
  graph: ["graph"] as const,
  queue: ["queue"] as const,
  summary: ["summary"] as const,
  heatmap: (weeks: number) => ["heatmap", weeks] as const,
  reviews: ["reviews"] as const,
  curricula: ["curricula"] as const,
  curriculum: (id: string) => ["curriculum", id] as const,
  threads: ["threads"] as const,
  thread: (id: string) => ["thread", id] as const,
  usage: ["usage"] as const,
};

export interface AppConfig {
  appName: string;
  githubEnabled: boolean;
  passwordEnabled: boolean;
  aiMode: "fixture" | "openai";
  aiEnabled: boolean;
  dailyMessages: number;
  dailyAssessments: number;
  devAuth: boolean;
  totalConcepts: number;
  domains: number;
}

export interface ConceptListResponse {
  total: number;
  offset: number;
  limit: number;
  items: ConceptCardView[];
}

export interface DomainListResponse {
  domains: DomainProgress[];
  totals: { concepts: number; populatedDomains: number; gapDomains: number };
}

export interface ReviewsResponse {
  reviews: Array<{
    id: string;
    kind: string;
    score: number;
    maxScore: number;
    passed: boolean;
    createdAt: string;
    conceptSlug: string;
    conceptTerm: string;
    graderModel: string;
  }>;
}

function query<T>(
  key: readonly unknown[],
  fn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error, T, readonly unknown[]>, "queryKey" | "queryFn">,
) {
  return useQuery<T, Error, T, readonly unknown[]>({ queryKey: key, queryFn: fn, ...options });
}

export function useMe() {
  return query(qk.me, () => api<MeResponse>("/me"));
}

export function useConfig() {
  return query(qk.config, () => api<AppConfig>("/config"), { staleTime: 5 * 60_000 });
}

export function usePublicAtlas() {
  return query(qk.publicAtlas, () => api<PublicAtlas>("/public/atlas"), { staleTime: 5 * 60_000 });
}

export function useDomains() {
  return query(qk.domains, () => api<DomainListResponse>("/domains"));
}

export function useConcepts() {
  return query(qk.concepts, () => api<ConceptListResponse>("/concepts?limit=500"), {
    staleTime: 60_000,
  });
}

export function useConcept(slug: string) {
  return query(qk.concept(slug), () => api<ConceptDetail>(`/concepts/${slug}`), {
    enabled: Boolean(slug),
  });
}

export function useSearch(search: string, enabled: boolean) {
  return query(qk.search(search), () => api<{ items: SearchItem[] }>(`/search?q=${encodeURIComponent(search)}`), {
    enabled: enabled && search.trim().length >= 2,
    staleTime: 30_000,
  });
}

export function useGraph(enabled = true) {
  return query(qk.graph, () => api<GraphData>("/graph"), { enabled, staleTime: 60_000 });
}

export function useQueue() {
  return query(qk.queue, () => api<QueueResponse>("/review/queue"), { staleTime: 15_000 });
}

export function useSummary() {
  return query(qk.summary, () => api<Summary>("/progress/summary"), { staleTime: 15_000 });
}

export function useHeatmap(weeks = 53) {
  return query(qk.heatmap(weeks), () => api<HeatmapResponse>(`/progress/heatmap?weeks=${weeks}`), {
    staleTime: 60_000,
  });
}

export function useReviews() {
  return query(qk.reviews, () => api<ReviewsResponse>("/progress/reviews?limit=25"), {
    staleTime: 30_000,
  });
}

export function useCurricula() {
  return query(qk.curricula, () => api<{ curricula: CurriculumListItem[] }>("/curricula"), {
    staleTime: 30_000,
  });
}

export function useCurriculum(id: string) {
  return query(qk.curriculum(id), () => api<{ curriculum: CurriculumDetail }>(`/curricula/${id}`), {
    enabled: Boolean(id),
  });
}

export function useActiveCurriculum() {
  return query(["curriculum", "active"] as const, () =>
    api<{ curriculum: CurriculumDetail | null }>("/curricula/active"),
  );
}

export function useNextCurriculum() {
  return query(["curriculum", "next"] as const, () =>
    api<{
      curriculum: { id: string; title: string; progress: number };
      items: CurriculumItem[];
    } | null>("/curricula/next"),
  );
}

export function useThreads() {
  return query(qk.threads, () => api<{ threads: ThreadSummary[] }>("/tutor/threads"), {
    staleTime: 15_000,
  });
}

export function useThread(id: string) {
  return query(qk.thread(id), () => api<{ thread: ThreadDetail }>(`/tutor/threads/${id}`), {
    enabled: Boolean(id),
  });
}

export function useUsage() {
  return query(qk.usage, () => api<UsageResponse>("/usage"), { staleTime: 30_000 });
}

export { invalidateEvidence, invalidateNotes } from "./actions";
