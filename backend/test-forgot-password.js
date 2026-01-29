/**
 * Test Forgot Password Flow
 * Tests the complete OTP-based password reset
 */

const BASE_URL = 'http://localhost:5000/api/auth';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test data
const testUser = {
  name: 'Banti patel',
  email: '23cs058@charusat.edu.in', // Your email from .env
  password: 'banti@2010'
};
const newPassword = 'banti2010';

async function makeRequest(endpoint, data) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error) {
    return { status: 'error', data: { message: error.message } };
  }
}

async function testForgotPassword() {
  console.log(`\n${colors.cyan}================================================${colors.reset}`);
  console.log(`${colors.cyan}   Forgot Password Flow - Test Script${colors.reset}`);
  console.log(`${colors.cyan}================================================${colors.reset}\n`);

  // Step 0: Register user (if not exists)
  console.log(`${colors.blue}👤 Step 0: Ensuring user is registered...${colors.reset}\n`);
  
  const registerRequest = await makeRequest('/register', testUser);
  
  if (registerRequest.status === 201) {
    console.log(`${colors.green}✅ User registered successfully${colors.reset}\n`);
  } else if (registerRequest.data.message?.includes('already exists')) {
    console.log(`${colors.yellow}ℹ️  User already exists (that's okay)${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}⚠️  Registration status: ${registerRequest.data.message}${colors.reset}\n`);
  }

  // Step 1: Request OTP
  console.log(`${colors.blue}📧 Step 1: Requesting OTP...${colors.reset}`);
  console.log(`Email: ${testUser.email}\n`);

  const otpRequest = await makeRequest('/forgot-password', { email: testUser.email });
  
  if (otpRequest.status === 200) {
    console.log(`${colors.green}✅ Success!${colors.reset}`);
    console.log(`Response: ${JSON.stringify(otpRequest.data, null, 2)}\n`);
    console.log(`${colors.yellow}⏱️  OTP sent to your email (valid for 10 minutes)${colors.reset}`);
    console.log(`${colors.yellow}📬 Check your inbox: ${testUser.email}${colors.reset}\n`);
  } else {
    console.log(`${colors.red}❌ Failed!${colors.reset}`);
    console.log(`Response: ${JSON.stringify(otpRequest.data, null, 2)}\n`);
    
    // Check if user exists
    if (otpRequest.data.message.includes('No account found')) {
      console.log(`${colors.yellow}💡 Tip: Make sure you have registered with this email first!${colors.reset}`);
      console.log(`${colors.yellow}   Run: POST /api/auth/register${colors.reset}\n`);
    }
    return;
  }

  // Step 2: Wait for user to enter OTP
  console.log(`${colors.cyan}================================================${colors.reset}`);
  console.log(`${colors.blue}🔐 Step 2: Enter OTP to continue...${colors.reset}\n`);
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the 6-digit OTP from your email: ', async (otp) => {
    console.log('');

    // Step 3: Verify OTP (optional step)
    console.log(`${colors.blue}🔍 Step 3: Verifying OTP...${colors.reset}\n`);
    
    const verifyRequest = await makeRequest('/verify-otp', { 
      email: testUser.email, 
      otp: otp.trim() 
    });

    if (verifyRequest.status === 200) {
      console.log(`${colors.green}✅ OTP Verified!${colors.reset}`);
      console.log(`Response: ${JSON.stringify(verifyRequest.data, null, 2)}\n`);

      // Step 4: Reset Password
      console.log(`${colors.blue}🔄 Step 4: Resetting password...${colors.reset}`);
      console.log(`New Password: ${newPassword}\n`);

      const resetRequest = await makeRequest('/reset-password', {
        email: testUser.email,
        otp: otp.trim(),
        newPassword: newPassword
      });

      if (resetRequest.status === 200) {
        console.log(`${colors.green}✅ Password Reset Successful!${colors.reset}`);
        console.log(`Response: ${JSON.stringify(resetRequest.data, null, 2)}\n`);
        console.log(`${colors.green}🎉 You can now login with:${colors.reset}`);
        console.log(`   Email: ${testUser.email}`);
        console.log(`   Password: ${newPassword}\n`);
        console.log(`${colors.yellow}📧 Check your email for confirmation${colors.reset}\n`);
      } else {
        console.log(`${colors.red}❌ Password Reset Failed!${colors.reset}`);
        console.log(`Response: ${JSON.stringify(resetRequest.data, null, 2)}\n`);
      }
    } else {
      console.log(`${colors.red}❌ OTP Verification Failed!${colors.reset}`);
      console.log(`Response: ${JSON.stringify(verifyRequest.data, null, 2)}\n`);
      
      if (verifyRequest.data.message.includes('expired')) {
        console.log(`${colors.yellow}💡 OTP expired! Request a new one.${colors.reset}\n`);
      } else if (verifyRequest.data.message.includes('Invalid')) {
        console.log(`${colors.yellow}💡 Wrong OTP! Check your email and try again.${colors.reset}\n`);
      }
    }

    console.log(`${colors.cyan}================================================${colors.reset}\n`);
    rl.close();
  });
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    return true;
  } catch (error) {
    return false;
  }
}

// Run test
(async () => {
  console.log(`\n${colors.yellow}🔍 Checking if server is running...${colors.reset}`);
  
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log(`${colors.red}❌ Server is not running!${colors.reset}`);
    console.log(`${colors.yellow}💡 Start the server first: npm start${colors.reset}\n`);
    process.exit(1);
  }
  
  console.log(`${colors.green}✅ Server is running${colors.reset}`);
  
  await testForgotPassword();
})();
