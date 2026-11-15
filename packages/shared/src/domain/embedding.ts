const DIMENSIONS = 1024;

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "in",
  "is", "it", "its", "of", "on", "or", "that", "the", "their", "this", "to",
  "was", "were", "which", "with",
]);

function hash(value: string): number {
  let result = 2_166_136_261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16_777_619);
  }
  return result >>> 0;
}

function stem(token: string): string {
  if (token.endsWith("ies") && token.length > 4) return `${token.slice(0, -3)}y`;
  if (token.endsWith("sses")) return token.slice(0, -2);
  if (token.endsWith("s") && !token.endsWith("ss") && token.length > 4) return token.slice(0, -1);
  return token;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token))
    .map(stem);
}

/** Deterministic hashed bag-of-words + bigram embedding. Local fallback, no provider. */
export function embedText(text: string, dimensions = DIMENSIONS): number[] {
  const vector = new Array<number>(dimensions).fill(0);
  const tokens = tokenize(text);
  const grams: Array<[string, number]> = tokens.map((token) => [token, 1]);
  for (let index = 0; index + 1 < tokens.length; index += 1) {
    grams.push([`${tokens[index]}_${tokens[index + 1]}`, 0.5]);
  }
  for (const [token, weight] of grams) {
    const value = hash(token);
    const index = value % dimensions;
    const sign = (value & 0x8000_0000) === 0 ? 1 : -1;
    vector[index] = (vector[index] ?? 0) + sign * weight;
  }
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (norm === 0) return vector;
  return vector.map((value) => value / norm);
}

export function cosine(a: number[], b: number[]): number {
  const length = Math.min(a.length, b.length);
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let index = 0; index < length; index += 1) {
    const left = a[index] ?? 0;
    const right = b[index] ?? 0;
    dot += left * right;
    normA += left * left;
    normB += right * right;
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / Math.sqrt(normA * normB);
}

export const EMBEDDING_DIMENSIONS = DIMENSIONS;
