const mysql = require("mysql");

const connection = mysql.createConnection({
host: "localhost",
user: "root",
password: "",
database: "emp",
port: "3306",
});

connection.connect((err) => {
if (err) console.log(err);
console.log("DATABASE CONNECTED");
});

module.exports = connection;