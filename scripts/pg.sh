#!/usr/bin/env bash
# Local Postgres for MathMastery development.
# Data lives outside /tmp so a workspace restart does not destroy it.
set -euo pipefail

PGBIN="${PGBIN:-/usr/lib/postgresql/16/bin}"
PGDATA="${PGDATA:-$HOME/.local/share/mathmastery/pgdata}"
PGPORT="${PGPORT:-55432}"
PGSOCK="${PGSOCK:-$HOME/.local/share/mathmastery/sock}"
PGLOG="${PGLOG:-$HOME/.local/share/mathmastery/postgres.log}"

export PATH="$PGBIN:$PATH"

start() {
  mkdir -p "$PGDATA" "$PGSOCK" "$(dirname "$PGLOG")"
  if [ ! -f "$PGDATA/PG_VERSION" ]; then
    echo "Initialising cluster at $PGDATA"
    initdb -D "$PGDATA" -A trust -U postgres >/dev/null
  fi
  if pg_ctl -D "$PGDATA" status >/dev/null 2>&1; then
    echo "Postgres already running on port $PGPORT"
    return 0
  fi
  pg_ctl -D "$PGDATA" -o "-p $PGPORT -k $PGSOCK -c listen_addresses=127.0.0.1" -l "$PGLOG" start
  until pg_isready -h 127.0.0.1 -p "$PGPORT" -U postgres >/dev/null 2>&1; do sleep 0.3; done
  createdb -h 127.0.0.1 -p "$PGPORT" -U postgres mathmastery 2>/dev/null || true
  echo "Postgres ready: postgresql://postgres@127.0.0.1:$PGPORT/mathmastery"
}

stop() {
  pg_ctl -D "$PGDATA" stop || true
}

status() {
  pg_ctl -D "$PGDATA" status || true
}

case "${1:-start}" in
  start) start ;;
  stop) stop ;;
  restart) stop; start ;;
  status) status ;;
  *) echo "usage: $0 {start|stop|restart|status}"; exit 1 ;;
esac
