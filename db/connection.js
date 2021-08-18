
const mysql = require('mysql2/promise');
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

// const mysql = require('mysql');
// class Database {
//     constructor(config) {
//         this.connection = mysql.createConnection(config);
//     }
//     query(sql, args) {
//         return new Promise((resolve, reject) => {
//             this.connection.query(sql, args, (err, rows) => {
//                 if (err)
//                     return reject(err);
//                 resolve(rows);
//             });
//         });
//     }
//     close() {
//         return new Promise((resolve, reject) => {
//             this.connection.end(err => {
//                 if (err)
//                     return reject(err);
//                 resolve();
//             });
//         });
//     }
// }