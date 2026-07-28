-- Migration 002: Theses and Filieres
CREATE TABLE IF NOT EXISTS filieres (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS theses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    abstract TEXT NOT NULL,
    keywords TEXT NOT NULL,
    filiere TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_matricule TEXT,
    university TEXT NOT NULL,
    supervisor_id TEXT NOT NULL,
    supervisor_name TEXT NOT NULL,
    jury_members TEXT,
    pdf_url TEXT NOT NULL,
    pdf_file_name TEXT NOT NULL,
    pdf_size_mb REAL NOT NULL,
    status TEXT DEFAULT 'DÉPOSÉ',
    similarity_score REAL DEFAULT 0.0,
    ai_report_id TEXT,
    is_public INTEGER DEFAULT 1,
    price_fcfa INTEGER DEFAULT 2500,
    downloads_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    validated_at DATETIME,
    supervisor_notes TEXT,
    certificate_id TEXT
);
