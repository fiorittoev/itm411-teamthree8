@echo off
REM Development startup script for Windows
REM Starts both frontend and backend servers in separate terminals

echo Starting development environment...
echo.

REM Get the current directory
set ROOT_DIR=%CD%

REM Start backend in a new terminal
echo Starting backend server...
start cmd /k "cd /d %ROOT_DIR%\backend & %ROOT_DIR%\backend\.venv\Scripts\activate.bat & uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

REM Wait a moment for the first terminal to spawn
timeout /t 2 /nobreak

REM Start frontend in a new terminal
echo Starting frontend server...
start cmd /k "cd /d %ROOT_DIR%\frontend & npx expo start"

echo.
echo Development environment started!
echo Backend: http://localhost:8000
echo Frontend will start on Expo
