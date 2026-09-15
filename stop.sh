#!/bin/bash

# BYT Fleet Management — Stop Script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PID_FILE="$SCRIPT_DIR/.app.pid"
PORT=3000

echo "🛑 Stopping BYT Fleet Management Platform..."

STOPPED=0

# 1. Try stopping via PID file
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if ps -p "$PID" > /dev/null 2>&1; then
    echo "Terminating process $PID..."
    kill -15 "$PID" 2>/dev/null
    sleep 1
    if ps -p "$PID" > /dev/null 2>&1; then
      kill -9 "$PID" 2>/dev/null
    fi
    STOPPED=1
  fi
  rm -f "$PID_FILE"
fi

# 2. Check any remaining process on port 3000
PIDS_ON_PORT=$(lsof -ti:$PORT 2>/dev/null)
if [ -n "$PIDS_ON_PORT" ]; then
  echo "Freeing port $PORT..."
  for p in $PIDS_ON_PORT; do
    kill -15 "$p" 2>/dev/null || kill -9 "$p" 2>/dev/null
  done
  STOPPED=1
fi

# 3. Clean up any lingering Next.js dev server processes
ORPHAN_PIDS=$(pgrep -f "next.*dev" 2>/dev/null)
if [ -n "$ORPHAN_PIDS" ]; then
  for p in $ORPHAN_PIDS; do
    kill -15 "$p" 2>/dev/null || true
  done
  STOPPED=1
fi

if [ $STOPPED -eq 1 ]; then
  echo "✅ BYT Fleet Management Platform stopped successfully."
else
  echo "ℹ️  No running BYT Fleet server found on port $PORT."
fi
