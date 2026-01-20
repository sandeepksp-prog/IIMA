# MOCK ANALYSIS SPECIFICATION
**Target System:** Anti Gravity Core  
**Design System:** Dark Neobrutalism (Zinc/Emerald/Rose/Indigo)  
**Reference:** iQuanta Dashboard Snapshots

## 1. The Forensic Layout
**Global Header:** "Analysis Across All Mocks"  
**Layout Container:** `flex-row` with Sidebar and Main Content.

### Sidebar (Filters)
- **Component:** `RadioGroup` (Vertical)
- **Options:**
  - `[x] All` (Default)
  - `[ ] iCAT MOCK 1 2025`
  - `[ ] iCAT MOCK 2 2025` ...
- **Styling:** Zinc-900 sidebar, fixed width (e.g., `w-64`), styling items as selectable pills.

### Main Chart Area (Performance Curve)
- **Visual:** A clean, minimal charted area showing trajectory.
- **Type:** Composed Chart (Line + Scatter).
- **X-Axis:** Mock ID / Time Sequence.
- **Y-Axis:** Percentile / Scaled Score.
- **Tooltip:** `Score: 88, %ile: 94.5`.
- **Style:** Dark background (Zinc-950), Emerald green line for trend, glowing dots for specific mocks.

---

## 2. The Metrics Row (The 5 Pillars)
A horizontal grid of 5 cards, equidistant.
**Container:** `grid grid-cols-5 gap-4 mb-8`

| Card | Icon | Metric | Sub-Metric | Color Token |
| :--- | :--- | :--- | :--- | :--- |
| **Total** | `❓ HelpCircle` | Total Questions | - | `text-slate-400` |
| **Attempted** | `🎯 Target` | Count | % of Total | `text-indigo-400` |
| **Correct** | `✅ CheckCircle` | Count | Accuracy % | `text-emerald-400` |
| **Incorrect** | `❌ XCircle` | Count | Error Rate % | `text-rose-400` |
| **Skipped** | `⏭️ FastForward` | Count | - | `text-purple-400` |

---

## 3. The Granularity Toggle
**Position:** Above Data Grid, Right aligned.  
**UI:** `ToggleGroup` / Segmented Control.  
**States:**
1.  **[ Topics ]** (Aggregate view: Algebra, Arithmetic)
2.  **[ Sub-Topics ]** (Granular view: Logarithms, TSD, P&C)

---

## 4. The Data Grid (Meso-Level Details)
**Structure:** Dense Table / Data-rich Rows.  
**Style:** Bento Row Style (Zinc-900 bg, Zinc-800 border, hover:Zinc-800).

**Columns:**
1.  **Entity Name** (Topic/Subtopic) - *Bold White*
2.  **Total Qs** - *Mono Slate*
3.  **Attempted** - *Mono Indigo*
4.  **Correct** - *Mono Emerald*
5.  **Incorrect** - *Mono Rose*
6.  **Skipped** - *Mono Purple*

**Interaction:** Sorting by any column.

---

## 5. Strength Buckets (Root Cause Analysis)
**Layout:** 3 Column Grid (`grid-cols-3 gap-6`).

### Bucket 1: 🛡️ Weak (Critical)
- **Condition:** Accuracy < 30%
- **Theme:** Amber / Yellow
- **Content:** List of badges/chips of topics.

### Bucket 2: 🛡️ Moderate (Improvement)
- **Condition:** 30% <= Accuracy <= 70%
- **Theme:** Blue
- **Content:** List of badges/chips of topics.

### Bucket 3: 💪 Strong (Mastery)
- **Condition:** Accuracy > 70%
- **Theme:** Green
- **Content:** List of badges/chips of topics.

---

## Implementation Plan
1.  **Component:** Create `components/MockAnalysisEngine.jsx`.
2.  **Router:** Add route/view in `AnalyticsDashboard` -> `Mock Analysis`.
3.  **Data:** Extend `analyticsMasterData.js` to support "All Mocks" aggregation vs "Single Mock" filtering.

---

## 6. Master Taxonomy (Extracted from References)
**Source:** iQuanta Mocks Analysis

### VARC (Verbal Ability & Reading Comprehension)
- Critical Reasoning
- Main Idea / Central Idea
- Supporting Idea
- Fact Based
- Inference Based
- Para Summary
- Odd One Out
- Para Completion

### DILR (Data Interpretation & Logical Reasoning)
- Quant Based Reasoning
- Quant Based DI
- Games & Tournaments
- Puzzles
- Caselets

### QA (Quantitative Aptitude)
- Time & Work
- Averages
- Mixture & Alligation
- Profit & Loss
- Time, Speed & Distance
- Factors
- Miscellaneous Numbers
- Divisibility & Remainders
- Triangles
- Mensuration & Coordinate Geometry
- PNC (Permutation & Combination)
- Probability
- Quadratic Equations
- Logarithm
- Functions & Graphs
- Inequalities

