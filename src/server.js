const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();
const users = require("./userDetails.json");
const recipesjson = require("./recipes.json");
const fs = require("fs");

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
    console.log("Tässä kaikki käyttäjät:");
    console.dir(users);
    users.push(req.body);
    console.log("Tässä kaikki käyttäjät uudelleen:");
    console.dir(users);

    fs.writeFile('./userDetails.json', JSON.stringify(users), (err) => {
        if (err) {
            console.log('Error writing to file:', err);
        } else {
            console.log('User details saved to file successfully!');
        }
    });

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
   // res.send("OK");
});

app.post('/NewRecipe', (req, res) => {
    const { name, ingredients, category, author, url, image, cookTime, recipeYield, date, prepTime, description } = req.body;
    //tallennetaan myös json-fileen
    recipesjson.push(req.body);
    fs.writeFile('./recipes.json', JSON.stringify(recipesjson), (err) => {
        if (err) {
            console.log('Error writing to recipes-file:', err);
        } else {
            console.log('Recipe saved to json-file successfully!');
        }
    });

    const query = `INSERT INTO recipes (name, ingredients, category, author, url, image, cookTime, recipeYield, date, prepTime, description) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(query, [name, ingredients, category, author, url, image, cookTime, recipeYield, date, prepTime, description], (error, results) => {
        if (error) {
            console.log('Error querying database:', error);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            console.log('Recipe saved to database successfully!');
            res.status(200).json({ message: 'Recipe saved to database successfully!' });
        }
    });
});



// Start server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`1Server started on port ${PORT}`);
});
