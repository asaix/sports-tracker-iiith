#!/bin/sh
set -e

# PocketBase binds to localhost only, so it is never reachable from outside the
# machine. Migrations in pb_migrations are applied automatically on serve.
pocketbase serve --http=127.0.0.1:8090 --dir=/pb_data --migrationsDir=/app/pb_migrations &

exec node build/index.js
