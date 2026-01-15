@echo off
title Affora Launcher
echo ==========================================
echo   STARTING AFFORA SYSTEM
echo   Please do not close the black windows!
echo ==========================================

:: 1. Start the Backend Server in a new window
echo.
echo Starting Database Server...
start "Affora Backend (DO NOT CLOSE)" cmd /k "cd server && npm start"

:: 2. Wait 3 seconds for the server to wake up
timeout /t 3 /nobreak >nul

:: 3. Start the Frontend in a new window
echo Starting Frontend Interface...
start "Affora Client (DO NOT CLOSE)" cmd /k "npm run dev"

:: 4. Open the browser automatically
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo System is running! Good luck with the defense!
echo.