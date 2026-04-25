@echo off
echo ==========================================
echo    Care Share Project Setup Script
echo ==========================================
echo.

echo [1/4] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Installing backend dependencies...
cd fypBackend-main
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [3/4] Installing frontend dependencies...
cd ..\fypFrontend-main
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo [4/4] Creating necessary directories...
cd ..\fypBackend-main
if not exist "uploads" mkdir uploads
if not exist "uploads\prescriptions" mkdir uploads\prescriptions

cd ..
echo.
echo ==========================================
echo   Setup Complete! 
echo ==========================================
echo.
echo Next steps:
echo 1. Configure your .env files (see SETUP_GUIDE.md)
echo 2. Run: node start.js
echo.
echo Press any key to exit...
pause >nul 