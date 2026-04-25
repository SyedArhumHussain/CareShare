/**
 * Start script for Care Share project
 * This script helps start both backend and frontend services
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Care Share Application Starter 🚀');
console.log('-----------------------------------');

// Define paths
const backendPath = path.join(__dirname, 'fypBackend-main');
const frontendPath = path.join(__dirname, 'fypFrontend-main');

// Check if directories exist
if (!fs.existsSync(backendPath)) {
  console.error('❌ Backend directory not found at:', backendPath);
  process.exit(1);
}

if (!fs.existsSync(frontendPath)) {
  console.error('❌ Frontend directory not found at:', frontendPath);
  process.exit(1);
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(backendPath, 'uploads');
const prescriptionsDir = path.join(uploadsDir, 'prescriptions');

if (!fs.existsSync(uploadsDir)) {
  console.log('📁 Creating uploads directory...');
  fs.mkdirSync(uploadsDir);
}

if (!fs.existsSync(prescriptionsDir)) {
  console.log('📁 Creating prescriptions upload directory...');
  fs.mkdirSync(prescriptionsDir);
}

// Function to start backend
function startBackend() {
  console.log('🔄 Starting backend server...');
  
  const backend = exec('node index.js', { cwd: backendPath });
  
  backend.stdout.on('data', (data) => {
    console.log(`🖥️ Backend: ${data.trim()}`);
  });
  
  backend.stderr.on('data', (data) => {
    console.error(`❌ Backend Error: ${data.trim()}`);
  });
  
  backend.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Backend process exited with code ${code}`);
    }
  });
  
  return backend;
}

// Function to start frontend
function startFrontend() {
  console.log('🔄 Starting frontend development server...');
  
  const frontend = exec('npm start', { cwd: frontendPath });
  
  frontend.stdout.on('data', (data) => {
    console.log(`🌐 Frontend: ${data.trim()}`);
  });
  
  frontend.stderr.on('data', (data) => {
    console.error(`❌ Frontend Error: ${data.trim()}`);
  });
  
  frontend.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Frontend process exited with code ${code}`);
    }
  });
  
  return frontend;
}

// Start both services
console.log('🔍 Starting services...');
const backendProcess = startBackend();
const frontendProcess = startFrontend();

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down services...');
  backendProcess.kill();
  frontendProcess.kill();
  process.exit(0);
});

console.log('✅ Startup complete! Press Ctrl+C to stop all services.');
console.log('📝 Backend running at: http://localhost:4000');
console.log('📝 Frontend running at: http://localhost:3000'); 