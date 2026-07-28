# Configuration Cloudflare D1 (Database SQL)

Cloudflare D1 est la base de données SQL relationnelle serverless au coeur d'IMHOTEP MÉMOIRES.

## Commandes d'initialisation Wrangler

```bash
# 1. Création de la base de données D1
wrangler d1 create imhotep_memoires_db

# 2. Exécution des migrations locales
wrangler d1 execute imhotep_memoires_db --file=./database/schema.sql

# 3. Exécution en production
wrangler d1 execute imhotep_memoires_db --remote --file=./database/schema.sql
```

## Tables enregistrées
- `users`: Comptes étudiants, encadreurs, visiteurs et administrateurs
- `theses`: Mémoires académiques, métadonnées, état de validation et fichiers PDF
- `filieres`: Filières académiques (Génie Informatique, Finance, Droit, etc.)
- `ai_reports`: Rapports de similarité et détection de plagiat IA
- `payments`: Transactions MTN MoMo, Moov Money, Celtis Cash et Visa
- `certificates`: Certificats numériques d'authenticité avec QR Code
- `notifications`: Alerte interne et rappels
- `audit_logs`: Journal d'audit et traçabilité de sécurité
