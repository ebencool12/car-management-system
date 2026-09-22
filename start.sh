#!/bin/bash

# BYT Fleet Management — Start Script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PID_FILE="$SCRIPT_DIR/.app.pid"
PORT=3000

echo "🚀 Starting BYT Fleet Management Platform..."

# 1. Check if server is already running and responding on port 3000
if lsof -i :$PORT >/dev/null 2>&1; then
  CURRENT_PID=$(lsof -ti:$PORT 2>/dev/null | head -n 1)
  echo "⚠️  BYT Fleet is already running (PID $CURRENT_PID)."
  echo "🌐 Access it at: http://localhost:$PORT"
  exit 0
fi

# Clean up any stale PID file
rm -f "$PID_FILE"

# 2. Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# 3. Check if SQLite database exists
if [ ! -f "dev.db" ]; then
  echo "🗄️  Database not found. Seeding initial data..."
  npx tsx prisma/seed.ts
fi

# 4. Start Next.js server in background
echo "⚡ Launching development server..."
nohup ./node_modules/.bin/next dev -p $PORT </dev/null > server.log 2>&1 &
APP_PID=$!
disown $APP_PID 2>/dev/null || true
echo $APP_PID > "$PID_FILE"

# 6. Wait for server to become responsive
echo -n "⏳ Waiting for server to become ready"
READY=0
for i in {1..20}; do
  if nc -z localhost $PORT 2>/dev/null || lsof -i :$PORT >/dev/null 2>&1; then
    READY=1
    break
  fi
  echo -n "."
  sleep 1
done
echo ""

if [ $READY -eq 1 ]; then
  echo "✅ BYT Fleet Management Platform is running!"
  echo ""
  echo "   🌐 URL:              http://localhost:$PORT"
  echo "   📋 Admin Login:      admin@byt.com / admin123"
  echo "   🚗 Driver Login:     kwame@gmail.com / driver123"
  echo "   📝 Logs:             $SCRIPT_DIR/server.log"
  echo "   🛑 To stop:          ./stop.sh or npm run stop"
  echo ""
else
  echo "⚠️  Server process started (PID $APP_PID), warming up..."
  echo "   Check $SCRIPT_DIR/server.log if it does not load shortly."
fi
