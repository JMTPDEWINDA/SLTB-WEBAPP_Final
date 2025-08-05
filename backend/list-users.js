const { pool } = require('./config/database');

const listUsers = async () => {
  try {
    console.log('📋 Available Users in Database:\n');
    
    const [users] = await pool.execute(
      'SELECT id, first_name, last_name, email, role, status FROM users ORDER BY id'
    );
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      return;
    }
    
    console.log('┌─────┬─────────────┬─────────────┬─────────────────────────┬─────────┬─────────┐');
    console.log('│ ID  │ First Name  │ Last Name   │ Email                   │ Role    │ Status  │');
    console.log('├─────┼─────────────┼─────────────┼─────────────────────────┼─────────┼─────────┤');
    
    users.forEach(user => {
      const id = user.id.toString().padEnd(4);
      const firstName = user.first_name.padEnd(12);
      const lastName = user.last_name.padEnd(12);
      const email = user.email.padEnd(24);
      const role = user.role.padEnd(8);
      const status = user.status.padEnd(8);
      
      console.log(`│ ${id} │ ${firstName} │ ${lastName} │ ${email} │ ${role} │ ${status} │`);
    });
    
    console.log('└─────┴─────────────┴─────────────┴─────────────────────────┴─────────┴─────────┘');
    
    console.log('\n🔑 Login Credentials:');
    console.log('─────────────────────');
    
    users.forEach(user => {
      console.log(`\n👤 ${user.first_name} ${user.last_name} (${user.role})`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🔑 Password: ${getPasswordForUser(user.email)}`);
      console.log(`   📊 Status: ${user.status}`);
    });
    
  } catch (error) {
    console.error('❌ Error listing users:', error.message);
  } finally {
    await pool.end();
  }
};

const getPasswordForUser = (email) => {
  const passwords = {
    'admin@sltb.lk': 'admin123',
    'user@example.com': 'user123',
    'test@example.com': 'test123'
  };
  return passwords[email] || 'password123';
};

listUsers(); 