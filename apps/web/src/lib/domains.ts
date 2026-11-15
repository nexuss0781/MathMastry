export interface DomainMeta {
  short: string;
  color: string;
  blurb: string;
}

const DOMAINS: Record<string, DomainMeta> = {
  "logic-foundations": {
    short: "Logic & Foundations",
    color: "#3f5d8c",
    blurb: "Formal languages, proof, sets, categories, and the metatheory underneath everything else.",
  },
  algebra: {
    short: "Algebra",
    color: "#a24a32",
    blurb: "Groups, rings, fields, modules, linear maps, and the structures that carry symmetry.",
  },
  "number-theory": {
    short: "Number Theory",
    color: "#4c6b3c",
    blurb: "Primes, congruences, arithmetic functions, algebraic numbers, and Diophantine questions.",
  },
  geometry: {
    short: "Geometry",
    color: "#8a5a12",
    blurb: "Euclidean, affine, projective, and differential geometry — shape with structure.",
  },
  topology: {
    short: "Topology",
    color: "#5b4a7a",
    blurb: "Continuity without distance: spaces, invariants, homotopy, homology, and manifolds.",
  },
  analysis: {
    short: "Analysis",
    color: "#1f6e7a",
    blurb: "Limits, measure, integration, function spaces, and the machinery of approximation.",
  },
  "combinatorics-cs": {
    short: "Combinatorics & CS",
    color: "#9a3b5e",
    blurb: "Counting, graphs, designs, complexity, information, and discrete structure.",
  },
  "probability-statistics": {
    short: "Probability & Statistics",
    color: "#6b5a1f",
    blurb: "Randomness, inference, stochastic processes, and the mathematics of uncertainty.",
  },
  "numerical-computing": {
    short: "Numerical Analysis",
    color: "#3d6b62",
    blurb: "Algorithms that approximate: stability, convergence, interpolation, and floating point.",
  },
  "optimization-control": {
    short: "Optimization & Control",
    color: "#7a4b2a",
    blurb: "Convexity, duality, dynamics, and choosing the best action under constraints.",
  },
  "differential-equations-dynamics": {
    short: "Differential Equations",
    color: "#4a4e8a",
    blurb: "Change described locally and solved globally: ODEs, PDEs, and dynamical systems.",
  },
  "mathematical-physics": {
    short: "Mathematical Physics",
    color: "#6a3f4f",
    blurb: "Mechanics, fields, quantum theory, and the mathematics they demand.",
  },
  "interdisciplinary-applications": {
    short: "Interdisciplinary",
    color: "#6e6658",
    blurb: "Applications outside the core, from biology to cryptography.",
  },
};

export function domainMeta(slug: string): DomainMeta {
  return (
    DOMAINS[slug] ?? {
      short: slug.replace(/-/g, " "),
      color: "#6e6658",
      blurb: "",
    }
  );
}

export function domainColor(slug: string): string {
  return domainMeta(slug).color;
}

export const DOMAIN_ORDER = Object.keys(DOMAINS).filter((slug) => slug !== "interdisciplinary-applications");
