# PowerShell script to start the frontend server
Write-Host "Starting CareShare Frontend..." -ForegroundColor Green

# Change to the frontend directory
cd $PSScriptRoot

# Start the frontend application
npm start 