const { pool, testConnection, initializeDatabase } = require('./config/database');
const bcrypt = require('bcryptjs');

const setupDatabase = async () => {
  try {
    console.log('🚀 Starting SLTB Backend Setup...\n');

    // Test database connection
    console.log('📡 Testing database connection...');
    await testConnection();

    // Initialize database tables
    console.log('🗄️  Initializing database tables...');
    await initializeDatabase();

    // Create admin user if not exists
    console.log('👤 Creating admin user...');
    const adminEmail = 'admin@sltb.lk';
    const adminPassword = 'admin123';

    // Check if admin user exists
    const [existingAdmin] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [adminEmail]
    );

    if (existingAdmin.length === 0) {
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

      // Create admin user
      await pool.execute(
        'INSERT INTO users (first_name, last_name, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
        ['Admin', 'User', adminEmail, hashedPassword, 'admin', 'active']
      );

      console.log('✅ Admin user created successfully!');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log('⚠️  Please change the password after first login!\n');
    } else {
      console.log('ℹ️  Admin user already exists.\n');
    }

    // Create sample data for testing
    console.log('📝 Creating sample data...');
    await createSampleData();

    console.log('🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Test the API endpoints');
    console.log('3. Connect your frontend to the backend');
    console.log('4. Update environment variables for production');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

const createSampleData = async () => {
  try {
    // Create a sample user
    const [existingUser] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      ['user@example.com']
    );

    if (existingUser.length === 0) {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash('user123', saltRounds);

      const [userResult] = await pool.execute(
        'INSERT INTO users (first_name, last_name, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
        ['Sample', 'User', 'user@example.com', hashedPassword, 'user', 'active']
      );

      const userId = userResult.insertId;

      // Create sample planting application
      const [plantingResult] = await pool.execute(
        `INSERT INTO planting_applications (
          user_id, file_no, owner_name, estate_name, ti_range, division,
          field_no, plan_no, planting_type, approved_extent, x1_coordinate,
          x2_coordinate, plants_per_ha, approved_plants, amount_per_plant,
          total_approved_amount, reference_no, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, 'PLANT001', 'Sample Owner', 'Green Valley Estate', 'Range A', 'Division 1',
          'F001', 'P001', 'New Planting', 5.5, '6.9271', '79.8612', 1200, 6600, 25.50,
          168300.00, 'SLTB-PLANT-12345678ABCD', 'pending'
        ]
      );

      // Create reference entry for planting
      await pool.execute(
        'INSERT INTO reference_entries (reference_no, application_type, application_id) VALUES (?, ?, ?)',
        ['SLTB-PLANT-12345678ABCD', 'planting', plantingResult.insertId]
      );

      // Create sample replanting application
      const [replantingResult] = await pool.execute(
        `INSERT INTO replanting_applications (
          user_id, file_no, owner_name, estate_name, ti_range, division,
          field_no, plan_no, replanting_type, approved_extent, x1_coordinate,
          x2_coordinate, plants_per_ha, approved_plants, amount_per_plant,
          total_approved_amount, reference_no, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, 'REPLANT001', 'Sample Owner', 'Green Valley Estate', 'Range B', 'Division 2',
          'F002', 'P002', 'Replanting', 3.2, '6.9271', '79.8612', 1200, 3840, 30.00,
          115200.00, 'SLTB-REPLANT-87654321EFGH', 'processing'
        ]
      );

      // Create reference entry for replanting
      await pool.execute(
        'INSERT INTO reference_entries (reference_no, application_type, application_id) VALUES (?, ?, ?)',
        ['SLTB-REPLANT-87654321EFGH', 'replanting', replantingResult.insertId]
      );

      console.log('✅ Sample data created successfully!');
      console.log('👤 Sample user: user@example.com / user123');
      console.log('📋 Sample reference numbers:');
      console.log('   - SLTB-PLANT-12345678ABCD (Planting - Pending)');
      console.log('   - SLTB-REPLANT-87654321EFGH (Replanting - Processing)');
    } else {
      console.log('ℹ️  Sample data already exists.');
    }
  } catch (error) {
    console.error('❌ Error creating sample data:', error.message);
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 