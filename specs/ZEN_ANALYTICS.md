# Zen Analytics Specification (Project Zen Forensics)

## Philosophy: "Zen Scholar"
**Core Vibe**: "Calm Focus". No visual obstacles. Smooth flow. A distinct departure from the "Dark Mode" aesthetic to a "Paper/Study" aesthetic.

## 1. The Design System
### Palette
| Role | Name | Hex | Usage |
| :--- | :--- | :--- | :--- |
| **Canvas** | Warm Alabaster | `#FFFCF5` | Main Application Background (Not harsh white) |
| **Surface** | Pure White | `#FFFFFF` | Cards, Panels, Modals |
| **Ink** | Graphite | `#3E3E3E` | Primary Text (Softer than #000) |
| **Logic** | Logic Blue | `Bg: #E3F2FD`<br>`Tx: #42A5F5` | Structural elements, Buttons, Info tags |
| **Growth** | Growth Green | `Bg: #E8F5E9`<br>`Tx: #66BB6A` | Success, "Strong" areas, Improvements |
| **Alert** | Soft Coral | `Bg: #FFEBEE`<br>`Tx: #EF5350` | Errors, "Weak" areas (Gentle, non-alarming) |
| **Focus** | Study Gold | `Bg: #FFF8E1`<br>`Bd: #FFCA28` | Highlights, Important notes |

### Physics & Shape
-   **Shadows**: `box-shadow: 0px 4px 20px rgba(0,0,0,0.05)` (Soft, diffused depth).
-   **Borders**: `1px solid #F0F0F0` (Barely visible, just structure).
-   **Radius**: `rounded-2xl` (Smooth, organic curves).

## 2. Component Specifications

### A. The "Forensic" Header
-   **Visual**: A clean, floating white card.
-   **Controls**: Two "Pill" dropdowns (Soft Shadow) for [All Mocks] and [Specific Mock].
-   **Layout**: Floating atop the Alabaster canvas.

### B. The "Performance Stream" (Graph)
-   **Visual**: Smooth spline chart (curved lines), replacing jagged lines.
-   **Style**: "Logic Blue" gradient fill (opacity fade).
-   **Interaction**: Hovering triggers a "Glassmorphism" tooltip (frosted glass effect).

### C. The "5 Pillars" (Metrics Row)
-   **Layout**: 5 Horizontal Cards.
-   **Icons**: Thin, elegant outlines (Lucide React `strokeWidth={1.5}`).
-   **Color Logic**:
    -   **Total**: Grey/Neutral
    -   **Attempted**: Logic Blue
    -   **Correct**: Growth Green
    -   **Incorrect**: Alert Coral
    -   **Skipped**: Mystery Purple (Light Lavender)

### D. The "Granularity Switch"
-   **UI**: iOS-style "Segmented Control".
-   **Animation**: Sliding background pill (Motion Layout).
-   **States**: "Macro View" (Topics) <-> "Micro View" (Sub-topics).

### E. The "Forensic Grid" (Deep Dive Table)
-   **Header**: Muted Beige background (`#FFF8E1` opacity).
-   **Rows**: Pure White background.
-   **Delimiters**: 1px subtle separators.
-   **Tags**: If `Accuracy < 30%`, auto-apply "Soft Coral Pill" tag.

## 3. Implementation Plan
1.  **Theme Config**: Update `tailwind.config.js`.
2.  **Global CSS**: Set `bg-zen-canvas` as body default.
3.  **Refactor**:
    -   Update `AnalyticsDashboard.jsx` to Zen Theme.
    -   Update `MockAnalysisEngine.jsx` to Zen Theme.
    -   Ensure `SectionalMocks.jsx` adapts or remains distinct (User Directive implies "All Over Platform").
