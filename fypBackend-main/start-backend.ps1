# PowerShell script to start the backend server
Write-Host "Starting CareShare Backend Server..." -ForegroundColor Green

# Change to the backend directory
cd $PSScriptRoot

# Make sure uploads directory exists
if (-not (Test-Path "./uploads/prescriptions")) {
    Write-Host "Creating uploads directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "./uploads/prescriptions" -Force
}

# Start the backend server
node index.js 