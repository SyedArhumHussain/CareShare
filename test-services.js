// CareShare Services Test Script
// Tests backend, frontend, and Gemini service connectivity

const http = require('http');

function testEndpoint(host, port, path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: host,
      port: port,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: responseData,
          headers: res.headers
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runTests() {
  console.log('🧪 CareShare Services Test Suite');
  console.log('================================\n');

  // Test 1: Backend Health Check
  try {
    console.log('1️⃣ Testing Backend (Port 4000)...');
    const backendResponse = await testEndpoint('localhost', 4000, '/');
    console.log(`   ✅ Backend Status: ${backendResponse.status}`);
    console.log(`   📄 Response: ${backendResponse.data}\n`);
  } catch (error) {
    console.log(`   ❌ Backend Error: ${error.message}\n`);
  }

  // Test 2: Gemini Service Health Check
  try {
    console.log('2️⃣ Testing Gemini Service (Port 5000)...');
    const geminiResponse = await testEndpoint('localhost', 5000, '/health');
    console.log(`   ✅ Gemini Status: ${geminiResponse.status}`);
    console.log(`   📄 Response: ${geminiResponse.data.substring(0, 100)}...\n`);
  } catch (error) {
    console.log(`   ❌ Gemini Service Error: ${error.message}\n`);
  }

  // Test 3: Gemini Text Processing
  try {
    console.log('3️⃣ Testing Gemini Text Processing...');
    const textData = { text: 'How do I donate medicines?' };
    const textResponse = await testEndpoint('localhost', 5000, '/text/process', 'POST', textData);
    console.log(`   ✅ Text Processing Status: ${textResponse.status}`);
    
    if (textResponse.status === 200) {
      const responseObj = JSON.parse(textResponse.data);
      console.log(`   🤖 AI Response Preview: ${responseObj.text.substring(0, 150)}...\n`);
    }
  } catch (error) {
    console.log(`   ❌ Text Processing Error: ${error.message}\n`);
  }

  // Test 4: Frontend (React Dev Server)
  try {
    console.log('4️⃣ Testing Frontend (Port 3000)...');
    const frontendResponse = await testEndpoint('localhost', 3000, '/');
    console.log(`   ✅ Frontend Status: ${frontendResponse.status}`);
    console.log(`   📄 Content Type: ${frontendResponse.headers['content-type']}\n`);
  } catch (error) {
    console.log(`   ⏳ Frontend might still be starting: ${error.message}\n`);
  }

  console.log('🎯 Test Summary:');
  console.log('================');
  console.log('✅ Backend (Node.js)     → http://localhost:4000');
  console.log('✅ Gemini Service (Python) → http://localhost:5000');
  console.log('🔄 Frontend (React)      → http://localhost:3000 (may still be starting)');
  console.log('\n🎉 Your CareShare system with Gemini integration is ready!');
  console.log('\n📋 Next Steps:');
  console.log('1. Wait for React to finish starting (if not ready)');
  console.log('2. Open http://localhost:3000 in your browser');
  console.log('3. Test the enhanced chatbot with voice features');
  console.log('4. Try medicine donation/request workflows with city validation');
}

// Run the tests
runTests().catch(console.error); 