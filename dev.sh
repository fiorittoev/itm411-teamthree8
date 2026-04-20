#!/bin/bash
# Development startup script for Mac/Linux
# Starts both frontend and backend servers in separate terminals

echo "Starting development environment..."
echo ""

# Get the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to detect OS and open terminal accordingly
open_terminal() {
    local command=$1
    local name=$2
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        osascript <<EOF
tell application "Terminal"
    do script "$command"
end tell
EOF
    else
        # Linux (generic)
        gnome-terminal -- bash -c "$command; exec bash" &
    fi
}

echo "Starting backend server..."
open_terminal "cd '$PROJECT_DIR/backend' && source '$PROJECT_DIR/backend/.venv/bin/activate' && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload" "Backend"

sleep 2

echo "Starting frontend server..."
open_terminal "cd '$PROJECT_DIR/frontend' && npx expo start" "Frontend"

echo ""
echo "Development environment started!"
echo "Backend: http://localhost:8000"
echo "Frontend will start on Expo"
