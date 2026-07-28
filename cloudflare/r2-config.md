# Configuration Cloudflare R2 Storage

Cloudflare R2 assure le stockage zéro-frais de sortie (Zero Egress Fee Object Storage) pour l'archivage numérique des mémoires.

## Buckets R2 configurés
1. `imhotep-memoires-pdfs`: Stockage des fichiers PDF complets des mémoires, annexes et couvertures.
2. `imhotep-memoires-certificates`: Stockage des certificats numériques signés et QR Codes générés.

## Commandes Wrangler R2
```bash
# Création des buckets R2
wrangler r2 bucket create imhotep-memoires-pdfs
wrangler r2 bucket create imhotep-memoires-certificates
```
