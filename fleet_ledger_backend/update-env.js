const fs = require('fs');
const path = require('path');

// Path to .env file
const envPath = path.resolve(__dirname, '.env');

// Read existing .env file
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('Successfully read .env file');
} catch (error) {
  console.error('Error reading .env file:', error);
  process.exit(1);
}

// Google credentials to add - using placeholders instead of actual values
const googleCredentials = `
# Google OAuth credentials
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
GOOGLE_CALLBACK_URL="callback"
`;

// Check if Google credentials already exist
if (envContent.includes('GOOGLE_CLIENT_ID')) {
  console.log('Google credentials already exist in .env file');
} else {
  // Append Google credentials to .env file
  try {
    fs.appendFileSync(envPath, googleCredentials);
    console.log('Successfully added Google credentials to .env file');
  } catch (error) {
    console.error('Error writing to .env file:', error);
    process.exit(1);
  }
}

console.log('Environment update completed');
