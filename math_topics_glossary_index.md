# A Broad Mathematics Topics Glossary and Index

**Scope.** This is a practical, deliberately broad inventory of selected mathematical topics, not a claim that all mathematics can be exhaustively listed. The official MSC2020 is a literature classification: its top-level classes provide a useful coverage spine, not proof of completeness. Boundaries overlap, and topics may be classified by their methods, principal contribution, or application. This inventory can be expanded systematically from detailed MSC2020 entries.

## Table of contents

- [Method and classification note](#method-and-classification-note)
- [Domain-to-MSC crosswalk](#domain-to-msc-crosswalk)
- [Glossary by domain](#glossary-by-domain)
  - [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
  - [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
  - [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
  - [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
  - [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
  - [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
  - [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
  - [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
  - [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
  - [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
  - [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
  - [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Alphabetical index](#alphabetical-index)
- [Source directory](#source-directory)

## Method and classification note

The domain inventory was integrated from the supplied successful research, retaining representative topic breadth and consolidating duplicate source URLs under one reference number. MSC associations are **approximate and overlapping**, not one-to-one or exclusive; the crosswalk identifies primary classification neighborhoods rather than assigning a definitive code to every individual glossary item. Definitions are concise orientation-level descriptions rather than substitutes for theorem statements or specialist treatments. MSC associations are approximate where a topic spans classes; codes are marked as overlapping where useful, and a code family is not treated as an exclusive assignment. One supplied domain (interdisciplinary mathematical applications) had no completed research or verified sources, so it is transparently listed as a research gap rather than populated with unsupported terms. The citations attached to entries point to the official classification and/or specialist sources appropriate to the topic.

## Domain-to-MSC crosswalk

| Domain | MSC2020 coverage spine and overlap notes |
|---|---|
| [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods) | Approximate spine: MSC 00, 03, 06, 08, 18; overlaps include 03G30/18B25 and 03C05/08/18C05. MSC 03 (logic and foundations), 06 (order and lattices), 08 (algebraic systems), and 18 (category theory), with 00 as a general-methods neighborhood. These classes are a coverage spine, not disjoint domains; categorical logic and algebra cross-reference 03/18 and 03/08/18 respectively. |
| [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory) | Approximate spine: MSC 08, 12–13, 15–20, 22; overlapping representation/algebraic-group topics cross these classes. MSC 08 (general algebraic systems), 12 (fields), 13 (commutative algebra), 15 (linear algebra), 16–17 (associative/nonassociative algebras), 18–19 (category, homological algebra and K-theory), 20 (groups), 22 (Lie groups). Associations overlap; for example, representation theory and algebraic groups span multiple classes. |
| [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics) | Approximate spine: MSC 11A–11Y; overlaps 12, 14G/H/K, 20, 37, and 94A60. MSC Section 11 is the organizing spine, with overlaps into field theory (12), algebraic geometry (14), group theory (20), dynamics (37), and cryptography (94). Codes are guides, not exclusive ownership. |
| [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry) | Approximate spine: MSC 14, 51, 52, 53; overlaps topology, combinatorics, and analysis. MSC 14 (algebraic geometry), 51 (geometry), 52 (convex and discrete geometry), and 53 (differential geometry). These classifications overlap with topology, combinatorics, and analysis. |
| [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory) | Approximate spine: MSC 54, 55, 57; adjacent overlaps 58 and 20F65. MSC 54 (general topology), 55 (algebraic topology), and 57 (manifolds and low-dimensional topology) are central; 58 and 20F65 are adjacent crosswalks. Classification depends on a work’s main contribution, not an exclusive partition. |
| [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations) | Approximate spine: MSC 26, 28, 30–32, 40–47, 49, 58; overlaps PDE, probability, numerical analysis, and physics. MSC classes 26, 28, 30–32, 40–47, 49, and 58 provide the principal neighborhoods. Methods and applications overlap PDE, probability, numerical analysis, and physics. |
| [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science) | Approximate spine: MSC 05, 06, 68; neighboring overlaps include 03, 60, 90, and information theory. MSC 05 (combinatorics), 06 (order and lattices), and 68 (computer science) are the core crosswalk. Overlaps include logic, algebra, probability, optimization, and information theory. |
| [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory) | Approximate spine: MSC 60, 62; selected overlaps 37A, 65C, 68T. MSC 60 (probability and stochastic processes) and 62 (statistics) are the main spine. Stochastic modeling, statistical learning, computation, and causal inference also cross into other areas. |
| [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics) | Approximate spine: MSC 65; overlaps 68W30, 14Q, 37M, 41A, 49M, 90C. MSC 65 is the numerical-analysis spine, with symbolic computation (68W30), computational algebraic geometry (14Q), numerical dynamics (37M), approximation (41A), optimization (49M), and mathematical programming (90C) as overlapping classifications. |
| [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics) | Approximate spine: MSC 49, 90, 91, 93; methods overlap across these classes and 60, 65, 68, 05. MSC 49 (variations, optimal control, optimization), 90 (operations research), 91 (game theory and decision subjects), and 93 (systems and control). Dynamic programming, stochastic control, and optimization cross these boundaries. |
| [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling) | Approximate spine: MSC 34, 35, 37; overlaps 49, 65, 70, 76, 92, 93. MSC 34 (ODE), 35 (PDE), and 37 (dynamical systems) are core. Overlaps include control (49, 93), numerical analysis (65), mechanics and fluids (70, 76), and biology (92). |
| [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics) | Approximate spine: MSC 70, 74, 76, 78, 80–83; overlaps 35, 37, 46–49, 53, 58, 65. MSC application classes 70–83 intersect extensively with PDE, analysis, geometry, variational methods, and computation. These are overlapping classification neighborhoods. |
| Interdisciplinary applications (research gap) | No MSC crosswalk or glossary entries supplied; not inferred in this report. |

## Glossary by domain

### Logic, foundations, set theory, category theory, and general mathematical methods

<a id="term-1-mathematical-logic"></a>
**Mathematical logic.** Studies formal languages, inference, proof, definability, models, and the metatheory of formal systems. [1] [2] [9] Related: [First-order logic](#term-1-first-order-logic); [Proof theory](#term-1-proof-theory); [Categorical logic](#term-1-categorical-logic).
<a id="term-1-formal-language-and-signature"></a>
**Formal language and signature.** A formal language has symbols and formation rules; a signature specifies nonlogical symbols, including operations and relations with their arities. [1] [4]
<a id="term-1-classical-propositional-logic"></a>
**Classical propositional logic.** A deductive system for propositions using logical connectives and classical truth-functional semantics, including excluded middle. [1] [7]
<a id="term-1-first-order-logic"></a>
**First-order logic.** A formal logic with variables, predicates, functions, equality, and quantifiers ranging over a structure’s domain. [1] [4] Related: [Model theory](#term-1-model-theory); [Completeness and compactness](#term-1-completeness-and-compactness).
<a id="term-1-model-theory"></a>
**Model theory.** Studies structures satisfying formal theories and the relations between syntax, semantics, and definability. [1] [4]
<a id="term-1-completeness-and-compactness"></a>
**Completeness and compactness.** First-order completeness equates semantic validity with provability; compactness says a theory has a model if every finite subset does. [1] [4]
<a id="term-1-proof-theory"></a>
**Proof theory.** Studies formal proofs and deductive systems, including proof structure, transformations, consistency, and strength. [1] [9]
<a id="term-1-cut-elimination-and-normalization"></a>
**Cut elimination and normalization.** Proof transformations remove detours or intermediate lemmas, controlling proof structure and yielding metamathematical and computational consequences. [1] [9] [11]
<a id="term-1-computability-theory"></a>
**Computability theory.** Studies which functions and sets are effectively computable and how computational problems compare in difficulty. [1] [10]
<a id="term-1-undecidability-and-reducibility"></a>
**Undecidability and reducibility.** A problem is undecidable if no algorithm decides all its instances; reductions compare problems by effective translations. [1] [10]
<a id="term-1-axiomatic-set-theory-zfc"></a>
**Axiomatic set theory (ZFC).** ZFC is first-order Zermelo–Fraenkel set theory with choice, a standard framework for mathematics and infinity. [1] [2]
<a id="term-1-ordinals"></a>
**Ordinals.** Ordinals represent order types of well-ordered sets and measure positions in transfinite sequences. [1] [2]
<a id="term-1-cardinals"></a>
**Cardinals.** Cardinals measure set size up to bijection, extending finite size comparison to infinite collections. [1] [2]
<a id="term-1-axiom-of-choice"></a>
**Axiom of choice.** The axiom asserts that every family of nonempty sets admits a function selecting one element from each member. [1] [2]
<a id="term-1-forcing"></a>
**Forcing.** Forcing constructs generic extensions of models of set theory and is used for relative-consistency and independence results. [1] [2]
<a id="term-1-large-cardinal-axioms"></a>
**Large cardinal axioms.** These assert exceptionally strong infinite cardinals and organize hypotheses by increasing consistency strength. [1] [2]
<a id="term-1-descriptive-set-theory"></a>
**Descriptive set theory.** Studies definable sets, especially subsets of Polish spaces, through Borel and projective hierarchies. [1] [2]
<a id="term-1-category-theory"></a>
**Category theory.** Studies objects and composable structure-preserving maps, providing a general language for relations among structures. [1] [3] Related: [Functors and natural transformations](#term-1-functors-and-natural-transformations); [Universal property](#term-1-universal-property); [Categorical logic](#term-1-categorical-logic).
<a id="term-1-functors-and-natural-transformations"></a>
**Functors and natural transformations.** Functors preserve identities and composition between categories; natural transformations coherently map one functor to another. [1] [3]
<a id="term-1-universal-property"></a>
**Universal property.** A universal property characterizes an object by a uniquely specified mapping relationship, independently of a particular construction. [1] [3]
<a id="term-1-limits-and-colimits"></a>
**Limits and colimits.** These generalize products, equalizers, pullbacks, coproducts, and pushouts through universal cones or cocones. [1] [3]
<a id="term-1-adjunction"></a>
**Adjunction.** An adjunction is a natural correspondence between morphisms out of one functor’s values and morphisms into another’s. [1] [3] [5]
<a id="term-1-topos"></a>
**Topos.** A topos is a category with set-like structure and internal logic, linking category theory with geometry and foundations. [1] [3]
<a id="term-1-categorical-logic"></a>
**Categorical logic.** Categorical logic interprets logical systems in categorical structures, relating syntax and proofs to semantics. [1] [3] [11]
<a id="term-1-universal-algebra"></a>
**Universal algebra.** Studies algebraic structures specified by operations and identities, with homomorphisms, subalgebras, and varieties. [1] [4] [5] Related: [Mathematical structure and algebraic system](#term-1-mathematical-structure-and-algebraic-system); [Category theory](#term-1-category-theory).
<a id="term-1-mathematical-structure-and-algebraic-system"></a>
**Mathematical structure and algebraic system.** An algebraic system is a set equipped with specified operations and relations; its signature records their kinds and arities. [1] [4]
<a id="term-1-order-theory-and-lattices"></a>
**Order theory and lattices.** Order theory studies partially ordered sets; a lattice has a least upper and greatest lower bound for each pair. [1] [6] Related: [Boolean algebra](#term-1-boolean-algebra); [Heyting algebra](#term-1-heyting-algebra); [Partially ordered sets](#term-7-partially-ordered-sets).
<a id="term-1-boolean-algebra"></a>
**Boolean algebra.** A bounded distributive lattice with complements, modeling classical propositional logic and set operations. [1] [7]
<a id="term-1-heyting-algebra"></a>
**Heyting algebra.** A bounded lattice with relative implication, providing algebraic semantics for intuitionistic propositional logic. [1] [8]
<a id="term-1-type-theory"></a>
**Type theory.** A formal framework classifying expressions by types, supporting foundations, constructive reasoning, and typed computation. [1] [11]
<a id="term-1-constructive-mathematics"></a>
**Constructive mathematics.** Requires mathematical existence and proof to be supported by explicit constructions or specified evidence, often using intuitionistic logic. [1] [9] [11]
<a id="term-1-homotopy-type-theory-and-univalent-foundations"></a>
**Homotopy type theory and univalent foundations.** Homotopy type theory interprets types as spaces and identity as paths; univalence identifies equivalent structures as equal within a type-theoretic foundation. [11]
<a id="term-1-mathematical-induction-and-recursion"></a>
**Mathematical induction and recursion.** Induction proves claims from base and closure cases; recursion defines functions by specifying their values on constructors. [1] [10] [11]
<a id="term-1-ultraproduct"></a>
**Ultraproduct.** An ultraproduct combines structures modulo an ultrafilter, with first-order properties governed by Łoś’s theorem. [1] [4]

### Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory

<a id="term-2-algebraic-structures-and-universal-algebra"></a>
**Algebraic structures and universal algebra.** Universal algebra studies sets with specified operations and identities, and their homomorphisms, substructures, products, and quotients. [12] [16]
<a id="term-2-groups"></a>
**Groups.** A group has an associative operation, identity, and inverses; groups encode symmetries in geometry, number theory, and physics. [13] [12]
<a id="term-2-group-actions"></a>
**Group actions.** A group action is a homomorphism to a permutation group, formalizing symmetries through orbits and stabilizers. [13] [16]
<a id="term-2-rings-and-ring-homomorphisms"></a>
**Rings and ring homomorphisms.** A ring has an abelian additive group, associative multiplication, and distributivity; multiplication need not commute. [13] [12]
<a id="term-2-fields-and-field-extensions"></a>
**Fields and field extensions.** A field is a commutative ring where every nonzero element is invertible; extensions enlarge coefficient systems. [13] [14]
<a id="term-2-ideals-and-quotient-rings"></a>
**Ideals and quotient rings.** An ideal is an additive subgroup closed under multiplication by ring elements; quotienting by it produces a ring. [13] [14]
<a id="term-2-modules"></a>
**Modules.** A module is an abelian group with scalar multiplication by a ring, generalizing vector spaces and describing ring representations. [14] [15]
<a id="term-2-commutative-algebra"></a>
**Commutative algebra.** Studies commutative rings, ideals, and modules using local, finiteness, and dimension methods, with links to geometry and number theory. [14] [12] Related: [Algebraic geometry](#term-4-algebraic-geometry); [Localization and local rings](#term-2-localization-and-local-rings); [Modules](#term-2-modules).
<a id="term-2-localization-and-local-rings"></a>
**Localization and local rings.** Localization makes selected elements invertible; a local ring has exactly one maximal ideal and isolates behavior near a prime. [14]
<a id="term-2-noetherian-rings-and-modules"></a>
**Noetherian rings and modules.** Ascending chains of ideals or submodules stabilize; equivalently, every such subobject is finitely generated. [14] [12]
<a id="term-2-commutative-algebraic-geometry-interface"></a>
**Commutative algebraic geometry interface.** Polynomial ideals correspond to algebraic sets; coordinate rings and dimension theory translate between algebra and geometry. [14] [16]
<a id="term-2-grobner-bases-and-computational-algebra"></a>
**Gröbner bases and computational algebra.** A Gröbner basis is an ordered generating set of a polynomial ideal supporting ideal membership, elimination, and system solving. [14]
<a id="term-2-galois-theory"></a>
**Galois theory.** Relates symmetries of field extensions to intermediate fields through groups of field automorphisms. [14] [16]
<a id="term-2-linear-algebra-and-vector-spaces"></a>
**Linear algebra and vector spaces.** Studies vector spaces, linear maps, subspaces, bases, dimension, and eigenstructure. [15] [12]
<a id="term-2-matrix-theory-and-canonical-forms"></a>
**Matrix theory and canonical forms.** Studies matrices representing linear maps, their spectra, decompositions, products, and canonical forms. [16] [15]
<a id="term-2-tensor-and-multilinear-algebra"></a>
**Tensor and multilinear algebra.** Extends vectors and linear maps to multilinear objects and their products, used in geometry, representation theory, and physics. [16] [15]
<a id="term-2-bilinear-and-quadratic-forms"></a>
**Bilinear and quadratic forms.** Bilinear forms pair vectors linearly in each argument; quadratic forms assign degree-two scalar expressions. [16]
<a id="term-2-associative-algebras"></a>
**Associative algebras.** An associative algebra is a vector space over a field with compatible associative multiplication; matrix and group algebras are examples. [15] [16]
<a id="term-2-noncommutative-ring-theory"></a>
**Noncommutative ring theory.** Studies rings whose multiplication may not commute, including ideals, modules, and structure. [16] [15]
<a id="term-2-division-and-central-simple-algebras"></a>
**Division and central simple algebras.** A central simple algebra is finite-dimensional and simple with center its base field; examples include quaternion algebras. [16]
<a id="term-2-lie-algebras"></a>
**Lie algebras.** A Lie algebra is a vector space with an alternating bilinear bracket satisfying Jacobi’s identity, encoding infinitesimal symmetry. [15] [16]
<a id="term-2-universal-enveloping-algebras"></a>
**Universal enveloping algebras.** The universal enveloping algebra is an associative algebra universal among compatible maps from a Lie algebra, allowing its representations to be studied as modules. [15]
<a id="term-2-representation-theory"></a>
**Representation theory.** Studies actions of algebraic structures on vector spaces, translating structure into linear transformations. [15] [12] Related: [Groups](#term-2-groups); [Modules](#term-2-modules); [Lie algebras](#term-2-lie-algebras).
<a id="term-2-representations-of-groups-and-group-algebras"></a>
**Representations of groups and group algebras.** A group representation maps a group to invertible linear transformations; equivalently it is a module over its group algebra. [15] [16]
<a id="term-2-quiver-representations"></a>
**Quiver representations.** A quiver representation assigns vector spaces to vertices and linear maps to arrows, translating algebra-module problems into linear form. [15]
<a id="term-2-invariant-theory"></a>
**Invariant theory.** Studies polynomial or tensor quantities unchanged by group actions, connecting symmetry with geometry and classification. [16]
<a id="term-2-category-theory"></a>
**Category theory.** Category theory studies objects and composable morphisms through universal constructions and functors, a structural language across mathematics. [15] [12] Related: [Functors and natural transformations](#term-1-functors-and-natural-transformations); [Universal property](#term-1-universal-property); [Categorical logic](#term-1-categorical-logic).
<a id="term-2-homological-algebra"></a>
**Homological algebra.** Uses chain complexes and derived constructions to measure failures of exactness across algebra, geometry, and topology. [12] [14]
<a id="term-2-ext-and-tor"></a>
**Ext and Tor.** Ext and Tor are derived functors that quantify extension and tensor-product behavior of modules. [12] [14]
<a id="term-2-derived-categories-and-triangulated-methods"></a>
**Derived categories and triangulated methods.** Derived categories invert quasi-isomorphisms of complexes, making homological information invariant under chain-level changes. [12] [15]
<a id="term-2-algebraic-k-theory"></a>
**Algebraic K-theory.** Assigns groups or spectra to rings and categories, extracting invariants from projective modules and exact sequences. [12] [16]
<a id="term-2-hopf-algebras"></a>
**Hopf algebras.** An algebra with compatible coalgebra, coproduct, counit, and antipode structures, encoding symmetries and quantum groups. [15] [16]
<a id="term-2-nonassociative-algebras"></a>
**Nonassociative algebras.** Studies operations such as Lie, Jordan, and alternative products that relax associativity while retaining identities. [12] [16]
<a id="term-2-linear-algebraic-groups"></a>
**Linear algebraic groups.** Groups realized as Zariski-closed subgroups of general linear groups, organizing algebraic symmetries and representations. [16] [15]
<a id="term-2-grothendieck-groups-and-k0"></a>
**Grothendieck groups and K₀.** A Grothendieck group converts additive or exact-sequence relations into an abelian group; K₀ records classes of projective modules. [16]

### Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics

<a id="term-3-congruences-and-elementary-arithmetic"></a>
**Congruences and elementary arithmetic.** Studies divisibility, residue classes, greatest common divisors, and multiplicative structure of integers. [17]
<a id="term-3-prime-numbers-and-factorization"></a>
**Prime numbers and factorization.** Studies primes as multiplicative building blocks, their distribution, detection, and factorization properties. [17] [20]
<a id="term-3-arithmetic-functions"></a>
**Arithmetic functions.** Functions on integers encode arithmetic data, such as divisor counts, divisor sums, and Euler’s totient. [17]
<a id="term-3-reciprocity-laws"></a>
**Reciprocity laws.** Relate whether integers are power residues modulo others; quadratic reciprocity is the classical prototype. [17] [18]
<a id="term-3-continued-fractions"></a>
**Continued fractions.** Represent real numbers by iterated integer quotients, yielding exceptionally good rational approximations. [17]
<a id="term-3-additive-number-theory"></a>
**Additive number theory.** Studies additive representations and patterns in integers, including sumsets, bases, partitions, and primes. [17] [20]
<a id="term-3-analytic-number-theory"></a>
**Analytic number theory.** Applies analysis to arithmetic questions, especially average behavior and asymptotic distributions. [17] [20]
<a id="term-3-prime-number-theorem"></a>
**Prime number theorem.** The number of primes at most x is asymptotic to x/log x, giving their leading-order density. [17] [20]
<a id="term-3-primes-in-arithmetic-progressions"></a>
**Primes in arithmetic progressions.** Dirichlet’s theorem gives infinitely many primes in each residue class coprime to its modulus; analytic methods refine distribution. [17] [20]
<a id="term-3-sieve-methods"></a>
**Sieve methods.** Combinatorial and analytic techniques estimate integers avoiding specified divisibility conditions. [17] [20]
<a id="term-3-exponential-and-character-sums"></a>
**Exponential and character sums.** Finite sums over arithmetic sets whose cancellation estimates underpin equidistribution and Diophantine results. [17] [20]
<a id="term-3-zeta-and-l-functions"></a>
**Zeta and L-functions.** Dirichlet series and related functions encode arithmetic data; zeros, poles, and special values yield distribution results. [17] [18] [20]
<a id="term-3-algebraic-number-theory"></a>
**Algebraic number theory.** Studies arithmetic in finite extensions of the rationals through integers, ideals, units, valuations, and local and global fields. [17] [18] Related: [Class field theory](#term-3-class-field-theory); [Local fields and p-adic numbers](#term-3-local-fields-and-p-adic-numbers); [Ideal class groups and units](#term-3-ideal-class-groups-and-units).
<a id="term-3-ideal-class-groups-and-units"></a>
**Ideal class groups and units.** The class group measures failure of unique factorization into elements; units are invertible algebraic integers. [17] [18]
<a id="term-3-local-fields-and-p-adic-numbers"></a>
**Local fields and p-adic numbers.** Completions of number fields at absolute values permit local study of arithmetic and comparison with global questions. [17] [18]
<a id="term-3-class-field-theory"></a>
**Class field theory.** Classifies abelian extensions of local and global fields through reciprocity linking extensions to multiplicative groups and ideal classes. [17] [18]
<a id="term-3-chebotarev-density-theorem"></a>
**Chebotarev density theorem.** For a finite Galois extension, gives the density of unramified primes with Frobenius in a prescribed conjugacy class. [17] [20]
<a id="term-3-quadratic-forms"></a>
**Quadratic forms.** Homogeneous degree-two polynomials studied up to arithmetic equivalence, with applications to integer representation and equations. [17] [18] [23]
<a id="term-3-geometry-of-numbers"></a>
**Geometry of numbers.** Uses lattice geometry and convex bodies to derive results on integer points, minima, and forms. [17]
<a id="term-3-diophantine-equations"></a>
**Diophantine equations.** Polynomial equations over integers or rationals whose solutions are sought in specified arithmetic domains. [17] [23] Related: [Arithmetic geometry and Diophantine geometry](#term-3-arithmetic-geometry-and-diophantine-geometry); [Diophantine approximation](#term-3-diophantine-approximation).
<a id="term-3-diophantine-approximation"></a>
**Diophantine approximation.** Studies how closely real or complex numbers can be approximated by rationals or algebraic numbers. [17] [23]
<a id="term-3-transcendence-theory"></a>
**Transcendence theory.** Proves numbers or function values are not algebraic and studies algebraic independence and irrationality measures. [17] [23]
<a id="term-3-arithmetic-geometry-and-diophantine-geometry"></a>
**Arithmetic geometry and Diophantine geometry.** Applies algebraic geometry to arithmetic questions about rational, integral, or field-valued points and invariants. [17] [23] [22]
<a id="term-3-rational-points-and-heights"></a>
**Rational points and heights.** Studies points on varieties over number fields; heights quantify arithmetic complexity and support finiteness and counting. [17] [22]
<a id="term-3-elliptic-curves"></a>
**Elliptic curves.** Smooth projective genus-one curves with a rational base point; their points have an abelian group law. [17] [22] [21] Related: [Modular and automorphic forms](#term-3-modular-and-automorphic-forms); [Rational points and heights](#term-3-rational-points-and-heights).
<a id="term-3-abelian-varieties"></a>
**Abelian varieties.** Connected projective algebraic groups generalizing elliptic curves, central to Diophantine geometry. [17] [22]
<a id="term-3-local-global-principles-and-the-hasse-principle"></a>
**Local-global principles and the Hasse principle.** Tests global solvability through completions; in specified settings local solvability implies global solvability. [17] [23] [18]
<a id="term-3-modular-and-automorphic-forms"></a>
**Modular and automorphic forms.** Highly symmetric analytic functions whose coefficients and L-functions encode arithmetic information. [17] [21] [22]
<a id="term-3-galois-representations"></a>
**Galois representations.** Linear representations of Galois groups that package arithmetic information and connect extensions, forms, and geometry. [17] [20] [21]
<a id="term-3-langlands-program"></a>
**Langlands program.** Conjectural correspondences linking Galois or automorphic representations with L-functions and extending reciprocity. [17] [18] [21]
<a id="term-3-arithmetic-of-function-fields-and-finite-fields"></a>
**Arithmetic of function fields and finite fields.** Studies analogues of number-field arithmetic over function fields and finite fields. [17]
<a id="term-3-zeta-functions-of-varieties"></a>
**Zeta functions of varieties.** Generating functions encode point counts and other arithmetic data over finite and global fields. [17] [20] [22]
<a id="term-3-probabilistic-number-theory-and-arithmetic-statistics"></a>
**Probabilistic number theory and arithmetic statistics.** Uses probability and statistical heuristics to describe typical behavior of integers, primes, fields, and curves. [17] [20]
<a id="term-3-computational-number-theory"></a>
**Computational number theory.** Develops algorithms and complexity analyses for factorization, primality, discrete logarithms, and arithmetic objects. [17]
<a id="term-3-arithmetic-cryptography"></a>
**Arithmetic cryptography.** Uses finite fields and elliptic curves to construct cryptographic systems and study their security assumptions. [17] [22]

### Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry

<a id="term-4-euclidean-geometry"></a>
**Euclidean geometry.** Studies properties invariant under isometries; axiomatic foundations include incidence, order, congruence, continuity, and parallels. [24] [25]
<a id="term-4-affine-geometry"></a>
**Affine geometry.** Studies properties invariant under affine transformations, including collinearity and parallelism, but not generally length or angle. [24] [26]
<a id="term-4-affine-space-and-affine-combinations"></a>
**Affine space and affine combinations.** An affine space has points and displacement vectors but no distinguished origin; affine combinations have coefficients summing to one. [26] [32]
<a id="term-4-barycentric-coordinates"></a>
**Barycentric coordinates.** Coordinates expressing a point as an affine combination of reference points; normalized nonnegative coordinates describe a simplex. [32]
<a id="term-4-projective-geometry"></a>
**Projective geometry.** Studies properties invariant under projective transformations, adjoining ideal elements so parallel lines meet at infinity. [24] [27] [32]
<a id="term-4-projective-completion"></a>
**Projective completion.** The projective completion adjoins a hyperplane at infinity whose points encode directions. [27] [32]
<a id="term-4-homogeneous-coordinates"></a>
**Homogeneous coordinates.** Represent projective points by nonzero vectors modulo nonzero scalar multiplication. [27] [32]
<a id="term-4-cross-ratio"></a>
**Cross-ratio.** A scalar of four collinear points invariant under projective transformations. [32]
<a id="term-4-projective-duality"></a>
**Projective duality.** Exchanges points and hyperplanes while reversing incidence, turning projective statements into dual statements. [27] [32]
<a id="term-4-erlangen-program"></a>
**Erlangen program.** Klein’s framework characterizes a geometry by a transformation group and studies its invariants. [24] [26]
<a id="term-4-convex-set"></a>
**Convex set.** A set is convex when it contains the line segment between each pair of its points. [29] [31]
<a id="term-4-convex-body"></a>
**Convex body.** A full-dimensional closed convex subset of Euclidean space; conventions may additionally require compactness. [29] [31]
<a id="term-4-support-function"></a>
**Support function.** For a convex set, assigns each direction the supremum of inner products with its points, encoding supporting hyperplanes. [31]
<a id="term-4-minkowski-addition"></a>
**Minkowski addition.** The Minkowski sum consists of all sums of one point from each of two sets. [31]
<a id="term-4-brunnminkowski-theory"></a>
**Brunn–Minkowski theory.** Relates volumes of convex bodies to Minkowski addition through inequalities and geometric estimates. [31]
<a id="term-4-hellys-theorem"></a>
**Helly’s theorem.** For a finite family of convex sets in dimension d, if every d+1 intersect, then the whole family intersects. [31]
<a id="term-4-caratheodorys-theorem"></a>
**Carathéodory’s theorem.** Every point in a convex hull in dimension d lies in the hull of at most d+1 points. [31]
<a id="term-4-convex-polytope"></a>
**Convex polytope.** A bounded intersection of finitely many closed half-spaces, equivalently the convex hull of finitely many points. [31]
<a id="term-4-face-vector"></a>
**Face vector.** Records the number of faces of a polytope in each dimension. [31]
<a id="term-4-triangulation"></a>
**Triangulation.** Decomposes a space or polytope into simplices meeting along shared faces. [31]
<a id="term-4-discrete-geometry"></a>
**Discrete geometry.** Studies finite geometric configurations and their incidence, distance, packing, covering, or combinatorial properties. [31]
<a id="term-4-geometric-rigidity"></a>
**Geometric rigidity.** Studies whether frameworks can deform while preserving prescribed constraints, such as bar lengths. [31]
<a id="term-4-smooth-manifold"></a>
**Smooth manifold.** A space locally described by compatible smooth coordinate charts, allowing intrinsic calculus. [28] [24]
<a id="term-4-riemannian-geometry"></a>
**Riemannian geometry.** Studies smooth manifolds equipped with smoothly varying positive-definite inner products on tangent spaces. [28] [24] Related: [Riemannian metric](#term-4-riemannian-metric); [Geodesic](#term-4-geodesic); [Curvature](#term-4-curvature).
<a id="term-4-riemannian-metric"></a>
**Riemannian metric.** A smoothly varying positive-definite inner product on each tangent space, defining vector and curve lengths. [28]
<a id="term-4-geodesic"></a>
**Geodesic.** A curve with zero covariant acceleration; in Riemannian geometry, locally stationary for length or energy. [28]
<a id="term-4-curvature"></a>
**Curvature.** A local invariant measuring departure from flatness and governing geodesic behavior and intrinsic comparisons. [28]
<a id="term-4-differential-forms"></a>
**Differential forms.** Alternating covariant tensor fields equipped with exterior differentiation and integration. [24] [28]
<a id="term-4-symplectic-geometry"></a>
**Symplectic geometry.** Studies smooth manifolds with a closed nondegenerate two-form, modeling Hamiltonian mechanics. [24]
<a id="term-4-algebraic-geometry"></a>
**Algebraic geometry.** Studies polynomially defined objects and their generalizations using algebraic methods, including varieties and schemes. [29] [33] Related: [Scheme](#term-4-scheme); [Divisor](#term-4-divisor); [Intersection theory](#term-4-intersection-theory).
<a id="term-4-algebraic-variety"></a>
**Algebraic variety.** A geometric object described by polynomial equations; conventions differ on irreducibility and reducedness. [29]
<a id="term-4-scheme"></a>
**Scheme.** A space locally built from spectra of commutative rings with a structure sheaf, extending varieties to arithmetic bases. [29] [33]
<a id="term-4-birational-geometry"></a>
**Birational geometry.** Studies varieties up to birational equivalence, via rational maps that are isomorphisms on dense open subsets. [29] [33]
<a id="term-4-divisor"></a>
**Divisor.** A formal integer combination of codimension-one subvarieties or curve points, encoding zeros, poles, and line bundles. [29] [33]
<a id="term-4-intersection-theory"></a>
**Intersection theory.** Assigns algebraic or numerical intersection data to subvarieties, accounting for multiplicity. [29] [33]
<a id="term-4-moduli-space"></a>
**Moduli space.** A parameter space whose points represent isomorphism classes of objects, subject to representability qualifications. [29] [33]
<a id="term-4-enumerative-geometry"></a>
**Enumerative geometry.** Counts geometric objects satisfying specified conditions, often using intersection theory and multiplicity. [29] [33]

### Topology: general, algebraic, geometric, low-dimensional, and manifold theory

<a id="term-5-topological-space"></a>
**Topological space.** A set with open subsets closed under arbitrary unions and finite intersections, defining continuity and topological properties. [1] [34]
<a id="term-5-continuous-maps-and-homeomorphisms"></a>
**Continuous maps and homeomorphisms.** Continuity means inverse images of open sets are open; a homeomorphism is a bijective continuous map with continuous inverse. [1] [34]
<a id="term-5-basis-and-standard-space-constructions"></a>
**Basis and standard space constructions.** A basis generates a topology by unions; subspace, product, and quotient constructions build spaces systematically. [1] [34]
<a id="term-5-separation-axioms"></a>
**Separation axioms.** Conditions such as Hausdorffness specify separation of points or closed sets by neighborhoods. [1] [34]
<a id="term-5-compactness"></a>
**Compactness.** A space is compact if every open cover has a finite subcover, supporting existence theorems. [1] [35]
<a id="term-5-connectedness"></a>
**Connectedness.** A space is connected if it has no separation into disjoint nonempty open sets; path-connectedness requires paths between points. [1] [34]
<a id="term-5-metrization-theory"></a>
**Metrization theory.** Characterizes when topology arises from a metric, enabling distance-based convergence and completeness tools. [1] [34]
<a id="term-5-baire-category-theorem"></a>
**Baire category theorem.** A complete metric space is not a countable union of nowhere-dense sets; this supports genericity arguments. [1] [34]
<a id="term-5-dimension-theory"></a>
**Dimension theory.** Studies topological notions of dimension, their invariance, bounds, and relation to embeddings. [1] [34]
<a id="term-5-shape-theory"></a>
**Shape theory.** Extends homotopy methods to irregular spaces using approximations by better-behaved spaces and inverse systems. [1] [38]
<a id="term-5-homotopy-and-homotopy-equivalence"></a>
**Homotopy and homotopy equivalence.** A homotopy continuously deforms maps; maps inverse up to homotopy define homotopy equivalence. [1] [38]
<a id="term-5-cw-complexes"></a>
**CW complexes.** Built by attaching cells dimension by dimension, furnishing flexible models for homotopy and homology calculations. [1] [38]
<a id="term-5-fundamental-group"></a>
**Fundamental group.** Based loops modulo based homotopy form a group under concatenation, detecting one-dimensional holes and covering information. [1] [36] [38] Related: [Covering-space theory](#term-5-covering-space-theory); [Higher homotopy groups](#term-5-higher-homotopy-groups).
<a id="term-5-covering-space-theory"></a>
**Covering-space theory.** A covering map locally resembles disjoint copies of its base; suitable connected coverings correspond to subgroups of the fundamental group. [1] [38] [36]
<a id="term-5-higher-homotopy-groups"></a>
**Higher homotopy groups.** For n>1, πₙ(X) comprises based homotopy classes of maps from the n-sphere into X. [1] [38]
<a id="term-5-homology-and-cohomology"></a>
**Homology and cohomology.** Assign algebraic invariants via chain and cochain constructions, detecting cycles and supporting duality and computation. [1] [38] Related: [Spectral sequences](#term-5-spectral-sequences); [Poincaré duality](#term-5-poincare-duality); [Characteristic classes](#term-5-characteristic-classes).
<a id="term-5-spectral-sequences"></a>
**Spectral sequences.** A succession of algebraic pages whose differentials refine approximations to a target invariant. [1] [38]
<a id="term-5-fiber-bundles-and-fibrations"></a>
**Fiber bundles and fibrations.** Bundles are locally products; fibrations satisfy homotopy lifting and support long exact sequences of homotopy groups. [1] [38]
<a id="term-5-characteristic-classes"></a>
**Characteristic classes.** Cohomology classes assigned naturally to bundles, measuring twisting and providing obstructions to sections or trivializations. [1] [39] [38]
<a id="term-5-obstruction-theory"></a>
**Obstruction theory.** Cohomological classes determine whether maps, sections, or bundle data extend across successive skeleta. [1] [38]
<a id="term-5-topological-manifold"></a>
**Topological manifold.** A Hausdorff space locally homeomorphic to Euclidean space, optionally with boundary modeled on a half-space. [1] [37]
<a id="term-5-smooth-structure-and-differential-topology"></a>
**Smooth structure and differential topology.** A smooth structure is an atlas with smoothly compatible charts; differential topology studies smooth manifolds and maps. [1] [37] [39]
<a id="term-5-transversality-and-intersection-theory"></a>
**Transversality and intersection theory.** Transversality is a general-position condition making intersections well behaved; intersection theory defines geometric and homological invariants. [1] [37] [39]
<a id="term-5-cobordism"></a>
**Cobordism.** Two closed manifolds are cobordant if their disjoint union bounds a compact manifold; cobordism groups classify under this relation. [1] [39] [38]
<a id="term-5-surgery-theory-and-the-h-cobordism-theorem"></a>
**Surgery theory and the h-cobordism theorem.** Surgery modifies manifolds by replacing embedded neighborhoods; the h-cobordism theorem yields high-dimensional classification results. [1] [39]
<a id="term-5-geometric-topology"></a>
**Geometric topology.** Studies manifolds and embeddings using geometric constructions, decompositions, isotopy, and surgery. [1] [39] [37]
<a id="term-5-knot-and-link-theory"></a>
**Knot and link theory.** Studies embeddings of circles in three-dimensional space up to ambient isotopy through polynomial, homological, and geometric invariants. [1] [38]
<a id="term-5-mapping-class-groups"></a>
**Mapping class groups.** Groups of surface self-homeomorphisms or diffeomorphisms modulo isotopy, encoding symmetries and surface-bundle structure. [1] [38]
<a id="term-5-three-manifold-topology-and-geometrization"></a>
**Three-manifold topology and geometrization.** Studies 3-manifolds via decompositions and geometric structures; geometrization organizes pieces into eight model geometries. [1] [40]
<a id="term-5-four-manifold-topology"></a>
**Four-manifold topology.** Studies topological, smooth, and symplectic 4-manifolds using intersection forms and gauge-theoretic invariants. [1] [39]
<a id="term-5-geometric-group-theory"></a>
**Geometric group theory.** Studies groups through geometric and topological properties of spaces on which they act. [1] [41]
<a id="term-5-topological-quantum-field-theory-and-quantum-invariants"></a>
**Topological quantum field theory and quantum invariants.** A TQFT assigns algebraic data to manifolds and compatible maps to bordisms; quantum invariants encode knots and manifolds. [1] [39]
<a id="term-5-morse-theory"></a>
**Morse theory.** Relates manifold topology to critical points and indices of smooth functions, yielding handle decompositions. [1] [37]
<a id="term-5-poincare-duality"></a>
**Poincaré duality.** For a closed oriented n-manifold, identifies degree-k cohomology with homology in complementary degree n−k. [1] [38] [37]

### Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations

<a id="term-6-real-analysis"></a>
**Real analysis.** Studies real-valued functions and sequences through limits, continuity, differentiation, integration, approximation, and convergence. [1] [42] [47]
<a id="term-6-pointwise-and-uniform-convergence"></a>
**Pointwise and uniform convergence.** Pointwise convergence holds at each input; uniform convergence controls error by one bound over the whole domain. [1] [43]
<a id="term-6-lebesgue-measure"></a>
**Lebesgue measure.** Translation-invariant measure on Euclidean space extending interval length and assigning measure zero to negligible sets. [1] [42]
<a id="term-6-measure-space"></a>
**Measure space.** A set with a sigma-algebra of measurable subsets and a countably additive nonnegative measure. [1] [42] Related: [Lebesgue measure](#term-6-lebesgue-measure); [Lebesgue integral](#term-6-lebesgue-integral); [Lp spaces](#term-6-lp-spaces).
<a id="term-6-lebesgue-integral"></a>
**Lebesgue integral.** An integral of measurable functions built by approximation with simple functions, enabling robust limit interchange. [1] [47] [42]
<a id="term-6-measure-convergence-theorems"></a>
**Measure convergence theorems.** Monotone convergence, Fatou, and dominated convergence give conditions for passing limits through integrals. [1] [42] [47]
<a id="term-6-lp-spaces"></a>
**Lp spaces.** Spaces of measurable functions with pth-power absolute value integrable, identified up to almost-everywhere equality. [1] [47] [43]
<a id="term-6-radonnikodym-theorem"></a>
**Radon–Nikodym theorem.** For sigma-finite measures, absolute continuity yields an integrable density representing one measure by integration against another. [1] [47] [42]
<a id="term-6-fubinitonelli-theorems"></a>
**Fubini–Tonelli theorems.** Tonelli allows iterated integration for nonnegative functions; Fubini permits order exchange under absolute integrability. [1] [47] [42]
<a id="term-6-absolute-continuity-and-differentiation"></a>
**Absolute continuity and differentiation.** Absolute continuity controls total change over short intervals and characterizes indefinite Lebesgue integrals through almost-everywhere differentiation. [1] [47] [42]
<a id="term-6-complex-analysis"></a>
**Complex analysis.** Studies complex functions, holomorphicity, power series, contour integration, singularities, and conformal mapping. [1] [48]
<a id="term-6-holomorphic-function"></a>
**Holomorphic function.** A complex function differentiable at every point of an open set, equivalently locally represented by convergent power series. [1] [48]
<a id="term-6-cauchy-integral-theory"></a>
**Cauchy integral theory.** Cauchy’s theorem and formula relate contour integrals of holomorphic functions to interior values and derivatives. [1] [48]
<a id="term-6-residue-calculus"></a>
**Residue calculus.** The residue theorem evaluates contour integrals by summing Laurent coefficients at enclosed isolated singularities. [1] [48]
<a id="term-6-potential-theory-and-harmonic-functions"></a>
**Potential theory and harmonic functions.** Studies harmonic functions satisfying Laplace’s equation, boundary-value problems, and potentials. [1] [44] [48]
<a id="term-6-several-complex-variables"></a>
**Several complex variables.** Studies holomorphic functions of multiple complex variables, domains of holomorphy, continuation, and analytic spaces. [1] [48]
<a id="term-6-functional-analysis"></a>
**Functional analysis.** Studies infinite-dimensional spaces, continuous functionals, and operators using topological and algebraic methods. [1] [43] Related: [Banach and Hilbert spaces](#term-6-banach-and-hilbert-spaces); [Operator spectrum and resolvent](#term-6-operator-spectrum-and-resolvent).
<a id="term-6-banach-and-hilbert-spaces"></a>
**Banach and Hilbert spaces.** Banach spaces are complete normed spaces; Hilbert spaces are complete inner-product spaces supporting orthogonality. [1] [43]
<a id="term-6-dual-spaces-and-hahnbanach-theorem"></a>
**Dual spaces and Hahn–Banach theorem.** Continuous linear functionals form the dual; Hahn–Banach extends bounded functionals preserving norm. [1] [43]
<a id="term-6-fundamental-banach-space-theorems"></a>
**Fundamental Banach-space theorems.** Uniform boundedness, open mapping, and closed graph theorems turn pointwise or graph-level facts into norm bounds and continuity. [1] [43]
<a id="term-6-weak-and-weak-star-topologies"></a>
**Weak and weak-star topologies.** The weak topology is induced by continuous linear functionals; weak-star topology on a dual is induced by evaluation on vectors. [1] [43]
<a id="term-6-compact-operators"></a>
**Compact operators.** A compact operator maps bounded sets to relatively compact sets and often reduces infinite-dimensional problems to finite-dimensional spectral behavior. [1] [43] [51]
<a id="term-6-operator-spectrum-and-resolvent"></a>
**Operator spectrum and resolvent.** The spectrum comprises parameters for which an operator minus that parameter times identity lacks a bounded everywhere inverse; the inverse map is the resolvent. [1] [51]
<a id="term-6-spectral-theorem"></a>
**Spectral theorem.** Represents suitable operators, especially self-adjoint ones, through projection-valued measures or multiplication models. [1] [51] [43]
<a id="term-6-harmonic-analysis"></a>
**Harmonic analysis.** Studies Fourier expansions and transforms, trigonometric series, approximation, and analysis on groups. [1] [44] Related: [Fourier transform](#term-6-fourier-transform); [Convolution and Fourier multipliers](#term-6-convolution-and-fourier-multipliers).
<a id="term-6-fourier-transform"></a>
**Fourier transform.** An integral transform decomposing functions into frequencies and converting convolution into multiplication under suitable hypotheses. [1] [49]
<a id="term-6-plancherel-and-hausdorffyoung-theorems"></a>
**Plancherel and Hausdorff–Young theorems.** Plancherel extends Fourier transformation isometrically on L2; Hausdorff–Young gives Lp bounds for 1≤p≤2. [1] [49]
<a id="term-6-convolution-and-fourier-multipliers"></a>
**Convolution and Fourier multipliers.** Convolution combines functions by translation averaging; multipliers act by frequency-wise multiplication. [1] [49] [44]
<a id="term-6-abstract-harmonic-analysis"></a>
**Abstract harmonic analysis.** Studies invariant integration, representations, and Fourier analysis on locally compact groups. [1] [44]
<a id="term-6-distribution-theory"></a>
**Distribution theory.** Distributions are continuous linear functionals on smooth compactly supported test functions, extending functions and derivatives to singular objects. [1] [49] [50]
<a id="term-6-sobolev-spaces"></a>
**Sobolev spaces.** Function spaces whose members and weak derivatives through specified orders belong to Lp, natural for boundary-value problems. [1] [50]
<a id="term-6-calculus-of-variations"></a>
**Calculus of variations.** Studies extrema of functionals depending on functions through perturbations, necessary conditions, existence, and minimization. [1] [45]
<a id="term-6-first-variation-and-eulerlagrange-equations"></a>
**First variation and Euler–Lagrange equations.** The first variation is a directional derivative of a functional; stationarity yields Euler–Lagrange equations under appropriate regularity. [1] [45]
<a id="term-6-direct-methods-in-the-calculus-of-variations"></a>
**Direct methods in the calculus of variations.** Establish minimizer existence by compactness and lower semicontinuity, with approximation methods for computation. [1] [45]
<a id="term-6-optimal-control"></a>
**Optimal control.** Seeks controls and state trajectories optimizing a cost under dynamical and admissibility constraints. [1] [45]
<a id="term-6-weak-solutions-of-partial-differential-equations"></a>
**Weak solutions of partial differential equations.** Satisfy equations after testing against smooth functions and transferring derivatives, allowing limited classical regularity. [1] [50] [43]
<a id="term-6-analysis-in-quantum-mechanics"></a>
**Analysis in quantum mechanics.** Models observables as operators on Hilbert spaces; spectral theory relates operator structure to measurement values and evolution. [1] [43] [51]
<a id="term-6-fourier-methods-in-signal-processing-and-mathematical-physics"></a>
**Fourier methods in signal processing and mathematical physics.** Frequency analysis decomposes signals and simplifies translation-invariant systems, supporting computation and physical PDE methods. [1] [44] [49]

### Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science

<a id="term-7-combinatorics"></a>
**Combinatorics.** Studies finite or discrete structures, their arrangements, counts, and properties. [1] [52]
<a id="term-7-enumerative-combinatorics"></a>
**Enumerative combinatorics.** Counts objects satisfying structural conditions, often through bijections, recurrences, or generating functions. [1] [53]
<a id="term-7-generating-function"></a>
**Generating function.** A formal power series whose coefficients encode a sequence or class, enabling counting identities and recurrence solutions. [1] [52] [53]
<a id="term-7-inclusionexclusion-principle"></a>
**Inclusion–exclusion principle.** Counts a finite union by alternating sums of sizes of intersections. [1] [53]
<a id="term-7-recurrence-relation"></a>
**Recurrence relation.** An equation specifying sequence terms from earlier terms, often with initial conditions. [1] [52] [53]
<a id="term-7-probabilistic-method"></a>
**Probabilistic method.** Proves existence of a finite object by showing it occurs with positive probability in a probability space. [1] [53]
<a id="term-7-extremal-combinatorics"></a>
**Extremal combinatorics.** Studies maximum or minimum sizes of discrete structures subject to constraints or forbidden configurations. [1] [53]
<a id="term-7-ramsey-theory"></a>
**Ramsey theory.** Studies when sufficiently large or dense structures contain specified ordered or monochromatic substructures. [1] [53]
<a id="term-7-design-theory"></a>
**Design theory.** Studies finite incidence systems arranged to meet regularity or balance conditions. [1]
<a id="term-7-matroid-theory"></a>
**Matroid theory.** Studies set systems whose independent subsets satisfy axioms abstracting linear independence and graph forests. [1]
<a id="term-7-graph-theory"></a>
**Graph theory.** Studies vertices joined by edges, with properties including connectivity, coloring, paths, and subgraphs. [1] [53] [55] Related: [Trees and spanning trees](#term-7-trees-and-spanning-trees); [Matchings and Hall’s theorem](#term-7-matchings-and-halls-theorem); [Graph coloring](#term-7-graph-coloring).
<a id="term-7-paths-and-connectivity"></a>
**Paths and connectivity.** A path is a sequence of adjacent vertices; connectivity asks whether paths link vertices and what removals disconnect them. [1] [53]
<a id="term-7-trees-and-spanning-trees"></a>
**Trees and spanning trees.** A tree is a connected acyclic graph; a spanning tree contains every vertex of a connected graph. [1] [53]
<a id="term-7-matchings-and-halls-theorem"></a>
**Matchings and Hall’s theorem.** A matching is a set of vertex-disjoint edges; Hall’s theorem characterizes a matching covering one side of a bipartite graph. [1] [53]
<a id="term-7-graph-coloring"></a>
**Graph coloring.** A proper vertex coloring assigns different colors to adjacent vertices; chromatic number is the minimum number required. [1] [53]
<a id="term-7-planar-graphs"></a>
**Planar graphs.** Graphs drawable in the plane with edges meeting only at shared endpoints; their embeddings and faces are studied. [1] [53]
<a id="term-7-network-flow"></a>
**Network flow.** A flow assigns values to directed edges subject to capacities and conservation; maximum flow equals minimum cut. [1] [55]
<a id="term-7-random-graphs"></a>
**Random graphs.** Probability models select graphs according to distributions to study typical structure and thresholds. [1] [53]
<a id="term-7-algebraic-graph-theory"></a>
**Algebraic graph theory.** Uses matrices, groups, and spectra to investigate graph structure and properties. [1]
<a id="term-7-partially-ordered-sets"></a>
**Partially ordered sets.** A poset has a reflexive, antisymmetric, transitive relation; incomparable elements need not be ordered. [1] [56]
<a id="term-7-lattice-theory"></a>
**Lattice theory.** A lattice is a poset in which every pair has a greatest lower bound and least upper bound. [1] [56] [57]
<a id="term-7-antichains-and-sperner-theory"></a>
**Antichains and Sperner theory.** An antichain is a family of pairwise incomparable elements; Sperner theory bounds sizes of extremal families. [1] [53] [56]
<a id="term-7-mobius-inversion-on-posets"></a>
**Möbius inversion on posets.** An inversion principle on locally finite posets that reverses interval summation and supports combinatorial enumeration. [1] [52]
<a id="term-7-hasse-diagram"></a>
**Hasse diagram.** A diagram displays a poset’s cover relations, with transitivity implicit. [1] [56]
<a id="term-7-discrete-probability"></a>
**Discrete probability.** Probability on finite or countable outcomes, used in models and proofs about algorithms or structures. [1] [52]
<a id="term-7-combinatorial-optimization"></a>
**Combinatorial optimization.** Optimizes objectives over discrete feasible structures, such as matchings, flows, cuts, and tours. [1] [55]
<a id="term-7-algorithm-analysis-and-asymptotic-complexity"></a>
**Algorithm analysis and asymptotic complexity.** Studies resource use as input size grows, typically with asymptotic bounds. [1] [52] [54]
<a id="term-7-dynamic-programming"></a>
**Dynamic programming.** Solves overlapping subproblems and combines stored solutions, often through recurrences over a finite state space. [1] [52] [54]
<a id="term-7-automata-and-formal-languages"></a>
**Automata and formal languages.** Studies abstract machines recognizing or generating finite-string languages, including regular and context-free languages. [1] [55]
<a id="term-7-computability-theory"></a>
**Computability theory.** Studies algorithmically solvable problems through formal models such as Turing machines and reductions. [1] [55] [54]
<a id="term-7-computational-complexity-theory"></a>
**Computational complexity theory.** Classifies problems by computational resources such as time, space, or randomness. [1] [54] [55] Related: [P versus NP](#term-7-p-versus-np); [Boolean satisfiability and SAT](#term-7-boolean-satisfiability-and-sat).
<a id="term-7-p-versus-np"></a>
**P versus NP.** Asks whether every decision problem whose solutions can be verified in polynomial time can also be solved in polynomial time. [1] [54]
<a id="term-7-boolean-satisfiability-and-sat"></a>
**Boolean satisfiability and SAT.** Asks whether a Boolean formula has a satisfying assignment; SAT is NP-complete and central to reductions and constraint solving. [1] [55]
<a id="term-7-approximation-algorithms"></a>
**Approximation algorithms.** Return feasible solutions with provable bounds on their distance from optimality. [1] [55]
<a id="term-7-discrete-structures-in-computing"></a>
**Discrete structures in computing.** Graphs, trees, orders, strings, and Boolean functions model data organization, networks, scheduling, and computation. [1] [52] [55]

### Probability, stochastic processes, statistics, and data-oriented mathematical theory

<a id="term-8-probability-space"></a>
**Probability space.** A measurable sample space with a countably additive probability measure of total mass one. [1] [58] [59]
<a id="term-8-random-variable-and-distribution"></a>
**Random variable and distribution.** A random variable is a measurable map from a probability space; its distribution is the induced probability measure. [58] [59]
<a id="term-8-conditional-probability-and-expectation"></a>
**Conditional probability and expectation.** Conditional probability updates event probabilities; conditional expectation is an integrable prediction given a sigma-algebra. [58] [59]
<a id="term-8-independence"></a>
**Independence.** Events or random variables are independent when joint probabilities factor into marginal products. [58] [59]
<a id="term-8-laws-of-large-numbers-and-ergodic-averages"></a>
**Laws of large numbers and ergodic averages.** Give conditions for averages of observations or trajectories to converge to expectations or invariant means. [58] [59]
<a id="term-8-central-limit-and-invariance-principles"></a>
**Central limit and invariance principles.** Central limit theorems describe Gaussian limits of normalized sums; invariance principles extend convergence to paths. [58] [59]
<a id="term-8-concentration-inequalities"></a>
**Concentration inequalities.** Bound the probability that random quantities deviate substantially from reference values. [59]
<a id="term-8-bayes-theorem"></a>
**Bayes’ theorem.** Obtains a conditional distribution by reweighting a prior with likelihood and normalizing. [58] [59] [60]
<a id="term-8-stochastic-process"></a>
**Stochastic process.** A family of random variables indexed by time, space, or another parameter, representing evolving uncertainty. [59] [60] Related: [Markov chains and processes](#term-8-markov-chains-and-processes); [Martingales](#term-8-martingales); [Brownian motion](#term-8-brownian-motion).
<a id="term-8-markov-chains-and-processes"></a>
**Markov chains and processes.** Given the present state, the future is independent of the past; models include queues, populations, and simulation. [59] [60]
<a id="term-8-martingales"></a>
**Martingales.** Integrable adapted processes whose conditional future value equals the present value, modeling fair-game dynamics. [59] [60]
<a id="term-8-poisson-processes-and-point-processes"></a>
**Poisson processes and point processes.** A point process is a random collection of locations or times; Poisson counts on disjoint sets are independent with means determined by intensity. [59]
<a id="term-8-brownian-motion"></a>
**Brownian motion.** A continuous process starting at zero with independent stationary Gaussian increments of variance equal to elapsed time. [59] [60]
<a id="term-8-levy-processes"></a>
**Lévy processes.** Processes starting at zero with independent stationary increments and continuity in probability; they may have jumps. [60]
<a id="term-8-ito-calculus-and-stochastic-differential-equations"></a>
**Itô calculus and stochastic differential equations.** Stochastic integration defines integrals against suitable processes; SDEs model systems driven by random fluctuations. [59] [60]
<a id="term-8-random-fields-and-spatial-processes"></a>
**Random fields and spatial processes.** Processes indexed by multidimensional space or space-time; spatial statistics estimates dependence and structure in such data. [59] [62]
<a id="term-8-monte-carlo-and-markov-chain-monte-carlo"></a>
**Monte Carlo and Markov chain Monte Carlo.** Random sampling estimates quantities; MCMC constructs dependent samples with a target distribution for integration and Bayesian computation. [58] [59]
<a id="term-8-statistical-model-and-likelihood"></a>
**Statistical model and likelihood.** A model is a family of distributions indexed by parameters; likelihood evaluates relative support for parameter values given data. [60] [59]
<a id="term-8-sampling-theory-and-survey-sampling"></a>
**Sampling theory and survey sampling.** Studies population inference from selected observations, including probability-based, stratified, and clustered designs. [61] [59]
<a id="term-8-statistical-estimation"></a>
**Statistical estimation.** An estimator is a data-based rule for an unknown feature; maximum likelihood maximizes likelihood, with performance assessed by risk and related criteria. [60] [59] Related: [Confidence intervals](#term-8-confidence-intervals); [Hypothesis testing](#term-8-hypothesis-testing); [Bayesian statistics](#term-8-bayesian-statistics).
<a id="term-8-confidence-intervals"></a>
**Confidence intervals.** Procedures designed so repeated-sampling intervals cover a fixed target at a stated long-run rate under assumptions. [60] [59]
<a id="term-8-hypothesis-testing"></a>
**Hypothesis testing.** Uses data to decide whether to reject a null hypothesis while controlling error probabilities. [60] [59]
<a id="term-8-bayesian-statistics"></a>
**Bayesian statistics.** Combines prior and likelihood into a posterior distribution summarizing uncertainty after observations. [60] [59]
<a id="term-8-nonparametric-statistics"></a>
**Nonparametric statistics.** Develops inference without fully specified finite-dimensional distributional forms, including ranks and smoothing. [59] [61]
<a id="term-8-regression-and-generalized-linear-models"></a>
**Regression and generalized linear models.** Model conditional relationships; generalized linear models extend linear predictors to non-Gaussian responses through link functions. [61] [59]
<a id="term-8-multivariate-analysis-and-principal-component-analysis"></a>
**Multivariate analysis and principal component analysis.** Studies joint variation; PCA represents correlated measurements by orthogonal directions of decreasing variance. [59] [61] [62]
<a id="term-8-time-series-analysis"></a>
**Time-series analysis.** Models ordered observations and temporal dependence for forecasting and monitoring. [61] [59]
<a id="term-8-survival-analysis"></a>
**Survival analysis.** Studies time-to-event data while accounting for censoring and incomplete observation. [61] [59]
<a id="term-8-causal-inference"></a>
**Causal inference.** Estimates intervention effects by comparing potential outcomes, requiring designs or assumptions addressing counterfactuals and confounding. [63]
<a id="term-8-bootstrap-and-resampling"></a>
**Bootstrap and resampling.** Repeatedly resamples observed data to approximate sampling variability and assess uncertainty or bias. [61] [59]
<a id="term-8-design-of-experiments"></a>
**Design of experiments.** Plans controlled data collection using randomization, replication, and structured factor variation. [61] [63]
<a id="term-8-exploratory-data-analysis"></a>
**Exploratory data analysis.** Uses graphical and robust summaries to reveal structure, anomalies, and model departures. [61]
<a id="term-8-statistical-learning"></a>
**Statistical learning.** Studies algorithms that infer predictive or descriptive structure from data while accounting for uncertainty and generalization. [61] [59]
<a id="term-8-functional-data-analysis"></a>
**Functional data analysis.** Treats curves, surfaces, or functions as observations, using functional components and regression for trajectories and images. [62]

### Numerical analysis, scientific computing, symbolic computation, and computational mathematics

<a id="term-9-numerical-analysis"></a>
**Numerical analysis.** Studies algorithms for approximate solutions and their accuracy, stability, convergence, and cost. [1] [64] [66]
<a id="term-9-floating-point-arithmetic"></a>
**Floating-point arithmetic.** A finite-precision number system represents a wide range of magnitudes with bounded relative spacing and rounding error. [1] [66]
<a id="term-9-conditioning"></a>
**Conditioning.** Measures sensitivity of the exact problem solution to small input perturbations; it is a problem property. [1] [66]
<a id="term-9-numerical-stability-and-backward-error"></a>
**Numerical stability and backward error.** Stability concerns propagation of perturbations; backward error measures the smallest input change making a computed result exact. [1] [66] [65]
<a id="term-9-convergence-and-error-analysis"></a>
**Convergence and error analysis.** Studies whether approximations approach the desired solution under refinement and quantifies error rates. [1] [65] [64]
<a id="term-9-approximation-and-interpolation"></a>
**Approximation and interpolation.** Constructs simpler functions matching or approximating data, often with polynomials, trigonometric expansions, or basis functions. [1] [65] [66]
<a id="term-9-spline-methods"></a>
**Spline methods.** Piecewise-polynomial approximation joined with prescribed smoothness, useful for interpolation and modeling. [1] [65]
<a id="term-9-numerical-quadrature-and-cubature"></a>
**Numerical quadrature and cubature.** Approximates integrals by weighted sums of function values. [1] [65]
<a id="term-9-numerical-differentiation"></a>
**Numerical differentiation.** Approximates derivatives from function evaluations or data using differences, interpolation, or automatic differentiation. [1] [65] [66]
<a id="term-9-nonlinear-equation-solving"></a>
**Nonlinear equation solving.** Finds roots of scalar equations or systems using bracketing, fixed-point, secant, or Newton methods. [1] [65]
<a id="term-9-newton-and-homotopy-methods"></a>
**Newton and homotopy methods.** Newton iterations use local derivative information; homotopy tracks solutions along a continuously deformed problem. [1] [65]
<a id="term-9-numerical-linear-algebra"></a>
**Numerical linear algebra.** Computes solutions, factorizations, eigeninformation, least-squares results, and matrix functions in finite precision. [1] [66] Related: [Krylov and iterative methods](#term-9-krylov-and-iterative-methods); [Preconditioning](#term-9-preconditioning); [Eigenvalue and singular-value computation](#term-9-eigenvalue-and-singular-value-computation).
<a id="term-9-direct-linear-system-methods"></a>
**Direct linear-system methods.** Finite sequences of algebraic operations, often factorizations such as LU or QR, solve linear systems. [1] [66]
<a id="term-9-krylov-and-iterative-methods"></a>
**Krylov and iterative methods.** Build successive approximations in subspaces generated by matrix-vector products, especially for large sparse systems. [1] [66]
<a id="term-9-preconditioning"></a>
**Preconditioning.** Transforms a problem to improve convergence or numerical behavior of an iterative solver. [1] [66]
<a id="term-9-eigenvalue-and-singular-value-computation"></a>
**Eigenvalue and singular-value computation.** Numerical methods compute spectral values and vectors to reveal stability, dominant subspaces, or low-rank structure. [1] [66]
<a id="term-9-least-squares-and-inverse-problems"></a>
**Least squares and inverse problems.** Least squares fits overdetermined data; inverse problems infer causes from indirect, incomplete, or noisy observations. [1] [66]
<a id="term-9-regularization"></a>
**Regularization.** Stabilizes ill-posed problems by imposing constraints or penalties, trading fit for improved stability. [1] [66]
<a id="term-9-interval-and-verified-computation"></a>
**Interval and verified computation.** Interval methods enclose exact values in guaranteed bounds; verified algorithms certify results despite rounding. [1]
<a id="term-9-automatic-differentiation"></a>
**Automatic differentiation.** Applies the chain rule to program operations to compute derivatives without finite-difference truncation error. [66] [67]
<a id="term-9-numerical-solution-of-odes"></a>
**Numerical solution of ODEs.** Time-stepping and boundary-value algorithms approximate ODE solutions, guided by error control and stability. [1] [65]
<a id="term-9-stiff-differential-equations"></a>
**Stiff differential equations.** Rapidly decaying or separated time scales can make explicit integration inefficient or unstable, motivating implicit methods. [1] [65]
<a id="term-9-differential-algebraic-equations"></a>
**Differential-algebraic equations.** Couple differential relations with algebraic constraints; solvers must respect consistency conditions. [1]
<a id="term-9-pde-discretization"></a>
**PDE discretization.** Converts a partial differential equation into a finite-dimensional problem by approximating space and possibly time. [1] [64]
<a id="term-9-finite-difference-methods"></a>
**Finite-difference methods.** Approximate derivatives by differences of grid values, yielding algebraic equations for differential equations. [1] [64]
<a id="term-9-finite-volume-methods"></a>
**Finite-volume methods.** Enforce balance laws over mesh cells by integrating fluxes across their boundaries. [1] [64]
<a id="term-9-finite-element-methods"></a>
**Finite-element methods.** Approximate differential or variational problems with finite-dimensional spaces of locally supported mesh basis functions. [1] [68] [64] Related: [PDE discretization](#term-9-pde-discretization); [Adaptive mesh refinement](#term-9-adaptive-mesh-refinement).
<a id="term-9-spectral-and-collocation-methods"></a>
**Spectral and collocation methods.** Represent solutions in global basis functions or enforce equations at selected nodes; spectral methods can converge rapidly for smooth solutions. [1] [64]
<a id="term-9-adaptive-mesh-refinement"></a>
**Adaptive mesh refinement.** Estimates local error and selectively refines the mesh where needed. [1] [64]
<a id="term-9-multigrid-and-domain-decomposition"></a>
**Multigrid and domain decomposition.** Multigrid reduces errors across scales; domain decomposition splits large problems into coupled subproblems. [1] [64]
<a id="term-9-monte-carlo-methods"></a>
**Monte Carlo methods.** Use repeated random sampling to estimate quantities, especially for high-dimensional or uncertain problems. [1]
<a id="term-9-numerical-stochastic-differential-equations"></a>
**Numerical stochastic differential equations.** Approximate stochastic equations by discretizing time and representing random increments computationally. [1]
<a id="term-9-fast-fourier-transform"></a>
**Fast Fourier transform.** A family of algorithms computes discrete Fourier transforms with substantially fewer operations than direct summation for suitable sizes. [1] [65]
<a id="term-9-numerical-optimization"></a>
**Numerical optimization.** Algorithms numerically seek extrema subject to objectives and constraints using gradient or derivative-free strategies. [1]
<a id="term-9-high-performance-scientific-computing"></a>
**High-performance scientific computing.** Combines mathematical models, numerical algorithms, and software; parallelism enables large scientific computations. [1] [64]
<a id="term-9-symbolic-computation-and-computer-algebra"></a>
**Symbolic computation and computer algebra.** Manipulates exact mathematical expressions and structures, including simplification, factorization, and symbolic solution. [1] [67]
<a id="term-9-polynomial-algorithms-and-grobner-bases"></a>
**Polynomial algorithms and Gröbner bases.** Exact polynomial algorithms include Gröbner bases for ideal membership and polynomial-system solving. [1] [67]
<a id="term-9-hybrid-symbolic-numeric-computation"></a>
**Hybrid symbolic-numeric computation.** Combines exact symbolic structure with approximate numerical calculation for tractability and accuracy. [66] [67]
<a id="term-9-numerical-algebraic-geometry"></a>
**Numerical algebraic geometry.** Uses numerical continuation and related methods to approximate solution sets of polynomial systems. [1]
<a id="term-9-computational-methods-for-dynamical-systems"></a>
**Computational methods for dynamical systems.** Approximate invariant structures and long-term behavior, including manifolds, attractors, bifurcations, and ergodic quantities. [1]
<a id="term-9-computational-geometry"></a>
**Computational geometry.** Develops algorithms for geometric objects and operations, including robust representation and surface modeling. [1]

### Optimization, operations research, game theory, control, and decision mathematics

<a id="term-10-operations-research"></a>
**Operations research.** Applies mathematical modeling and optimization to decisions about complex systems, resources, logistics, and services. [69] [73] [77]
<a id="term-10-mathematical-optimization"></a>
**Mathematical optimization.** Studies choices minimizing or maximizing an objective over feasible decisions, often subject to constraints. [69] [70] Related: [Linear programming](#term-10-linear-programming); [Convex optimization](#term-10-convex-optimization); [Lagrangian duality and KKT conditions](#term-10-lagrangian-duality-and-kkt-conditions).
<a id="term-10-linear-programming"></a>
**Linear programming.** Optimizes a linear objective subject to linear equality and inequality constraints. [70]
<a id="term-10-integer-and-mixed-integer-programming"></a>
**Integer and mixed-integer programming.** Requires some or all variables to be integers, representing discrete choices with continuous quantities. [70]
<a id="term-10-nonlinear-programming"></a>
**Nonlinear programming.** Optimizes when the objective or at least one constraint is nonlinear. [70] [69]
<a id="term-10-convex-optimization"></a>
**Convex optimization.** Minimizes a convex objective over a convex feasible set; every local minimum is global. [70] [69]
<a id="term-10-lagrangian-duality-and-kkt-conditions"></a>
**Lagrangian duality and KKT conditions.** Duality relates constrained problems to multiplier-based bounds; KKT conditions characterize optima under regularity. [70] [69]
<a id="term-10-combinatorial-optimization"></a>
**Combinatorial optimization.** Optimizes over finite structured choices such as matchings, tours, or subsets. [70] [55]
<a id="term-10-network-optimization"></a>
**Network optimization.** Optimizes flows, paths, or other graph decisions in transportation and communication systems. [70] [77]
<a id="term-10-stochastic-programming"></a>
**Stochastic programming.** Optimizes under probabilistically represented uncertain data, often with decisions adapting to information. [70] [59]
<a id="term-10-robust-optimization"></a>
**Robust optimization.** Seeks decisions effective across an uncertainty set, commonly protecting against worst cases. [70]
<a id="term-10-multiobjective-optimization"></a>
**Multiobjective optimization.** Handles conflicting objectives through trade-offs such as Pareto efficiency. [70] [76]
<a id="term-10-dynamic-programming"></a>
**Dynamic programming.** Represents sequential optimization by states and stages and applies Bellman’s principle to subproblems. [70] [72]
<a id="term-10-queueing-theory"></a>
**Queueing theory.** Studies waiting lines through arrivals, service, and capacity to analyze congestion and delays. [70] [77]
<a id="term-10-inventory-theory"></a>
**Inventory theory.** Analyzes and optimizes replenishment and stock levels under costs and uncertain demand. [70]
<a id="term-10-scheduling-theory"></a>
**Scheduling theory.** Assigns and sequences jobs on constrained resources to optimize completion, lateness, throughput, or cost. [70] [77]
<a id="term-10-simulation-optimization"></a>
**Simulation optimization.** Searches for good decisions using simulation estimates when direct analytical optimization is difficult. [70]
<a id="term-10-game-theory"></a>
**Game theory.** Mathematically studies strategic interaction through players, actions, preferences, and outcomes. [71] [72] Related: [Nash equilibrium](#term-10-nash-equilibrium); [Zero-sum games and minimax](#term-10-zero-sum-games-and-minimax); [Mechanism design](#term-10-mechanism-design).
<a id="term-10-noncooperative-games"></a>
**Noncooperative games.** Model individual strategy choices where payoffs depend on combined choices without binding joint agreements. [71]
<a id="term-10-nash-equilibrium"></a>
**Nash equilibrium.** A strategy profile where no player can improve payoff by changing strategy alone. [71]
<a id="term-10-zero-sum-games-and-minimax"></a>
**Zero-sum games and minimax.** In two-player zero-sum games one player’s gain is the other’s loss; minimax characterizes optimal play. [71]
<a id="term-10-cooperative-game-theory-and-the-core"></a>
**Cooperative game theory and the core.** Studies coalitions and payoff allocation; core allocations cannot be improved by a coalition acting alone. [71]
<a id="term-10-shapley-value"></a>
**Shapley value.** Assigns each participant its average marginal contribution over all coalition orders, satisfying standard axioms. [71]
<a id="term-10-mechanism-design"></a>
**Mechanism design.** Constructs rules so strategic agents, often with private information, have incentives to produce desired outcomes. [71]
<a id="term-10-evolutionary-game-theory"></a>
**Evolutionary game theory.** Models strategy-frequency change through selection or learning in interacting populations. [71]
<a id="term-10-expected-utility-decision-theory"></a>
**Expected-utility decision theory.** Represents beliefs with probabilities and preferences with utility, evaluating choices by expected utility. [72]
<a id="term-10-multi-criteria-decision-analysis"></a>
**Multi-criteria decision analysis.** Compares options across multiple criteria, structuring preferences, trade-offs, and rankings. [76]
<a id="term-10-markov-decision-process"></a>
**Markov decision process.** A sequential stochastic decision model with states, actions, transition probabilities, and rewards optimized by a policy. [70] [71] [72]
<a id="term-10-control-theory"></a>
**Control theory.** Analyzes and designs systems whose behavior can be influenced through inputs. [72] [69] Related: [Feedback control](#term-10-feedback-control); [Controllability and observability](#term-10-controllability-and-observability); [Optimal control](#term-6-optimal-control).
<a id="term-10-feedback-control"></a>
**Feedback control.** Measures system behavior and adjusts inputs in response to observations or deviations from target. [72]
<a id="term-10-controllability-and-observability"></a>
**Controllability and observability.** Controllability concerns moving between states; observability concerns reconstructing internal states from outputs. [72]
<a id="term-10-stability-and-lyapunov-methods"></a>
**Stability and Lyapunov methods.** Study whether trajectories remain near or converge to desired states; Lyapunov functions provide certificates. [72]
<a id="term-10-optimal-control"></a>
**Optimal control.** Chooses an admissible input trajectory to optimize an objective subject to system dynamics and constraints. [69] [72]
<a id="term-10-pontryagin-maximum-principle"></a>
**Pontryagin maximum principle.** A necessary-condition framework introduces costates and a Hamiltonian; optimal trajectories satisfy adjoint and extremum conditions. [69] [72]
<a id="term-10-hamiltonjacobibellman-equation"></a>
**Hamilton–Jacobi–Bellman equation.** A dynamic programming equation for the value function that can characterize optimal values and controls. [69] [72]
<a id="term-10-model-predictive-control"></a>
**Model predictive control.** Repeatedly optimizes over a finite future horizon, applies the first action, then updates and resolves. [72] [69]
<a id="term-10-stochastic-control"></a>
**Stochastic control.** Controls systems affected by randomness to optimize expected performance over time. [72] [69]

### Ordinary and partial differential equations, dynamical systems, and mathematical modeling

<a id="term-11-ordinary-differential-equation-ode"></a>
**Ordinary differential equation (ODE).** An equation for an unknown function of one independent variable involving that function and its derivatives. [1] [78] Related: [Dynamical system and flow](#term-11-dynamical-system-and-flow); [Initial-value problem and well-posedness for ODEs](#term-11-initial-value-problem-and-well-posedness-for-odes).
<a id="term-11-initial-value-problem-and-well-posedness-for-odes"></a>
**Initial-value problem and well-posedness for ODEs.** An initial-value problem prescribes a state at one time; solution theory studies existence, uniqueness, continuation, and continuous dependence. [1] [78] [79]
<a id="term-11-boundary-value-problem-for-odes"></a>
**Boundary-value problem for ODEs.** An ODE supplemented by constraints at multiple points or endpoints; Sturm–Liouville problems are central examples. [1] [78]
<a id="term-11-linear-systems-and-floquet-theory"></a>
**Linear systems and Floquet theory.** For periodic-coefficient linear systems, Floquet theory represents evolution using periodic and exponential factors. [1] [78]
<a id="term-11-dynamical-system-and-flow"></a>
**Dynamical system and flow.** A dynamical system describes state evolution through maps obeying a composition law; ODEs generate flows or semiflows. [1] [78] [79]
<a id="term-11-equilibria-and-linearization"></a>
**Equilibria and linearization.** An equilibrium is stationary; the Jacobian approximates nearby dynamics and determines local behavior when hyperbolic. [1] [78] [79]
<a id="term-11-lyapunov-stability"></a>
**Lyapunov stability.** Stability means nearby initial states remain nearby; asymptotic stability additionally requires convergence to equilibrium. [1] [78] [79]
<a id="term-11-invariant-manifolds"></a>
**Invariant manifolds.** Invariant manifolds are preserved by dynamics; stable and unstable manifolds collect trajectories approaching or departing an object. [1] [78] [79]
<a id="term-11-limit-cycles-and-periodic-orbits"></a>
**Limit cycles and periodic orbits.** Periodic orbits repeat after a fixed time; a limit cycle is an isolated periodic orbit. [1] [78] [79]
<a id="term-11-attractors"></a>
**Attractors.** An attractor is an invariant set attracting a neighborhood of states, possibly an equilibrium, periodic orbit, or more complex set. [1] [78] [79]
<a id="term-11-bifurcation-theory"></a>
**Bifurcation theory.** Studies qualitative changes in equilibria or invariant sets as parameters vary, including saddle-node and Hopf bifurcations. [1] [79] [80]
<a id="term-11-chaotic-dynamics"></a>
**Chaotic dynamics.** Studies deterministic systems with complicated long-term behavior, often involving sensitive dependence on initial conditions. [1] [78] [79]
<a id="term-11-hamiltonian-systems"></a>
**Hamiltonian systems.** Conservative dynamics generated by a Hamiltonian, with energy conservation and symplectic structure in autonomous settings. [1] [78] [79]
<a id="term-11-poincare-return-map"></a>
**Poincaré return map.** Maps points on a transverse section to their next return, reducing flow properties to a discrete map. [1] [78] [79]
<a id="term-11-singular-perturbation-and-asymptotic-methods"></a>
**Singular perturbation and asymptotic methods.** Small parameters can create multiple scales or boundary layers; asymptotic expansions approximate solutions across regimes. [1] [78]
<a id="term-11-partial-differential-equation-pde"></a>
**Partial differential equation (PDE).** An equation relating an unknown function of multiple variables to its partial derivatives. [1] [80] [81] Related: [Elliptic PDEs](#term-11-elliptic-pdes); [Parabolic PDEs](#term-11-parabolic-pdes); [Hyperbolic PDEs](#term-11-hyperbolic-pdes).
<a id="term-11-cauchy-and-initial-boundary-value-problems-for-pdes"></a>
**Cauchy and initial-boundary value problems for PDEs.** Specify data on an initial surface, spatial boundary, or both; well-posedness concerns existence, uniqueness, and continuous dependence. [1] [80] [81]
<a id="term-11-method-of-characteristics"></a>
**Method of characteristics.** Converts first-order PDEs to ODEs along curves on which solutions propagate from data. [1] [80] [81]
<a id="term-11-elliptic-pdes"></a>
**Elliptic PDEs.** Model equilibrium or potential problems; Laplace and Poisson equations are canonical examples. [1] [80] [81]
<a id="term-11-parabolic-pdes"></a>
**Parabolic PDEs.** Model diffusive time evolution and smoothing; the heat equation is a basic example. [1] [80] [81] [82]
<a id="term-11-hyperbolic-pdes"></a>
**Hyperbolic PDEs.** Model wave-like propagation with finite-speed signals in standard settings. [1] [80] [81]
<a id="term-11-conservation-laws-and-shocks"></a>
**Conservation laws and shocks.** Express local balance in divergence form; weak solutions may develop shocks requiring entropy selection. [1] [81]
<a id="term-11-weak-solutions"></a>
**Weak solutions.** Satisfy equations after integration against test functions or via variational formulations, allowing limited regularity. [1] [80] [81]
<a id="term-11-evolution-equations-and-semigroups"></a>
**Evolution equations and semigroups.** Describe time development in function spaces; solution operators may form a semigroup. [1] [82]
<a id="term-11-maximum-principle"></a>
**Maximum principle.** For many elliptic and parabolic equations, constrains interior extrema by boundary or initial data. [1] [80]
<a id="term-11-energy-estimates"></a>
**Energy estimates.** Derive a priori bounds by integrating equations against suitable quantities, supporting uniqueness and stability. [1] [80] [81]
<a id="term-11-reactiondiffusion-systems"></a>
**Reaction–diffusion systems.** Combine local nonlinear reaction with spatial diffusion, modeling chemistry, populations, and pattern formation. [1] [82]
<a id="term-11-navierstokes-equations"></a>
**Navier–Stokes equations.** Nonlinear momentum-balance equations for viscous fluids coupled to mass conservation. [1] [82] [85]
<a id="term-11-traveling-waves-and-pattern-formation"></a>
**Traveling waves and pattern formation.** Traveling waves are translating profiles; pattern formation studies structured states and their stability. [1] [82]
<a id="term-11-mathematical-modeling"></a>
**Mathematical modeling.** Translates a system and assumptions into equations, then analyzes or computes implications and compares them with observations. [1] [78] [79] [83]
<a id="term-11-population-dynamics-and-logistic-growth"></a>
**Population dynamics and logistic growth.** Population models describe abundance and interactions; logistic growth adds density limitation and approaches a carrying capacity under standard parameters. [1] [83] [78]
<a id="term-11-compartmental-epidemic-models"></a>
**Compartmental epidemic models.** Represent populations in classes such as susceptible, infectious, and recovered, with ODE transitions encoding rates. [83]
<a id="term-11-canonical-pde-models-laplace-heat-and-wave-equations"></a>
**Canonical PDE models: Laplace, heat, and wave equations.** Laplace/Poisson model potential or steady states, heat models diffusion, and wave equations model propagation. [1] [80] [81]
<a id="term-11-optimal-control-of-differential-equations"></a>
**Optimal control of differential equations.** Chooses controls and trajectories to optimize objectives subject to ODE or PDE constraints. [1]
<a id="term-11-numerical-methods-for-odes-and-pdes"></a>
**Numerical methods for ODEs and PDEs.** Approximate solutions through time stepping and spatial or space-time discretization, requiring stability and convergence analysis. [1] [78] [80]
<a id="term-11-inverse-problems-and-parameter-estimation"></a>
**Inverse problems and parameter estimation.** Infer coefficients, parameters, initial states, or forcing from observations of a differential-equation model. [1] [83]

### Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics

<a id="term-12-mathematical-physics"></a>
**Mathematical physics.** Develops mathematical structures, equations, and methods for formulating and solving physical theories. [1] [86]
<a id="term-12-classical-mechanics"></a>
**Classical mechanics.** Studies motion and equilibrium through forces, constraints, and dynamical laws. [1] [86] Related: [Lagrangian mechanics](#term-12-lagrangian-mechanics); [Hamiltonian mechanics](#term-12-hamiltonian-mechanics); [Noether theorem](#term-12-noether-theorem).
<a id="term-12-lagrangian-mechanics"></a>
**Lagrangian mechanics.** A variational formulation makes the action stationary and yields equations of motion from a Lagrangian. [86]
<a id="term-12-hamiltonian-mechanics"></a>
**Hamiltonian mechanics.** A Hamiltonian generates phase-space evolution through Hamilton’s equations, linking mechanics with symplectic geometry. [86]
<a id="term-12-hamiltonjacobi-theory"></a>
**Hamilton–Jacobi theory.** Encodes mechanical evolution in a first-order PDE for an action function. [1] [86]
<a id="term-12-noether-theorem"></a>
**Noether theorem.** Under appropriate hypotheses, each continuous symmetry of an action yields a conserved quantity or current. [86]
<a id="term-12-classical-field-theory"></a>
**Classical field theory.** Variational theories of fields yield field equations, conservation laws, and often symmetry or gauge structures. [86]
<a id="term-12-action-principle"></a>
**Action principle.** Selects physical evolution or fields by stationarity of an action functional. [86]
<a id="term-12-continuum-mechanics"></a>
**Continuum mechanics.** Models deformable matter continuously using fields for motion, stress, temperature, and other variables with balance and constitutive laws. [1] [87] [92] Related: [Elasticity](#term-12-elasticity); [Fluid mechanics](#term-12-fluid-mechanics); [Balance and constitutive laws](#term-12-balance-and-constitutive-laws).
<a id="term-12-continuum-kinematics"></a>
**Continuum kinematics.** Describes material motion and deformation through maps between reference and current configurations. [87] [92]
<a id="term-12-balance-and-constitutive-laws"></a>
**Balance and constitutive laws.** Balance laws express conservation; constitutive relations specify material response under principles such as thermodynamic consistency. [92]
<a id="term-12-elasticity"></a>
**Elasticity.** Studies reversible deformation in solids, relating stress to strain through constitutive laws. [92]
<a id="term-12-plasticity"></a>
**Plasticity.** Studies irreversible solid deformation, including yield, flow, and hardening. [1] [92]
<a id="term-12-thermodynamics-and-heat-transfer"></a>
**Thermodynamics and heat transfer.** Studies energy, entropy, equilibrium, and irreversible processes, including thermal transport. [1] [87]
<a id="term-12-fluid-mechanics"></a>
**Fluid mechanics.** Studies motion and equilibrium of liquids and gases through conservation laws and constitutive models. [1] [87]
<a id="term-12-euler-equations"></a>
**Euler equations.** Inviscid fluid equations express mass and momentum conservation and model ideal-fluid motion. [1] [87]
<a id="term-12-navierstokes-equations"></a>
**Navier–Stokes equations.** Nonlinear equations for viscous-fluid momentum coupled to mass conservation, modeling many flows. [1] [87] [90]
<a id="term-12-vorticity-and-turbulence"></a>
**Vorticity and turbulence.** Vorticity measures local fluid rotation; turbulence is complex, typically multiscale flow analyzed by PDE, statistical, and computational methods. [87] [90]
<a id="term-12-boundary-layers-and-lubrication-theory"></a>
**Boundary layers and lubrication theory.** Asymptotic methods analyze thin regions or narrow gaps where viscous effects and geometry yield reduced flow equations. [87]
<a id="term-12-electromagnetic-field-theory"></a>
**Electromagnetic field theory.** Maxwell’s equations describe electric and magnetic fields, their sources, evolution, and charge conservation. [1] [86] [87]
<a id="term-12-special-relativity"></a>
**Special relativity.** Studies spacetime and physical laws invariant under Lorentz transformations. [1] [86]
<a id="term-12-general-relativity"></a>
**General relativity.** A geometrical theory of gravitation coupling dynamical spacetime geometry to matter through Einstein’s equations. [1] [86] [91]
<a id="term-12-quantum-mechanics"></a>
**Quantum mechanics.** Represents states in Hilbert spaces and observables by operators, with probabilities and evolution governed by quantum postulates. [1] [51] [93] Related: [Schrödinger equation](#term-12-schrodinger-equation); [Spectral theory of quantum operators](#term-12-spectral-theory-of-quantum-operators); [Quantum field theory](#term-12-quantum-field-theory).
<a id="term-12-schrodinger-equation"></a>
**Schrödinger equation.** A quantum state evolves linearly under a Hamiltonian operator; stationary states solve an associated eigenvalue problem. [1] [51] [89]
<a id="term-12-spectral-theory-of-quantum-operators"></a>
**Spectral theory of quantum operators.** Studies spectra, eigenstates, and functional calculi of self-adjoint operators, central to quantum energies and evolution. [1] [89]
<a id="term-12-quantum-field-theory"></a>
**Quantum field theory.** Combines quantum theory and relativity, modeling fields and particle creation or annihilation through operator or functional-integral methods. [1] [88] [93]
<a id="term-12-gauge-theory-and-yangmills-fields"></a>
**Gauge theory and Yang–Mills fields.** Local symmetry fields are described by connections; Yang–Mills equations govern gauge fields. [86] [93]
<a id="term-12-statistical-mechanics"></a>
**Statistical mechanics.** Derives macroscopic thermodynamic behavior from probabilistic ensembles using partition functions and free energies. [1] [87]
<a id="term-12-kinetic-theory-and-boltzmann-equation"></a>
**Kinetic theory and Boltzmann equation.** Models particle systems through distribution functions in position and velocity, with transport and collision equations. [1] [87]
<a id="term-12-wave-and-heat-equations"></a>
**Wave and heat equations.** Canonical hyperbolic and parabolic PDEs model propagation and diffusion across mechanics and field theories. [1] [51]
<a id="term-12-solitons-and-nonlinear-waves"></a>
**Solitons and nonlinear waves.** Localized coherent nonlinear wave structures studied through integrable equations, stability, and applications. [1]
<a id="term-12-perturbation-and-asymptotic-methods"></a>
**Perturbation and asymptotic methods.** Approximate solutions across scales using expansions, boundary-layer analysis, and matched asymptotics. [87]
<a id="term-12-computational-mechanics"></a>
**Computational mechanics.** Numerically models mechanical and continuum systems by discretizing governing PDEs or variational principles. [1] [92]

### Interdisciplinary applications: research gap

The supplied research identified this domain as not researched in the current run: no vetted terms, MSC crosswalk, or sources were provided. It is therefore excluded from the glossary and index until supported research is available.

## Alphabetical index

Every glossary entry is listed below, with a link to its domain section. Related concepts often appear in more than one domain; each included term is indexed once under its glossary heading.

- [Abelian varieties](#term-3-abelian-varieties) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Absolute continuity and differentiation](#term-6-absolute-continuity-and-differentiation) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Abstract harmonic analysis](#term-6-abstract-harmonic-analysis) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Action principle](#term-12-action-principle) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Adaptive mesh refinement](#term-9-adaptive-mesh-refinement) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Additive number theory](#term-3-additive-number-theory) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Adjunction](#term-1-adjunction) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Affine geometry](#term-4-affine-geometry) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Affine space and affine combinations](#term-4-affine-space-and-affine-combinations) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Algebraic geometry](#term-4-algebraic-geometry) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Algebraic graph theory](#term-7-algebraic-graph-theory) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Algebraic K-theory](#term-2-algebraic-k-theory) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Algebraic number theory](#term-3-algebraic-number-theory) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Algebraic structures and universal algebra](#term-2-algebraic-structures-and-universal-algebra) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Algebraic variety](#term-4-algebraic-variety) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Algorithm analysis and asymptotic complexity](#term-7-algorithm-analysis-and-asymptotic-complexity) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Analysis in quantum mechanics](#term-6-analysis-in-quantum-mechanics) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Analytic number theory](#term-3-analytic-number-theory) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Antichains and Sperner theory](#term-7-antichains-and-sperner-theory) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Approximation algorithms](#term-7-approximation-algorithms) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Approximation and interpolation](#term-9-approximation-and-interpolation) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Arithmetic cryptography](#term-3-arithmetic-cryptography) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Arithmetic functions](#term-3-arithmetic-functions) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Arithmetic geometry and Diophantine geometry](#term-3-arithmetic-geometry-and-diophantine-geometry) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Arithmetic of function fields and finite fields](#term-3-arithmetic-of-function-fields-and-finite-fields) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Associative algebras](#term-2-associative-algebras) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Attractors](#term-11-attractors) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Automata and formal languages](#term-7-automata-and-formal-languages) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Automatic differentiation](#term-9-automatic-differentiation) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Axiom of choice](#term-1-axiom-of-choice) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Axiomatic set theory (ZFC)](#term-1-axiomatic-set-theory-zfc) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Baire category theorem](#term-5-baire-category-theorem) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Balance and constitutive laws](#term-12-balance-and-constitutive-laws) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Banach and Hilbert spaces](#term-6-banach-and-hilbert-spaces) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Barycentric coordinates](#term-4-barycentric-coordinates) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Basis and standard space constructions](#term-5-basis-and-standard-space-constructions) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Bayesian statistics](#term-8-bayesian-statistics) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Bayes’ theorem](#term-8-bayes-theorem) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Bifurcation theory](#term-11-bifurcation-theory) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Bilinear and quadratic forms](#term-2-bilinear-and-quadratic-forms) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Birational geometry](#term-4-birational-geometry) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Boolean algebra](#term-1-boolean-algebra) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Boolean satisfiability and SAT](#term-7-boolean-satisfiability-and-sat) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Bootstrap and resampling](#term-8-bootstrap-and-resampling) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Boundary layers and lubrication theory](#term-12-boundary-layers-and-lubrication-theory) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Boundary-value problem for ODEs](#term-11-boundary-value-problem-for-odes) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Brownian motion](#term-8-brownian-motion) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Brunn–Minkowski theory](#term-4-brunnminkowski-theory) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Calculus of variations](#term-6-calculus-of-variations) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Canonical PDE models: Laplace, heat, and wave equations](#term-11-canonical-pde-models-laplace-heat-and-wave-equations) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Carathéodory’s theorem](#term-4-caratheodorys-theorem) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Cardinals](#term-1-cardinals) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Categorical logic](#term-1-categorical-logic) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Category theory](#term-2-category-theory) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Category theory](#term-1-category-theory) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Cauchy and initial-boundary value problems for PDEs](#term-11-cauchy-and-initial-boundary-value-problems-for-pdes) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Cauchy integral theory](#term-6-cauchy-integral-theory) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Causal inference](#term-8-causal-inference) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Central limit and invariance principles](#term-8-central-limit-and-invariance-principles) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Chaotic dynamics](#term-11-chaotic-dynamics) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Characteristic classes](#term-5-characteristic-classes) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Chebotarev density theorem](#term-3-chebotarev-density-theorem) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Class field theory](#term-3-class-field-theory) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Classical field theory](#term-12-classical-field-theory) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Classical mechanics](#term-12-classical-mechanics) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Classical propositional logic](#term-1-classical-propositional-logic) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Cobordism](#term-5-cobordism) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Combinatorial optimization](#term-7-combinatorial-optimization) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Combinatorial optimization](#term-10-combinatorial-optimization) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Combinatorics](#term-7-combinatorics) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Commutative algebra](#term-2-commutative-algebra) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Commutative algebraic geometry interface](#term-2-commutative-algebraic-geometry-interface) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Compact operators](#term-6-compact-operators) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Compactness](#term-5-compactness) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Compartmental epidemic models](#term-11-compartmental-epidemic-models) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Completeness and compactness](#term-1-completeness-and-compactness) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Complex analysis](#term-6-complex-analysis) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Computability theory](#term-7-computability-theory) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Computability theory](#term-1-computability-theory) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Computational complexity theory](#term-7-computational-complexity-theory) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Computational geometry](#term-9-computational-geometry) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Computational mechanics](#term-12-computational-mechanics) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Computational methods for dynamical systems](#term-9-computational-methods-for-dynamical-systems) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Computational number theory](#term-3-computational-number-theory) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Concentration inequalities](#term-8-concentration-inequalities) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Conditional probability and expectation](#term-8-conditional-probability-and-expectation) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Conditioning](#term-9-conditioning) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Confidence intervals](#term-8-confidence-intervals) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Congruences and elementary arithmetic](#term-3-congruences-and-elementary-arithmetic) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Connectedness](#term-5-connectedness) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Conservation laws and shocks](#term-11-conservation-laws-and-shocks) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Constructive mathematics](#term-1-constructive-mathematics) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Continued fractions](#term-3-continued-fractions) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Continuous maps and homeomorphisms](#term-5-continuous-maps-and-homeomorphisms) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Continuum kinematics](#term-12-continuum-kinematics) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Continuum mechanics](#term-12-continuum-mechanics) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Control theory](#term-10-control-theory) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Controllability and observability](#term-10-controllability-and-observability) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Convergence and error analysis](#term-9-convergence-and-error-analysis) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Convex body](#term-4-convex-body) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Convex optimization](#term-10-convex-optimization) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Convex polytope](#term-4-convex-polytope) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Convex set](#term-4-convex-set) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Convolution and Fourier multipliers](#term-6-convolution-and-fourier-multipliers) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Cooperative game theory and the core](#term-10-cooperative-game-theory-and-the-core) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Covering-space theory](#term-5-covering-space-theory) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Cross-ratio](#term-4-cross-ratio) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Curvature](#term-4-curvature) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Cut elimination and normalization](#term-1-cut-elimination-and-normalization) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [CW complexes](#term-5-cw-complexes) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Derived categories and triangulated methods](#term-2-derived-categories-and-triangulated-methods) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Descriptive set theory](#term-1-descriptive-set-theory) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Design of experiments](#term-8-design-of-experiments) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Design theory](#term-7-design-theory) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Differential forms](#term-4-differential-forms) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Differential-algebraic equations](#term-9-differential-algebraic-equations) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Dimension theory](#term-5-dimension-theory) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Diophantine approximation](#term-3-diophantine-approximation) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Diophantine equations](#term-3-diophantine-equations) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Direct linear-system methods](#term-9-direct-linear-system-methods) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Direct methods in the calculus of variations](#term-6-direct-methods-in-the-calculus-of-variations) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Discrete geometry](#term-4-discrete-geometry) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Discrete probability](#term-7-discrete-probability) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Discrete structures in computing](#term-7-discrete-structures-in-computing) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Distribution theory](#term-6-distribution-theory) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Division and central simple algebras](#term-2-division-and-central-simple-algebras) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Divisor](#term-4-divisor) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Dual spaces and Hahn–Banach theorem](#term-6-dual-spaces-and-hahnbanach-theorem) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Dynamic programming](#term-7-dynamic-programming) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Dynamic programming](#term-10-dynamic-programming) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Dynamical system and flow](#term-11-dynamical-system-and-flow) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Eigenvalue and singular-value computation](#term-9-eigenvalue-and-singular-value-computation) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Elasticity](#term-12-elasticity) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Electromagnetic field theory](#term-12-electromagnetic-field-theory) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Elliptic curves](#term-3-elliptic-curves) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Elliptic PDEs](#term-11-elliptic-pdes) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Energy estimates](#term-11-energy-estimates) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Enumerative combinatorics](#term-7-enumerative-combinatorics) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Enumerative geometry](#term-4-enumerative-geometry) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Equilibria and linearization](#term-11-equilibria-and-linearization) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Erlangen program](#term-4-erlangen-program) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Euclidean geometry](#term-4-euclidean-geometry) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Euler equations](#term-12-euler-equations) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Evolution equations and semigroups](#term-11-evolution-equations-and-semigroups) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Evolutionary game theory](#term-10-evolutionary-game-theory) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Expected-utility decision theory](#term-10-expected-utility-decision-theory) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Exploratory data analysis](#term-8-exploratory-data-analysis) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Exponential and character sums](#term-3-exponential-and-character-sums) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Ext and Tor](#term-2-ext-and-tor) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Extremal combinatorics](#term-7-extremal-combinatorics) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Face vector](#term-4-face-vector) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Fast Fourier transform](#term-9-fast-fourier-transform) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Feedback control](#term-10-feedback-control) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Fiber bundles and fibrations](#term-5-fiber-bundles-and-fibrations) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Fields and field extensions](#term-2-fields-and-field-extensions) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Finite-difference methods](#term-9-finite-difference-methods) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Finite-element methods](#term-9-finite-element-methods) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Finite-volume methods](#term-9-finite-volume-methods) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [First variation and Euler–Lagrange equations](#term-6-first-variation-and-eulerlagrange-equations) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [First-order logic](#term-1-first-order-logic) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Floating-point arithmetic](#term-9-floating-point-arithmetic) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Fluid mechanics](#term-12-fluid-mechanics) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Forcing](#term-1-forcing) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Formal language and signature](#term-1-formal-language-and-signature) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Four-manifold topology](#term-5-four-manifold-topology) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Fourier methods in signal processing and mathematical physics](#term-6-fourier-methods-in-signal-processing-and-mathematical-physics) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Fourier transform](#term-6-fourier-transform) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Fubini–Tonelli theorems](#term-6-fubinitonelli-theorems) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Functional analysis](#term-6-functional-analysis) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Functional data analysis](#term-8-functional-data-analysis) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Functors and natural transformations](#term-1-functors-and-natural-transformations) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Fundamental Banach-space theorems](#term-6-fundamental-banach-space-theorems) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Fundamental group](#term-5-fundamental-group) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Galois representations](#term-3-galois-representations) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Galois theory](#term-2-galois-theory) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Game theory](#term-10-game-theory) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Gauge theory and Yang–Mills fields](#term-12-gauge-theory-and-yangmills-fields) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [General relativity](#term-12-general-relativity) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Generating function](#term-7-generating-function) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Geodesic](#term-4-geodesic) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Geometric group theory](#term-5-geometric-group-theory) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Geometric rigidity](#term-4-geometric-rigidity) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Geometric topology](#term-5-geometric-topology) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Geometry of numbers](#term-3-geometry-of-numbers) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Graph coloring](#term-7-graph-coloring) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Graph theory](#term-7-graph-theory) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Grothendieck groups and K₀](#term-2-grothendieck-groups-and-k0) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Group actions](#term-2-group-actions) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Groups](#term-2-groups) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Gröbner bases and computational algebra](#term-2-grobner-bases-and-computational-algebra) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Hamiltonian mechanics](#term-12-hamiltonian-mechanics) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Hamiltonian systems](#term-11-hamiltonian-systems) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Hamilton–Jacobi theory](#term-12-hamiltonjacobi-theory) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Hamilton–Jacobi–Bellman equation](#term-10-hamiltonjacobibellman-equation) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Harmonic analysis](#term-6-harmonic-analysis) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Hasse diagram](#term-7-hasse-diagram) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Helly’s theorem](#term-4-hellys-theorem) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Heyting algebra](#term-1-heyting-algebra) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [High-performance scientific computing](#term-9-high-performance-scientific-computing) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Higher homotopy groups](#term-5-higher-homotopy-groups) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Holomorphic function](#term-6-holomorphic-function) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Homogeneous coordinates](#term-4-homogeneous-coordinates) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Homological algebra](#term-2-homological-algebra) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Homology and cohomology](#term-5-homology-and-cohomology) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Homotopy and homotopy equivalence](#term-5-homotopy-and-homotopy-equivalence) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Homotopy type theory and univalent foundations](#term-1-homotopy-type-theory-and-univalent-foundations) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Hopf algebras](#term-2-hopf-algebras) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Hybrid symbolic-numeric computation](#term-9-hybrid-symbolic-numeric-computation) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Hyperbolic PDEs](#term-11-hyperbolic-pdes) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Hypothesis testing](#term-8-hypothesis-testing) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Ideal class groups and units](#term-3-ideal-class-groups-and-units) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Ideals and quotient rings](#term-2-ideals-and-quotient-rings) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Inclusion–exclusion principle](#term-7-inclusionexclusion-principle) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Independence](#term-8-independence) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Initial-value problem and well-posedness for ODEs](#term-11-initial-value-problem-and-well-posedness-for-odes) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Integer and mixed-integer programming](#term-10-integer-and-mixed-integer-programming) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Intersection theory](#term-4-intersection-theory) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Interval and verified computation](#term-9-interval-and-verified-computation) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Invariant manifolds](#term-11-invariant-manifolds) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Invariant theory](#term-2-invariant-theory) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Inventory theory](#term-10-inventory-theory) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Inverse problems and parameter estimation](#term-11-inverse-problems-and-parameter-estimation) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Itô calculus and stochastic differential equations](#term-8-ito-calculus-and-stochastic-differential-equations) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Kinetic theory and Boltzmann equation](#term-12-kinetic-theory-and-boltzmann-equation) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Knot and link theory](#term-5-knot-and-link-theory) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Krylov and iterative methods](#term-9-krylov-and-iterative-methods) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Lagrangian duality and KKT conditions](#term-10-lagrangian-duality-and-kkt-conditions) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Lagrangian mechanics](#term-12-lagrangian-mechanics) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Langlands program](#term-3-langlands-program) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Large cardinal axioms](#term-1-large-cardinal-axioms) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Lattice theory](#term-7-lattice-theory) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Laws of large numbers and ergodic averages](#term-8-laws-of-large-numbers-and-ergodic-averages) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Least squares and inverse problems](#term-9-least-squares-and-inverse-problems) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Lebesgue integral](#term-6-lebesgue-integral) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Lebesgue measure](#term-6-lebesgue-measure) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Lie algebras](#term-2-lie-algebras) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Limit cycles and periodic orbits](#term-11-limit-cycles-and-periodic-orbits) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Limits and colimits](#term-1-limits-and-colimits) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Linear algebra and vector spaces](#term-2-linear-algebra-and-vector-spaces) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Linear algebraic groups](#term-2-linear-algebraic-groups) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Linear programming](#term-10-linear-programming) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Linear systems and Floquet theory](#term-11-linear-systems-and-floquet-theory) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Local fields and p-adic numbers](#term-3-local-fields-and-p-adic-numbers) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Local-global principles and the Hasse principle](#term-3-local-global-principles-and-the-hasse-principle) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Localization and local rings](#term-2-localization-and-local-rings) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Lp spaces](#term-6-lp-spaces) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Lyapunov stability](#term-11-lyapunov-stability) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Lévy processes](#term-8-levy-processes) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Mapping class groups](#term-5-mapping-class-groups) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Markov chains and processes](#term-8-markov-chains-and-processes) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Markov decision process](#term-10-markov-decision-process) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Martingales](#term-8-martingales) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Matchings and Hall’s theorem](#term-7-matchings-and-halls-theorem) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Mathematical induction and recursion](#term-1-mathematical-induction-and-recursion) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Mathematical logic](#term-1-mathematical-logic) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Mathematical modeling](#term-11-mathematical-modeling) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Mathematical optimization](#term-10-mathematical-optimization) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Mathematical physics](#term-12-mathematical-physics) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Mathematical structure and algebraic system](#term-1-mathematical-structure-and-algebraic-system) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Matrix theory and canonical forms](#term-2-matrix-theory-and-canonical-forms) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Matroid theory](#term-7-matroid-theory) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Maximum principle](#term-11-maximum-principle) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Measure convergence theorems](#term-6-measure-convergence-theorems) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Measure space](#term-6-measure-space) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Mechanism design](#term-10-mechanism-design) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Method of characteristics](#term-11-method-of-characteristics) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Metrization theory](#term-5-metrization-theory) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Minkowski addition](#term-4-minkowski-addition) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Model predictive control](#term-10-model-predictive-control) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Model theory](#term-1-model-theory) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Modular and automorphic forms](#term-3-modular-and-automorphic-forms) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Modules](#term-2-modules) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Moduli space](#term-4-moduli-space) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Monte Carlo and Markov chain Monte Carlo](#term-8-monte-carlo-and-markov-chain-monte-carlo) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Monte Carlo methods](#term-9-monte-carlo-methods) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Morse theory](#term-5-morse-theory) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Multi-criteria decision analysis](#term-10-multi-criteria-decision-analysis) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Multigrid and domain decomposition](#term-9-multigrid-and-domain-decomposition) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Multiobjective optimization](#term-10-multiobjective-optimization) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Multivariate analysis and principal component analysis](#term-8-multivariate-analysis-and-principal-component-analysis) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Möbius inversion on posets](#term-7-mobius-inversion-on-posets) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Nash equilibrium](#term-10-nash-equilibrium) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Navier–Stokes equations](#term-12-navierstokes-equations) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Navier–Stokes equations](#term-11-navierstokes-equations) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Network flow](#term-7-network-flow) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Network optimization](#term-10-network-optimization) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Newton and homotopy methods](#term-9-newton-and-homotopy-methods) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Noether theorem](#term-12-noether-theorem) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Noetherian rings and modules](#term-2-noetherian-rings-and-modules) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Nonassociative algebras](#term-2-nonassociative-algebras) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Noncommutative ring theory](#term-2-noncommutative-ring-theory) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Noncooperative games](#term-10-noncooperative-games) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Nonlinear equation solving](#term-9-nonlinear-equation-solving) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Nonlinear programming](#term-10-nonlinear-programming) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Nonparametric statistics](#term-8-nonparametric-statistics) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Numerical algebraic geometry](#term-9-numerical-algebraic-geometry) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Numerical analysis](#term-9-numerical-analysis) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Numerical differentiation](#term-9-numerical-differentiation) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Numerical linear algebra](#term-9-numerical-linear-algebra) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Numerical methods for ODEs and PDEs](#term-11-numerical-methods-for-odes-and-pdes) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Numerical optimization](#term-9-numerical-optimization) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Numerical quadrature and cubature](#term-9-numerical-quadrature-and-cubature) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Numerical solution of ODEs](#term-9-numerical-solution-of-odes) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Numerical stability and backward error](#term-9-numerical-stability-and-backward-error) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Numerical stochastic differential equations](#term-9-numerical-stochastic-differential-equations) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Obstruction theory](#term-5-obstruction-theory) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Operations research](#term-10-operations-research) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Operator spectrum and resolvent](#term-6-operator-spectrum-and-resolvent) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Optimal control](#term-6-optimal-control) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Optimal control](#term-10-optimal-control) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Optimal control of differential equations](#term-11-optimal-control-of-differential-equations) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Order theory and lattices](#term-1-order-theory-and-lattices) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Ordinals](#term-1-ordinals) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Ordinary differential equation (ODE)](#term-11-ordinary-differential-equation-ode) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [P versus NP](#term-7-p-versus-np) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Parabolic PDEs](#term-11-parabolic-pdes) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Partial differential equation (PDE)](#term-11-partial-differential-equation-pde) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Partially ordered sets](#term-7-partially-ordered-sets) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Paths and connectivity](#term-7-paths-and-connectivity) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [PDE discretization](#term-9-pde-discretization) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Perturbation and asymptotic methods](#term-12-perturbation-and-asymptotic-methods) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Planar graphs](#term-7-planar-graphs) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Plancherel and Hausdorff–Young theorems](#term-6-plancherel-and-hausdorffyoung-theorems) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Plasticity](#term-12-plasticity) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Poincaré duality](#term-5-poincare-duality) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Poincaré return map](#term-11-poincare-return-map) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Pointwise and uniform convergence](#term-6-pointwise-and-uniform-convergence) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Poisson processes and point processes](#term-8-poisson-processes-and-point-processes) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Polynomial algorithms and Gröbner bases](#term-9-polynomial-algorithms-and-grobner-bases) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Pontryagin maximum principle](#term-10-pontryagin-maximum-principle) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Population dynamics and logistic growth](#term-11-population-dynamics-and-logistic-growth) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Potential theory and harmonic functions](#term-6-potential-theory-and-harmonic-functions) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Preconditioning](#term-9-preconditioning) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Prime number theorem](#term-3-prime-number-theorem) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Prime numbers and factorization](#term-3-prime-numbers-and-factorization) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Primes in arithmetic progressions](#term-3-primes-in-arithmetic-progressions) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Probabilistic method](#term-7-probabilistic-method) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Probabilistic number theory and arithmetic statistics](#term-3-probabilistic-number-theory-and-arithmetic-statistics) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Probability space](#term-8-probability-space) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Projective completion](#term-4-projective-completion) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Projective duality](#term-4-projective-duality) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Projective geometry](#term-4-projective-geometry) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Proof theory](#term-1-proof-theory) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Quadratic forms](#term-3-quadratic-forms) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Quantum field theory](#term-12-quantum-field-theory) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Quantum mechanics](#term-12-quantum-mechanics) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Queueing theory](#term-10-queueing-theory) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Quiver representations](#term-2-quiver-representations) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Radon–Nikodym theorem](#term-6-radonnikodym-theorem) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Ramsey theory](#term-7-ramsey-theory) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Random fields and spatial processes](#term-8-random-fields-and-spatial-processes) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Random graphs](#term-7-random-graphs) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Random variable and distribution](#term-8-random-variable-and-distribution) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Rational points and heights](#term-3-rational-points-and-heights) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Reaction–diffusion systems](#term-11-reactiondiffusion-systems) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Real analysis](#term-6-real-analysis) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Reciprocity laws](#term-3-reciprocity-laws) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Recurrence relation](#term-7-recurrence-relation) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Regression and generalized linear models](#term-8-regression-and-generalized-linear-models) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Regularization](#term-9-regularization) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Representation theory](#term-2-representation-theory) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Representations of groups and group algebras](#term-2-representations-of-groups-and-group-algebras) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Residue calculus](#term-6-residue-calculus) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Riemannian geometry](#term-4-riemannian-geometry) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Riemannian metric](#term-4-riemannian-metric) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Rings and ring homomorphisms](#term-2-rings-and-ring-homomorphisms) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Robust optimization](#term-10-robust-optimization) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Sampling theory and survey sampling](#term-8-sampling-theory-and-survey-sampling) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Scheduling theory](#term-10-scheduling-theory) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Scheme](#term-4-scheme) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Schrödinger equation](#term-12-schrodinger-equation) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Separation axioms](#term-5-separation-axioms) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Several complex variables](#term-6-several-complex-variables) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Shape theory](#term-5-shape-theory) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Shapley value](#term-10-shapley-value) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Sieve methods](#term-3-sieve-methods) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Simulation optimization](#term-10-simulation-optimization) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Singular perturbation and asymptotic methods](#term-11-singular-perturbation-and-asymptotic-methods) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Smooth manifold](#term-4-smooth-manifold) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Smooth structure and differential topology](#term-5-smooth-structure-and-differential-topology) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Sobolev spaces](#term-6-sobolev-spaces) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Solitons and nonlinear waves](#term-12-solitons-and-nonlinear-waves) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Special relativity](#term-12-special-relativity) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Spectral and collocation methods](#term-9-spectral-and-collocation-methods) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Spectral sequences](#term-5-spectral-sequences) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Spectral theorem](#term-6-spectral-theorem) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Spectral theory of quantum operators](#term-12-spectral-theory-of-quantum-operators) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Spline methods](#term-9-spline-methods) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Stability and Lyapunov methods](#term-10-stability-and-lyapunov-methods) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Statistical estimation](#term-8-statistical-estimation) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Statistical learning](#term-8-statistical-learning) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Statistical mechanics](#term-12-statistical-mechanics) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Statistical model and likelihood](#term-8-statistical-model-and-likelihood) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Stiff differential equations](#term-9-stiff-differential-equations) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Stochastic control](#term-10-stochastic-control) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Stochastic process](#term-8-stochastic-process) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Stochastic programming](#term-10-stochastic-programming) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Support function](#term-4-support-function) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Surgery theory and the h-cobordism theorem](#term-5-surgery-theory-and-the-h-cobordism-theorem) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Survival analysis](#term-8-survival-analysis) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Symbolic computation and computer algebra](#term-9-symbolic-computation-and-computer-algebra) — [Numerical analysis, scientific computing, symbolic computation, and computational mathematics](#numerical-analysis-scientific-computing-symbolic-computation-and-computational-mathematics)
- [Symplectic geometry](#term-4-symplectic-geometry) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Tensor and multilinear algebra](#term-2-tensor-and-multilinear-algebra) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Thermodynamics and heat transfer](#term-12-thermodynamics-and-heat-transfer) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Three-manifold topology and geometrization](#term-5-three-manifold-topology-and-geometrization) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Time-series analysis](#term-8-time-series-analysis) — [Probability, stochastic processes, statistics, and data-oriented mathematical theory](#probability-stochastic-processes-statistics-and-data-oriented-mathematical-theory)
- [Topological manifold](#term-5-topological-manifold) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Topological quantum field theory and quantum invariants](#term-5-topological-quantum-field-theory-and-quantum-invariants) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Topological space](#term-5-topological-space) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Topos](#term-1-topos) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Transcendence theory](#term-3-transcendence-theory) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Transversality and intersection theory](#term-5-transversality-and-intersection-theory) — [Topology: general, algebraic, geometric, low-dimensional, and manifold theory](#topology-general-algebraic-geometric-low-dimensional-and-manifold-theory)
- [Traveling waves and pattern formation](#term-11-traveling-waves-and-pattern-formation) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Trees and spanning trees](#term-7-trees-and-spanning-trees) — [Combinatorics, graph theory, order theory, discrete mathematics, and theoretical computer science](#combinatorics-graph-theory-order-theory-discrete-mathematics-and-theoretical-computer-science)
- [Triangulation](#term-4-triangulation) — [Geometry: Euclidean, affine, projective, convex, discrete, differential, and algebraic geometry](#geometry-euclidean-affine-projective-convex-discrete-differential-and-algebraic-geometry)
- [Type theory](#term-1-type-theory) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Ultraproduct](#term-1-ultraproduct) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Undecidability and reducibility](#term-1-undecidability-and-reducibility) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Universal algebra](#term-1-universal-algebra) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Universal enveloping algebras](#term-2-universal-enveloping-algebras) — [Algebra: structures, linear algebra, commutative and noncommutative algebra, representation theory](#algebra-structures-linear-algebra-commutative-and-noncommutative-algebra-representation-theory)
- [Universal property](#term-1-universal-property) — [Logic, foundations, set theory, category theory, and general mathematical methods](#logic-foundations-set-theory-category-theory-and-general-mathematical-methods)
- [Vorticity and turbulence](#term-12-vorticity-and-turbulence) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Wave and heat equations](#term-12-wave-and-heat-equations) — [Mathematical physics, mechanics, relativity, quantum theory, fluids, and continuum mathematics](#mathematical-physics-mechanics-relativity-quantum-theory-fluids-and-continuum-mathematics)
- [Weak and weak-star topologies](#term-6-weak-and-weak-star-topologies) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Weak solutions](#term-11-weak-solutions) — [Ordinary and partial differential equations, dynamical systems, and mathematical modeling](#ordinary-and-partial-differential-equations-dynamical-systems-and-mathematical-modeling)
- [Weak solutions of partial differential equations](#term-6-weak-solutions-of-partial-differential-equations) — [Analysis: real, complex, functional, harmonic, measure, operator, and calculus of variations](#analysis-real-complex-functional-harmonic-measure-operator-and-calculus-of-variations)
- [Zero-sum games and minimax](#term-10-zero-sum-games-and-minimax) — [Optimization, operations research, game theory, control, and decision mathematics](#optimization-operations-research-game-theory-control-and-decision-mathematics)
- [Zeta and L-functions](#term-3-zeta-and-l-functions) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)
- [Zeta functions of varieties](#term-3-zeta-functions-of-varieties) — [Number theory: elementary, analytic, algebraic, arithmetic geometry, and Diophantine topics](#number-theory-elementary-analytic-algebraic-arithmetic-geometry-and-diophantine-topics)

## Source directory

Sources are numbered once and reused in citations. MSC2020 references support the crosswalk; specialist sources support definitions and subject context.

[1]: https://msc2020.org/MSC_2020.pdf "MSC2020 Mathematics Subject Classification System"
[2]: https://plato.stanford.edu/entries/set-theory/ "Set Theory, Stanford Encyclopedia of Philosophy"
[3]: https://plato.stanford.edu/entries/category-theory/ "Category Theory, Stanford Encyclopedia of Philosophy"
[4]: https://encyclopediaofmath.org/wiki/Algebraic_system "Algebraic system, Encyclopedia of Mathematics"
[5]: https://encyclopediaofmath.org/wiki/Universal_algebra "Universal algebra, Encyclopedia of Mathematics"
[6]: https://encyclopediaofmath.org/wiki/Lattice "Lattice, Encyclopedia of Mathematics"
[7]: https://encyclopediaofmath.org/wiki/Boolean_algebra "Boolean algebra, Encyclopedia of Mathematics"
[8]: https://encyclopediaofmath.org/wiki/Heyting_algebra "Heyting algebra, Encyclopedia of Mathematics"
[9]: https://plato.stanford.edu/entries/proof-theory/ "Proof Theory, Stanford Encyclopedia of Philosophy"
[10]: https://plato.stanford.edu/entries/recursive-functions/ "Recursive Functions, Stanford Encyclopedia of Philosophy"
[11]: https://plato.stanford.edu/entries/type-theory-intuitionistic/ "Intuitionistic Type Theory, Stanford Encyclopedia of Philosophy"
[12]: https://mathscinet.ams.org/msc/msc2020.html "2020 Mathematics Subject Classification — MathSciNet / AMS"
[13]: https://people.maths.ox.ac.uk/flynn/genus2/sheets0405/grfnotes1011.pdf "Groups, Rings and Fields, Oxford University lecture notes"
[14]: https://www.ams.org/books/gsm/233/gsm233-endmatter.pdf "Commutative Algebra, Graduate Studies in Mathematics 233, AMS"
[15]: https://pubs.ams.org/view?ProductCode=GSM/193 "A Tour of Representation Theory, AMS"
[16]: https://encyclopediaofmath.org/wiki/Grothendieck_group "Grothendieck group, Encyclopedia of Mathematics"
[17]: https://mathscinet.ams.org/msc/pdfs/classifications2020.pdf "2020 Mathematics Subject Classification, AMS and zbMATH"
[18]: https://www.jmilne.org/math/CourseNotes/ant.html "Algebraic Number Theory, J.S. Milne"
[19]: https://www.jmilne.org/math/CourseNotes/cft.html "Class Field Theory, J.S. Milne"
[20]: https://kskedlaya.org/ant/chapter-1.html "Notes on analytic number theory, Kiran S. Kedlaya"
[21]: https://www.jmilne.org/math/CourseNotes/MF.pdf "Modular Functions and Modular Forms, J.S. Milne"
[22]: https://www.jmilne.org/math/Books/EC2.pdf "Elliptic Curves, J.S. Milne"
[23]: https://encyclopediaofmath.org/wiki/Diophantine_equations "Diophantine equations, Encyclopedia of Mathematics"
[24]: https://encyclopediaofmath.org/wiki/Geometry "Geometry, Encyclopedia of Mathematics"
[25]: https://encyclopediaofmath.org/wiki/Euclidean_geometry "Euclidean geometry, Encyclopedia of Mathematics"
[26]: https://encyclopediaofmath.org/wiki/Affine_geometry "Affine geometry, Encyclopedia of Mathematics"
[27]: https://encyclopediaofmath.org/wiki/Projective_geometry "Projective geometry, Encyclopedia of Mathematics"
[28]: https://encyclopediaofmath.org/wiki/Differential_geometry "Differential geometry, Encyclopedia of Mathematics"
[29]: https://encyclopediaofmath.org/wiki/Algebraic_geometry "Algebraic geometry, Encyclopedia of Mathematics"
[30]: https://encyclopediaofmath.org/wiki/Convex_body "Convex body, Encyclopedia of Mathematics"
[31]: https://www.math.ucla.edu/~pak/geompol8.pdf "Lectures on Discrete and Polyhedral Geometry, Igor Pak"
[32]: https://math.ucr.edu/~res/progeom/pg-all.pdf "Essential Concepts of Projective Geometry, UC Riverside"
[33]: https://stacks.math.columbia.edu/ "The Stacks Project"
[34]: https://encyclopediaofmath.org/wiki/Topological_space "Topological space, Encyclopedia of Mathematics"
[35]: https://encyclopediaofmath.org/wiki/Compact_space "Compact space, Encyclopedia of Mathematics"
[36]: https://encyclopediaofmath.org/wiki/Fundamental_group "Fundamental group, Encyclopedia of Mathematics"
[37]: https://encyclopediaofmath.org/wiki/Manifold "Manifold, Encyclopedia of Mathematics"
[38]: https://pi.math.cornell.edu/~hatcher/AT/AT.pdf "Algebraic Topology, Allen Hatcher"
[39]: https://pi.math.cornell.edu/~hatcher/VBKT/VB.pdf "Vector Bundles and K-Theory, Allen Hatcher"
[40]: https://www.ams.org/surv/069 "Surgery on Compact Manifolds, AMS"
[41]: https://www.claymath.org/millennium/poincare-conjecture/ "Poincaré Conjecture, Clay Mathematics Institute"
[42]: https://www.claymath.org/events/aspects-of-geometric-group-theory/ "Aspects of Geometric Group Theory, Clay Mathematics Institute"
[43]: https://encyclopediaofmath.org/wiki/Measure "Measure, Encyclopedia of Mathematics"
[44]: https://encyclopediaofmath.org/wiki/Functional_analysis "Functional analysis, Encyclopedia of Mathematics"
[45]: https://encyclopediaofmath.org/wiki/Harmonic_analysis "Harmonic analysis, Encyclopedia of Mathematics"
[46]: https://encyclopediaofmath.org/wiki/Calculus_of_variations "Variational calculus, Encyclopedia of Mathematics"
[47]: https://encyclopediaofmath.org/wiki/Lebesgue_integral "Lebesgue integral, Encyclopedia of Mathematics"
[48]: https://encyclopediaofmath.org/wiki/Analytic_function "Analytic function, Encyclopedia of Mathematics"
[49]: https://encyclopediaofmath.org/wiki/Fourier_transform "Fourier transform, Encyclopedia of Mathematics"
[50]: https://encyclopediaofmath.org/wiki/Sobolev_space "Sobolev space, Encyclopedia of Mathematics"
[51]: https://encyclopediaofmath.org/wiki/Spectrum_of_an_operator "Spectrum of an operator, Encyclopedia of Mathematics"
[52]: https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/ "Mathematics for Computer Science, MIT OpenCourseWare"
[53]: https://www.whitman.edu/mathematics/cgt_online/cgt.pdf "An Introduction to Combinatorics and Graph Theory, Whitman College"
[54]: https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/resources/lecture-12-time-complexity/ "Theory of Computation, MIT OpenCourseWare"
[55]: https://dl.acm.org/ccs "ACM Computing Classification System"
[56]: https://encyclopediaofmath.org/wiki/Partially_ordered_set "Partially ordered set, Encyclopedia of Mathematics"
[57]: https://encyclopediaofmath.org/wiki/Jordan-Dedekind_lattice "Jordan-Dedekind lattice, Encyclopedia of Mathematics"
[58]: https://people.math.harvard.edu/~knill/books/KnillProbability.pdf "Probability Theory and Stochastic Processes with Applications"
[59]: https://stats.libretexts.org/Bookshelves/Probability_Theory/Probability_Mathematical_Statistics_and_Stochastic_Processes_%28Siegrist%29 "Probability, Mathematical Statistics, and Stochastic Processes"
[60]: https://www.stat.berkeley.edu/~aldous/205B/pitman_yor_guide_bm.pdf "A Guide to Brownian Motion and Related Stochastic Processes"
[61]: https://plato.stanford.edu/entries/statistics/ "Statistics, Stanford Encyclopedia of Philosophy"
[62]: https://www.itl.nist.gov/div898/handbook/dtoc.htm "NIST/SEMATECH e-Handbook of Statistical Methods"
[63]: https://encyclopediaofmath.org/wiki/Functional_data_analysis "Functional Data Analysis, Encyclopedia of Mathematics"
[64]: https://www.tandfonline.com/doi/abs/10.1198/016214504000001880 "Causal Inference Using Potential Outcomes, JASA"
[65]: https://open.umn.edu/opentextbooks/textbooks/classical-numerical-methods-in-scientific-computing "Classical Numerical Methods in Scientific Computing, TU Delft Open"
[66]: https://web.pdx.edu/~gjay/teaching/mad6407/ "Numerical Analysis course outline, Portland State University"
[67]: https://www.acm.org/special-interest-groups/sigs/sigsam "ACM SIGSAM: Symbolic and Algebraic Manipulation"
[68]: https://link.springer.com/rwe/10.1007/978-3-540-70529-1_450 "Finite Element Methods, Encyclopedia of Applied and Computational Mathematics"
[69]: https://nhigham.com/2015/11/ "Numerical analysis discussions, Nick Higham"
[70]: https://mathscinet.ams.org/mathscinet/msc/msc2020.html?s=49 "MSC2020 Section 49: Calculus of variations and optimal control"
[71]: https://mathscinet.ams.org/mathscinet/msc/msc2020.html?s=90 "MSC2020 Section 90: Operations research and mathematical programming"
[72]: https://mathscinet.ams.org/mathscinet/msc/msc2020.html?s=91 "MSC2020 Section 91: Game theory and related subjects"
[73]: https://mathscinet.ams.org/mathscinet/msc/msc2020.html?s=93 "MSC2020 Section 93: Systems theory and control"
[74]: https://www.informs.org/Explore/History-of-O.R.-Excellence/O.R.-Methodologies/Optimization-Mathematical-Programming "Optimization/Mathematical Programming, INFORMS"
[75]: https://encyclopediaofmath.org/wiki/Games%2C_theory_of "Games, theory of, Encyclopedia of Mathematics"
[76]: https://math.berkeley.edu/~evans/control.course.pdf "An Introduction to Mathematical Optimal Control Theory"
[77]: https://pubsonline.informs.org/doi/10.1287/deca.2020.0408 "Decision Analysis Focus and Trends, INFORMS"
[78]: https://analysisfunction.civilservice.gov.uk/policy-store/an-introductory-guide-to-mcda/ "An Introductory Guide to Multi-Criteria Decision Analysis"
[79]: https://encyclopediaofmath.org/wiki/Discrete_event_system "Discrete event system, Encyclopedia of Mathematics"
[80]: https://bookstore.ams.org/gsm-140/ "Ordinary Differential Equations and Dynamical Systems, AMS"
[81]: https://epubs.siam.org/doi/book/10.1137/1.9780898718232 "Differential Dynamical Systems, SIAM"
[82]: https://www.ams.org/books/gsm/120/gsm120-endmatter.pdf "A Basic Course in Partial Differential Equations, AMS"
[83]: https://www.math.utoronto.ca/ivrii/PDE-textbook/PDE-textbook.pdf "Partial Differential Equations, University of Toronto"
[84]: https://www.ams.org/books/gsm/182/ "Nonlinear PDEs: A Dynamical Systems Approach, AMS"
[85]: https://pubs.ams.org/view?ProductCode=CLRM/77 "Ordinary Differential Equations in the Real World, AMS"
[86]: https://pubs.ams.org/view?ProductCode=GSM/255 "Classical Field Theory for Mathematicians, AMS"
[87]: https://www.maths.cam.ac.uk/postgrad/part-iii/prospective/preparation/resources/continuum-mechanics "Continuum Mechanics, University of Cambridge"
[88]: https://encyclopediaofmath.org/wiki/Quantum_field_theory "Quantum field theory, Encyclopedia of Mathematics"
[89]: https://encyclopediaofmath.org/wiki/Spectral_theory_of_differential_operators "Spectral theory of differential operators, Encyclopedia of Mathematics"
[90]: https://www.claymath.org/millennium/navier-stokes-equation/ "Navier–Stokes Equation, Clay Mathematics Institute"
[91]: https://www.einstein-online.info/en/spotlights/gr/gr-sub07/ "The mathematics behind general relativity, Einstein Online"
[92]: https://authors.library.caltech.edu/records/s9jhk-sn323 "Mathematical foundations of elasticity, CaltechAUTHORS"
[93]: https://bookstore.ams.org/view?ProductCode=SURV/149 "Quantum Field Theory: A Tourist Guide for Mathematicians, AMS"
