// verify-fix.js
// This script verifies that the medicine request functionality works correctly

console.log('Starting verification of medicine request functionality...');

const http = require('http');

// 1. Check if server is running
console.log('\n1. Checking if server is running on port 4000...');
const checkServer = () => {
  return new Promise((resolve, reject) => {
    const req = http.request({
      method: 'GET',
      hostname: 'localhost',
      port: 4000,
      path: '/',
      timeout: 3000
    }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('✅ Server is running on port 4000');
        resolve(true);
      } else {
        console.log(`⚠️ Server returned status code ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', (err) => {
      if (err.code === 'ECONNREFUSED') {
        console.log('❌ Server is not running on port 4000');
      } else {
        console.log(`❌ Error connecting to server: ${err.message}`);
      }
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log('❌ Connection timeout');
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
};

// 2. Check medicine availability
const checkMedicine = () => {
  return new Promise((resolve, reject) => {
    console.log('\n2. Checking if medicines are available...');
    
    const req = http.request({
      method: 'GET',
      hostname: 'localhost',
      port: 4000,
      path: '/askDonator',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.database && Array.isArray(parsed.database)) {
            const approved = parsed.database.filter(med => med.status === 'approved');
            console.log(`✅ Found ${approved.length} approved medicines out of ${parsed.database.length} total`);
            
            if (approved.length > 0) {
              console.log('  Available medicines:');
              approved.forEach(med => {
                console.log(`  - ${med.medicineName}`);
              });
              resolve(approved[0]);
            } else {
              console.log('⚠️ No approved medicines found. Please approve medicines in the admin panel.');
              resolve(null);
            }
          } else {
            console.log('❌ Invalid response format from server');
            resolve(null);
          }
        } catch (err) {
          console.log(`❌ Error parsing server response: ${err.message}`);
          resolve(null);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Error checking medicines: ${err.message}`);
      resolve(null);
    });
    
    req.end();
  });
};

// 3. Test submitting a medicine request
const testMedicineRequest = (medicine) => {
  return new Promise((resolve, reject) => {
    if (!medicine) {
      console.log('\n3. Skipping medicine request test - no approved medicines available');
      resolve(false);
      return;
    }
    
    console.log(`\n3. Testing medicine request for "${medicine.medicineName}"...`);
    
    const testData = JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      phoneNumber: '1234567890',
      address: '123 Test St',
      medicineName: medicine.medicineName,
      medicineQty: '1',
      reason: 'Verification test'
    });
    
    const req = http.request({
      method: 'POST',
      hostname: 'localhost',
      port: 4000,
      path: '/medicineRequest',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testData)
      },
      timeout: 5000
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode === 201 && parsed.success) {
            console.log('✅ Medicine request test PASSED!');
            console.log(`   Response: ${parsed.message}`);
            resolve(true);
          } else {
            console.log(`❌ Medicine request test FAILED with status code ${res.statusCode}`);
            console.log(`   Error: ${parsed.error || 'Unknown error'}`);
            resolve(false);
          }
        } catch (err) {
          console.log(`❌ Error parsing server response: ${err.message}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Error submitting medicine request: ${err.message}`);
      resolve(false);
    });
    
    req.write(testData);
    req.end();
  });
};

// Run all verification steps
const runVerification = async () => {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('\n❌ Verification failed: Server is not running');
    console.log('\nPlease start the server with:');
    console.log('node index.js');
    return;
  }
  
  const medicine = await checkMedicine();
  const requestResult = await testMedicineRequest(medicine);
  
  console.log('\n------------------------------------------');
  if (serverRunning && medicine && requestResult) {
    console.log('✅ All tests PASSED! The medicine request system is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Please check the logs above for details.');
    
    if (!medicine) {
      console.log('\nPossible fix:');
      console.log('1. Go to http://localhost:3000/allMedicine');
      console.log('2. Click on the "pending" tag next to a medicine to approve it');
    }
    
    if (serverRunning && !requestResult) {
      console.log('\nTry running the fix script:');
      console.log('node fix-medicine-requests.js');
      console.log('Then restart your server');
    }
  }
  console.log('------------------------------------------');
};

runVerification(); 