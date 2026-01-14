const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function initDatabase() {
  try {
    console.log('Initializing database...');

    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf8'
    );

    await pool.query(schemaSQL);

    console.log('Database initialized successfully!');
    console.log('Sample data has been loaded.');
    console.log('\nYou can now:');
    console.log('1. Start the server: npm start');
    console.log('2. Register your first admin user via the API');

    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
