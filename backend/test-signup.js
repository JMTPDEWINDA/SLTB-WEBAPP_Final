const fetch = require('node-fetch');

const testSignup = async () => {
  try {
    console.log('🧪 Testing Signup API...\n');

    const testUser = {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone_number: '1234567890',
      password: 'test123'
    };

    console.log('📤 Sending signup request...');
    console.log('User data:', testUser);

    const response = await fetch('http://localhost:8070/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();

    console.log('\n📥 Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ Signup test PASSED!');
      console.log('🎉 User created successfully');
      console.log('🔑 Token received:', data.token ? 'Yes' : 'No');
      console.log('👤 User data received:', data.user ? 'Yes' : 'No');
    } else {
      console.log('\n❌ Signup test FAILED!');
      console.log('Error:', data.message);
    }

  } catch (error) {
    console.error('\n❌ Test error:', error.message);
  }
};

testSignup(); 