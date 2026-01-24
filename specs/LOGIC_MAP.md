# Logic Integration Map (The Wiring Diagram)

## Phase 1: Inch-to-Inch Dashboard Audit

### A. The "Performance Nexus" Header
| Element | Type | Data Source | Logic / Dependency | Refresh Trigger |
| :--- | :--- | :--- | :--- | :--- |
| **System Status** | Dynamic Label | `system_health.status` (Redis/DB) | GET /health -> if healthy "System Online" else "Offline" | Polling (30s) |
| **User Name** | Dynamic Label | `users.full_name` | `SELECT full_name FROM users WHERE id = current_user` | On Load (Auth) |
| **Global Accuracy** | Dynamic KPI | `attempts_aggregated` | `AVG(is_correct) WHERE user_id = X` | Real-time (After Eval) |
| **Total Time** | Dynamic KPI | `attempts.time_taken` | `SUM(time_taken) WHERE user_id = X` | Real-time (After Eval) |
| **Global Score** | Dynamic KPI | `mock_results.score` | `AVG(score) WHERE user_id = X` | On Load |
| **Percentile** | Dynamic KPI | `leaderboard.rank` | `(Rank / Total Users) * 100` | Scheduled Job (Daily) |

### B. The "Performance Stream" (Spline Chart)
| Element | Type | Data Source | Logic / Dependency | Refresh Trigger |
| :--- | :--- | :--- | :--- | :--- |
| **X-Axis (Mock Name)** | Graph Label | `mocks.name` | `SELECT name FROM mocks JOIN attempts ON ... ORDER BY date` | On Load |
| **Y-Axis (Score)** | Graph Point | `attempts.score` | `SELECT score FROM attempts WHERE user_id = X ORDER BY date DESC LIMIT 10` | On Load |
| **Tooltip (Percentile)**| Hover Data | `attempts.percentile` | `SELECT percentile FROM attempts_meta WHERE attempt_id = Y` | On Hover (Cached) |

### C. The "Global Exam Screener" (Heatmap)
| Element | Type | Data Source | Logic / Dependency | Refresh Trigger |
| :--- | :--- | :--- | :--- | :--- |
| **Section Box (VARC)**| Container | `sections` | Static Definition | Static |
| **Topic Box (Algebra)** | Content | `topics.name` | `SELECT DISTINCT topic FROM questions` | On Load |
| **Color State** | Calculated | `topic_mastery` | `IF accuracy > 85% THEN 'Green' ELSE IF ...` | On Load |
| **Accuracy %** | Metric | `attempts_questions` | `COUNT(correct) / COUNT(attempts) GROUP BY topic` | On Load |
| **Avg Time** | Metric | `attempts_questions` | `AVG(time_spent) GROUP BY topic` | On Load |

### D. Action Cards
| Element | Type | Data Source | Logic / Dependency | Refresh Trigger |
| :--- | :--- | :--- | :--- | :--- |
| **Error Log Count** | Dynamic Label | `error_logs` | `COUNT(*) WHERE user_id = X AND status = 'unresolved'` | Real-time |
| **Mock Status** | Dynamic Label | `mocks.status` | `COUNT(*) WHERE status = 'live' AND user_id != attempted` | On Load |

---

## Phase 2: The Sub-Topic Engine Schema

### 1. Database Schema (Supabase/PostgreSQL)

```sql
-- The Questions Table (The Atom)
CREATE TABLE questions (
    id UUID PRIMARY KEY,
    content TEXT,
    correct_option TEXT,
    section TEXT, -- VARC, DILR, QA
    difficulty TEXT,
    created_at TIMESTAMP
);

-- The Tags Table (The Taxonomy)
CREATE TABLE tags (
    id UUID PRIMARY KEY,
    name TEXT UNIQUE, -- "Time Speed Distance", "Trains", "Circular Motion"
    parent_tag_id UUID -- Recursive for "Arithmetic" -> "TSD"
);

-- The Many-to-Many Link (The Web)
CREATE TABLE question_tags (
    question_id UUID REFERENCES questions(id),
    tag_id UUID REFERENCES tags(id),
    weight FLOAT DEFAULT 1.0 -- Importance of this tag in this question
);

-- The User Attempt Stream (The Evidence)
CREATE TABLE user_attempts (
    id UUID PRIMARY KEY,
    user_id UUID,
    question_id UUID,
    selected_option TEXT,
    is_correct BOOLEAN,
    time_spent_seconds INTEGER,
    attempted_at TIMESTAMP
);
```

### 2. The Analytics Logic (SQL)
**Requirement**: "When user fails 'Train crossing bridge', decrement score for 'TSD', 'Trains', 'Relative Speed'."

```sql
-- Real-time Mastery Calculation View
CREATE VIEW user_tag_mastery AS
SELECT 
    ua.user_id,
    t.name as tag_name,
    COUNT(ua.id) as total_attempts,
    SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) as correct_count,
    (SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END)::FLOAT / COUNT(ua.id)) * 100 as accuracy,
    AVG(ua.time_spent_seconds) as avg_speed
FROM user_attempts ua
JOIN question_tags qt ON ua.question_id = qt.question_id
JOIN tags t ON qt.tag_id = t.id
GROUP BY ua.user_id, t.name;
```

---

## Phase 3: Backend API (FastAPI)

### Endpoints

#### 1. Dashboard Aggregate
`GET /api/v1/analytics/dashboard`
- **Purpose**: Feeds the KPI Row and Global Heatmap.
- **Latency**: < 200ms.
- **Optimization**: Use Redis Cache for `user_tag_mastery` view results. Invalidate on new `user_attempts`.

#### 2. Forensics Deep Dive
`GET /api/v1/analytics/forensics`
- **Params**: `?mock_id=X` (Optional), `?granularity=sub_topic`
- **Purpose**: Feeds the Scatter Plot and Data Grid.
- **Response**:
```json
{
  "user_id": "123",
  "weakness_zones": [
    {"tag": "Geometry", "accuracy": 20, "trend": "declining"},
    {"tag": "Algebra", "accuracy": 45, "trend": "stable"}
  ],
  "scatter_data": [
    {"x": "Time Spent", "y": "Accuracy", "r": "Volume", "label": "Geometry"}
  ]
}
```

---

## Phase 4: Execution Plan

1.  **Backend Setup**:
    -   Initialize Supabase/PostgreSQL.
    -   Apply Schema Migration (Phase 2 SQL).
    -   Seed `tags` taxonomy (The Knowledge Graph).

2.  **API Construction**:
    -   Build `routers/analytics.py`.
    -   Implement `services/tag_engine.py` (The logic core).

3.  **Frontend Wiring**:
    -   Create `types/analytics.ts` matching the API response.
    -   Replace `analyticsMasterData.js` with `useAnalyticsQuery` hook (React Query).
    -   Bind `SmartHeatmap` to real `tag_mastery` data.
