const { pool, testConnection, initializeDatabase } = require('./config/database');

const testDatabase = async () => {
  try {
    console.log('🧪 Testing database connection and setup...\n');
    
    // Test connection
    await testConnection();
    
    // Initialize tables
    await initializeDatabase();
    
    // Test a simple query
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM users');
    console.log(`✅ Database is working! Found ${rows[0].count} users in the database.`);
    
    // Test creating a user
    const bcrypt = require('bcryptjs');
    const testEmail = 'test@example.com';
    
    // Check if test user exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [testEmail]
    );
    
    if (existingUsers.length === 0) {
      const hashedPassword = await bcrypt.hash('test123', 12);
      await pool.execute(
        'INSERT INTO users (first_name, last_name, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
        ['Test', 'User', testEmail, hashedPassword, 'user', 'active']
      );
      console.log('✅ Test user created successfully!');
    } else {
      console.log('ℹ️  Test user already exists.');
    }
    
    console.log('\n🎉 Database test completed successfully!');
    console.log('📧 Test user email: test@example.com');
    console.log('🔑 Test user password: test123');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await pool.end();
  }
};

testDatabase(); 