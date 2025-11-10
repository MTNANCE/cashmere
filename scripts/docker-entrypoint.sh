#!/bin/sh

# Start PocketBase in the background
/pb/pocketbase serve --http=0.0.0.0:8119 &
PB_PID=$!

echo "⏳ Waiting for PocketBase to start..."

# Wait for PocketBase to be ready
max_attempts=30
attempt=0
until curl -sf http://localhost:8119/api/health > /dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ $attempt -ge $max_attempts ]; then
    echo "❌ PocketBase failed to start within 30 seconds"
    kill $PB_PID
    exit 1
  fi
  sleep 1
done

echo "✅ PocketBase is ready!"

# Check if we should seed (only if pb_data is empty/new)
if [ ! -f /pb/pb_data/.seeded ]; then
  echo "🌱 First run detected - seeding database..."
  sleep 2  # Give PocketBase a moment to fully initialize
  
  if curl -sf -X POST http://localhost:8119/api/seed > /dev/null 2>&1; then
    echo "✅ Database seeded successfully!"
    touch /pb/pb_data/.seeded
  else
    echo "⚠️  Seeding failed or seed endpoint not available"
    echo "   You can manually seed by running: curl -X POST http://localhost:8119/api/seed"
  fi
else
  echo "ℹ️  Database already seeded (delete /pb/pb_data/.seeded to reseed)"
fi

# Wait for PocketBase process
wait $PB_PID

