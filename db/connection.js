const mysql = require('mysql2');
require('dotenv').config();

//connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //Your MySQL username,
        user: 'root',
        //Your MySQL password
        password: process.env.DB_PASS,
        database: 'employeeviewer'
    },
    console.log('Connected to the employeeviewer database.')
);

module.exports = db;