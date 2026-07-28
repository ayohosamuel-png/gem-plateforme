-- Migration 004: AI Reports, Notifications, and Audit Logs
CREATE TABLE IF NOT EXISTS ai_reports (
    id TEXT PRIMARY KEY,
    thesis_id TEXT NOT NULL,
    overall_similarity REAL NOT NULL,
    status TEXT NOT NULL,
    citations_percentage REAL NOT NULL,
    paraphrase_percentage REAL NOT NULL,
    exact_match_percentage REAL NOT NULL,
    matches TEXT NOT NULL,
    recommendations TEXT NOT NULL,
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    link_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    user_name TEXT,
    action TEXT NOT NULL,
    module TEXT NOT NULL,
    details TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
