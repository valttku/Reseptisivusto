const express = require('express');
const app = express();
const mysql = require('mysql');
const port = 3001; // or any other port you want to use

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'olso',
    password: 'olso',
    database: 'recipes',
    port: 3307
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database with ID ' + connection.threadId);
});

app.use(express.json());

app.post('/SignIn', (req, res) => {
    const { username, email, password } = req.body;

    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const values = [username, email, password];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error registering user: ' + err.stack);
            res.status(500).send('Error registering user');
            return;
        }
        console.log('User registered successfully with ID ' + result.insertId);
        res.send('User registered successfully');
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});