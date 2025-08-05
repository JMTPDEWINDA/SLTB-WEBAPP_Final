const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../config.env' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'sltbwix',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone_number VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin', 'officer') DEFAULT 'user',
        status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create planting_applications table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS planting_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        file_no VARCHAR(50) UNIQUE NOT NULL,
        owner_name VARCHAR(100) NOT NULL,
        estate_name VARCHAR(100) NOT NULL,
        ti_range VARCHAR(50),
        division VARCHAR(50),
        field_no VARCHAR(50),
        plan_no VARCHAR(50),
        planting_type VARCHAR(50),
        approved_extent DECIMAL(10,2),
        x1_coordinate VARCHAR(50),
        x2_coordinate VARCHAR(50),
        plants_per_ha INT,
        approved_plants INT,
        amount_per_plant DECIMAL(10,2),
        total_approved_amount DECIMAL(12,2),
        status ENUM('pending', 'approved', 'rejected', 'processing') DEFAULT 'pending',
        reference_no VARCHAR(50) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create replanting_applications table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS replanting_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        file_no VARCHAR(50) UNIQUE NOT NULL,
        owner_name VARCHAR(100) NOT NULL,
        estate_name VARCHAR(100) NOT NULL,
        ti_range VARCHAR(50),
        division VARCHAR(50),
        field_no VARCHAR(50),
        plan_no VARCHAR(50),
        replanting_type VARCHAR(50),
        approved_extent DECIMAL(10,2),
        x1_coordinate VARCHAR(50),
        x2_coordinate VARCHAR(50),
        plants_per_ha INT,
        approved_plants INT,
        amount_per_plant DECIMAL(10,2),
        total_approved_amount DECIMAL(12,2),
        status ENUM('pending', 'approved', 'rejected', 'processing') DEFAULT 'pending',
        reference_no VARCHAR(50) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create reference_entries table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reference_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        reference_no VARCHAR(50) UNIQUE NOT NULL,
        application_type ENUM('planting', 'replanting') NOT NULL,
        application_id INT,
        status ENUM('pending', 'approved', 'rejected', 'processing') DEFAULT 'pending',
        comments TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables initialized successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase
}; 