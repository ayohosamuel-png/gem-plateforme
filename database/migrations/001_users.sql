-- Migration 001: Users Table & Seed
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
