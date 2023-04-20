const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const users = require("./userDetails.json");
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL:llän tietokannan config
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'recipes',
    //port: 3307
});

connection.connect((error) => {
    if (error) {
        console.log('Error connecting to database:', error);
    } else {
        console.log('Connected to database');
    }

});
app.post('/signin', (req, res) => {
    const { username, email, password } = req.body;
    console.log("Tässä uusi käyttäjä: " + JSON.stringify(req.body));
    const users = require("./userDetails.json");
    console.log("Tässä kaikki käyttäjät:");
    console.dir(users);
    users.push(req.body);
    console.log("Tässä kaikki käyttäjät uudelleen:");
    console.dir(users);

    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    connection.query(query, [username, email, password], (error, results) => {
        if (error) {
            console.log('Error querying database:', error);
            res.status(500).json({ message: 'Internal server error' });
        } else if (results.length === 0) {
            res.status(401).json({ message: 'Invalid username or password' });
        } else {
            res.status(200).json({ message: 'Authentication successful' });
        }
    });
    res.send("OK");
});
const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
const values = ['user123', 'lol@gmail.com', 'password123'];

connection.query(query, values, (error, results, fields) => {
    if (error) throw error;
    console.log('User details saved successfully!');
});
// Start server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`1Server started on port ${PORT}`);
});
