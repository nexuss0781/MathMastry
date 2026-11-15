import { queryClient } from "./query";

/** Every surface that reads learner evidence after an assessment or recall. */
export function invalidateEvidence(slug?: string) {
  const keys: string[][] = [
    ["summary"],
    ["queue"],
    ["domains"],
    ["graph"],
    ["reviews"],
    ["curricula"],
    ["curriculum"],
    ["heatmap"],
    ["concept"],
  ];
  for (const key of keys) {
    void queryClient.invalidateQueries({ queryKey: key });
  }
  if (slug) void queryClient.invalidateQueries({ queryKey: ["concept", slug] });
}

export function invalidateNotes(slug: string) {
  void queryClient.invalidateQueries({ queryKey: ["concept", slug] });
}

export async function downloadExport(format: "json" | "md" | "anki") {
  const response = await fetch(`/api/export?format=${format}`, { credentials: "include" });
  if (!response.ok) throw new Error(`Export failed (${response.status})`);
  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition") ?? "";
  const match = /filename="([^"]+)"/.exec(disposition);
  const extension = format === "anki" ? "tsv" : format;
  const filename = match?.[1] ?? `mathmastery-progress.${extension}`;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
