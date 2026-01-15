@echo off
color 0b
echo ==================================================
echo       AFFORA WEB APP - ONE-TIME SETUP
echo ==================================================
echo.

:: 1. CHECK NODE.JS
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js v18 or higher from nodejs.org
    pause
    exit /b
)

:: 2. INSTALL LIBRARIES
echo [1/3] Installing Project Dependencies...
call npm install
echo.

:: 3. DOWNLOAD ASSETS
echo [2/3] Downloading Product Images...
if exist "download-images-robust.js" (
    node download-images-robust.js
) else (
    echo [WARNING] Image downloader script not found. Skipping.
)
echo.

:: 4. RESET DATABASE (Crucial for new Schema)
echo [3/3] Resetting Database...
if exist "server\affora.db" (
    del "server\affora.db"
    echo   - Old database deleted. New one will be generated on startup.
) else (
    echo   - No existing database found. Ready to create new one.
)

echo.
echo ==================================================
echo        SETUP COMPLETE! YOU ARE READY.
echo ==================================================
echo.
echo To start the app, run 'start_app.bat'
echo.
pause