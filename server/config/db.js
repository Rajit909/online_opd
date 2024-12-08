import mysql from 'mysql2';

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'appointment_data'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1); // Exit process with failure
  }
  console.log('Connected to MySQL database');
});

export default connection;
