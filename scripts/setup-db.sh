#!/usr/bin/env bash
# Creates the local PostgreSQL database used by the backend.
# TypeORM (DB_SYNCHRONIZE=true) will create all tables on first backend start.
#
# Usage:
#   ./scripts/setup-db.sh
#   or from the backend directory:
#   npm run db:setup

set -euo pipefail

DB_HOST="${DATABASE_HOST:-localhost}"
DB_PORT="${DATABASE_PORT:-5432}"
DB_NAME="${DATABASE_NAME:-pomoc_ted}"
DB_USER="${DATABASE_USER:-postgres}"
DB_PASS="${DATABASE_PASSWORD:-postgres}"

export PGPASSWORD="$DB_PASS"

echo "→ Connecting to PostgreSQL at ${DB_HOST}:${DB_PORT} as '${DB_USER}'..."

# Create the database; ignore the error if it already exists
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -tc \
       "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" \
   | grep -q 1; then
  echo "✓ Database '${DB_NAME}' already exists — nothing to do."
else
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" \
       -c "CREATE DATABASE \"${DB_NAME}\";"
  echo "✓ Database '${DB_NAME}' created."
fi

echo ""
echo "Start the backend with DB_SYNCHRONIZE=true to let TypeORM create all tables:"
echo "  cd backend && npm run start:dev"
