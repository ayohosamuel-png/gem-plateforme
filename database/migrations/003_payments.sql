-- Migration 003: Payments and Certificates
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    thesis_id TEXT NOT NULL,
    thesis_title TEXT NOT NULL,
    amount_fcfa INTEGER NOT NULL,
    payment_method TEXT NOT NULL,
    phone_number TEXT,
    transaction_ref TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'PENDING',
    download_token TEXT,
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
    verification_url TEXT NOT NULL
);
