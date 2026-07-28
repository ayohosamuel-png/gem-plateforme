-- Schema D1 SQLite pour IMHOTEP-MEMOIRES
-- Base de données relationnelle Cloudflare D1

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK(role IN ('student', 'supervisor', 'visitor', 'admin')) NOT NULL,
    avatar_url TEXT,
    university TEXT DEFAULT 'Université d''Abomey-Calavi (UAC)',
    filiere TEXT,
    niveau TEXT CHECK(niveau IN ('Licence', 'Master', 'Doctorat')),
    matricule TEXT,
    department TEXT,
    phone TEXT,
    is_verified INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

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
    keywords TEXT NOT NULL, -- JSON String
    filiere TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_matricule TEXT,
    university TEXT NOT NULL,
    supervisor_id TEXT NOT NULL,
    supervisor_name TEXT NOT NULL,
    jury_members TEXT, -- JSON String
    pdf_url TEXT NOT NULL,
    pdf_file_name TEXT NOT NULL,
    pdf_size_mb REAL NOT NULL,
    status TEXT CHECK(status IN ('DÉPOSÉ', 'ANALYSE_IA', 'EXAMEN_ENCADREUR', 'VALIDÉ_ENCADREUR', 'PUBLIÉ', 'CORRECTION_REQUISE', 'REJETÉ')) DEFAULT 'DÉPOSÉ',
    similarity_score REAL DEFAULT 0.0,
    ai_report_id TEXT,
    is_public INTEGER DEFAULT 1,
    price_fcfa INTEGER DEFAULT 2500,
    downloads_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    validated_at DATETIME,
    supervisor_notes TEXT,
    certificate_id TEXT,
    FOREIGN KEY(student_id) REFERENCES users(id),
    FOREIGN KEY(supervisor_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS ai_reports (
    id TEXT PRIMARY KEY,
    thesis_id TEXT NOT NULL,
    overall_similarity REAL NOT NULL,
    status TEXT NOT NULL,
    citations_percentage REAL NOT NULL,
    paraphrase_percentage REAL NOT NULL,
    exact_match_percentage REAL NOT NULL,
    matches TEXT NOT NULL, -- JSON String
    recommendations TEXT NOT NULL, -- JSON String
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(thesis_id) REFERENCES theses(id)
);

CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    thesis_id TEXT NOT NULL,
    thesis_title TEXT NOT NULL,
    amount_fcfa INTEGER NOT NULL,
    payment_method TEXT CHECK(payment_method IN ('MTN_MOMO', 'MOOV_MONEY', 'CELTIS_CASH', 'VISA_CARD')) NOT NULL,
    phone_number TEXT,
    transaction_ref TEXT UNIQUE NOT NULL,
    status TEXT CHECK(status IN ('PENDING', 'SUCCESS', 'FAILED')) DEFAULT 'PENDING',
    download_token TEXT,
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(thesis_id) REFERENCES theses(id)
);

CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY,
    certificate_number TEXT UNIQUE NOT NULL,
    thesis_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    thesis_title TEXT NOT NULL,
    filiere TEXT NOT NULL,
    university TEXT NOT NULL,
    issue_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    qr_code_url TEXT NOT NULL,
    verification_url TEXT NOT NULL,
    FOREIGN KEY(thesis_id) REFERENCES theses(id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    link_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
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
