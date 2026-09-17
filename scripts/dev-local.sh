#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

with_web=0
if [[ "${1:-}" == "--web" ]]; then
  with_web=1
fi

echo "Postgres (Docker)…"
if docker inspect senai-zeiss-postgres >/dev/null 2>&1; then
  running="$(docker inspect -f '{{.State.Running}}' senai-zeiss-postgres)"
  if [[ "$running" == "true" ]]; then
    echo "Já está no ar — pulando."
  else
    echo "Container parado — ligando."
    docker start senai-zeiss-postgres >/dev/null
  fi
else
  echo "Primeira vez — criando com Compose."
  docker compose -f apps/api/docker-compose.yml up -d
fi

echo "Esperando o banco na porta 5433…"
ready=0
for _ in $(seq 1 40); do
  if docker exec senai-zeiss-postgres pg_isready -U postgres -d senai_zeiss >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 0.5
done
if [[ "$ready" != 1 ]]; then
  echo "O Postgres não ficou pronto. Veja: docker compose -f apps/api/docker-compose.yml logs"
  exit 1
fi

prefix() {
  local name="$1"
  shift
  "$@" 2>&1 | sed -u "s/^/[${name}] /"
}

pids=()
cleanup() {
  trap - INT TERM EXIT
  kill "${pids[@]}" 2>/dev/null || true
  wait "${pids[@]}" 2>/dev/null || true
}
trap cleanup INT TERM EXIT

echo "API   http://localhost:3333"
echo "App   http://localhost:3001"
if [[ "$with_web" == 1 ]]; then
  echo "Site  http://localhost:3000"
fi
echo "Ctrl+C encerra API e app (o Postgres Docker continua)."
echo

prefix api npm run dev:api &
pids+=($!)
prefix app npm run dev:app &
pids+=($!)
if [[ "$with_web" == 1 ]]; then
  prefix web npm run dev:web &
  pids+=($!)
fi

wait
