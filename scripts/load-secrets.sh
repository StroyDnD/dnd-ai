#!/bin/bash
set -a
if [ -f /run/secrets/ALL_SECRETS ]; then
  base64 -d /run/secrets/ALL_SECRETS > /tmp/secrets.env
  source /tmp/secrets.env
fi
set +a
exec "$@"