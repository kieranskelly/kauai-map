#!/bin/sh
# Build on engineering-services, ship the standalone output and unit (moved off Vercel 2026-10-13).
# NEXT_PUBLIC_* is inlined at build time, so the build reads /etc/kauai-map/env.
set -eu
cd "$(dirname "$0")/.."
HOST=${HOST:-root@159.223.125.121}
SSH=${SSH:-ssh}
BUILD=/opt/kauai-map-build
rsync -az --delete -e "$SSH" --exclude .git --exclude node_modules --exclude .next --exclude .data ./ $HOST:$BUILD/
rsync -az -e "$SSH" infra/kauai-map.service $HOST:/etc/systemd/system/
$SSH $HOST "set -e; cd $BUILD; test -s /etc/kauai-map/env
  set -a; . /etc/kauai-map/env; set +a
  CI=1 COREPACK_ENABLE_DOWNLOAD_PROMPT=0 corepack pnpm install --frozen-lockfile --config.confirmModulesPurge=false --store-dir $BUILD/.pnpm-store
  NODE_ENV=production corepack pnpm exec next build
  mkdir -p /opt/kauai-map
  rsync -a --delete .next/standalone/ /opt/kauai-map/
  rsync -a --delete .next/static/ /opt/kauai-map/.next/static/
  rsync -a --delete public/ /opt/kauai-map/public/
  rm -rf $BUILD/node_modules $BUILD/.next $BUILD/.pnpm-store
  systemctl daemon-reload; systemctl enable -q kauai-map; systemctl restart kauai-map
  sleep 3; curl -s -o /dev/null -w 'kauai-map %{http_code}\n' http://127.0.0.1:8032/"
