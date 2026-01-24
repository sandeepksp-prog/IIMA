-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Core Content Banks (Existing + Enhanced)
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option TEXT NOT NULL,
    difficulty TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    parent_id UUID REFERENCES tags(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question_tags (
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    weight FLOAT DEFAULT 1.0,
    PRIMARY KEY (question_id, tag_id)
);

-- 2. TITAN PROTOCOL: Raw Ingestion Vaults
CREATE TABLE IF NOT EXISTS exams_real (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year INTEGER,
    slot INTEGER,
    section TEXT,
    raw_json JSONB, -- The raw output from Unstructured.io
    pdf_source_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TITAN PROTOCOL: The Mindset Engine
CREATE TABLE IF NOT EXISTS mindset_vectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pattern_name TEXT, -- e.g. "The Trailing Zero Trick"
    trick_description TEXT,
    embedding vector(768), -- Embedding for semantic search
    source_question_id UUID REFERENCES questions(id), -- If derived from specific Q
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TITAN PROTOCOL: Synthetic Output
CREATE TABLE IF NOT EXISTS questions_synthetic (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    generated_from_pattern_id UUID REFERENCES mindset_vectors(id),
    validation_score FLOAT, -- 0.0 to 1.0 from The Critic
    content_json JSONB, -- { question, options, answer, solution }
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. User Interaction (Preserved)
CREATE TABLE IF NOT EXISTS user_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, 
    question_id UUID REFERENCES questions(id),
    selected_option TEXT, 
    is_correct BOOLEAN DEFAULT NULL, 
    time_spent_seconds INTEGER DEFAULT 0,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Analytics Views
DROP VIEW IF EXISTS user_tag_mastery;
CREATE VIEW user_tag_mastery AS
SELECT
    ua.user_id,
    t.name as tag_name,
    t.id as tag_id,
    COUNT(ua.id) as total_attempts,
    SUM(CASE WHEN ua.is_correct = TRUE THEN 1 ELSE 0 END) as correct_count,
    SUM(CASE WHEN ua.is_correct = FALSE AND ua.selected_option IS NOT NULL THEN 1 ELSE 0 END) as wrong_count,
    SUM(CASE WHEN ua.selected_option IS NULL THEN 1 ELSE 0 END) as skipped_count,
    CASE 
        WHEN COUNT(ua.id) = 0 THEN 0 
        ELSE (SUM(CASE WHEN ua.is_correct = TRUE THEN 1 ELSE 0 END)::FLOAT / COUNT(ua.id)::FLOAT) * 100 
    END as accuracy
FROM tags t
JOIN question_tags qt ON t.id = qt.tag_id
JOIN questions q ON qt.question_id = q.id
LEFT JOIN user_attempts ua ON q.id = ua.question_id
GROUP BY ua.user_id, t.id, t.name;
