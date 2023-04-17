const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL:llän tietokannan config
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'olso',
    password: 'olso',
    database: 'recipes',
    port: 3307
});

connection.connect((error) => {
    if (error) {
        console.log('Error connecting to database:', error);
    } else {
        console.log('Connected to database');
    }

});
app.post('/SignIn', (req, res) => {
    const { username, password, email } = req.body;
    const query = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
    connection.query(query, [username, password], (error, results) => {
        if (error) {
            console.log('Error querying database:', error);
            res.status(500).json({ message: 'Internal server error' });
        } else if (results.length === 0) {
            res.status(401).json({ message: 'Invalid username or password' });
        } else {
            res.status(200).json({ message: 'Authentication successful' });
        }
    });
});
const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
const values = ['user123', 'password123', 'lol@gmail.com'];

connection.query(query, values, (error, results, fields) => {
    if (error) throw error;
    console.log('User details saved successfully!');
});
// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
