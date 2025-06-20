#!/bin/sh

# Copiado de https://github.com/eficode/wait-for
# Espera até o banco estar pronto
set -e

host="$1"
shift
cmd="$@"

until nc -z "$host" 5432; do
  >&2 echo "Postgres ainda não está disponível - esperando..."
  sleep 1
done

>&2 echo "Postgres está pronto - executando comando"
exec $cmd
