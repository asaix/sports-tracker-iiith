#!/bin/sh
set -e

# Bind the IPv6 wildcard, not 127.0.0.1: Fly's 6PN private network reaches the
# machine by its private IPv6 address, so a loopback-only listener is invisible
# to `fly proxy`. On Linux [::] also accepts IPv4, so hooks.server.js can keep
# using http://127.0.0.1:8090. This is still not public - fly.toml only routes
# internal_port 3000 from the edge; 8090 is reachable only inside the Fly org.
# Migrations in pb_migrations are applied automatically on serve.
pocketbase serve --http=[::]:8090 --dir=/pb_data --migrationsDir=/app/pb_migrations --hooksDir=/app/pb_hooks &

exec node build/index.js
