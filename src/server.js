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

//Lisää kaikki reseptit omaan tietokantaan:
/*for (let i = 0; i < recipesjson.length; i++) {
    const recipe = recipesjson[i];
    const { id, name, ingredients, category, author, url, image, cookTime, recipeYield, date, prepTime, description } = recipe;
    const query = `INSERT INTO recipes (id, name, ingredients, category, author, url, image, cookTime, recipeYield, date, prepTime, description) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(query, [id, name, ingredients, category, author, url, image, cookTime, recipeYield, date, prepTime, description], (error, results) => {
        if (error) {
            console.log('Error querying database:', error);
        } else {
            console.log('Recipe added to database:', recipe.name);
        }
    });
}*/
//TUULI
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './img',
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Images only!');
        }
    }
});

app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file);
    res.json({ filename: req.file.filename });
});

// Tallennetaan käyttäjätiedot tietokantaan JA userDetails jsoniin

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

// Tallennetaan recipes tietokantaan JA recipes jsoniin

app.post('/NewRecipe', (req, res) => {
    const { id, name, ingredients, category, author, url, image, cookTime, recipeYield, date, prepTime, description } = req.body;
    //tallennetaan myös json-fileen
    recipesjson.push(req.body);
    fs.writeFile('./recipes.json', JSON.stringify(recipesjson), (err) => {
        if (err) {
            console.log('Error writing to recipes-file:', err);
        } else {
            console.log('Recipe saved to json-file successfully!');
        }
    });

    const query = `INSERT INTO recipes (id, name, ingredients, category, author, url, image, cookTime, recipeYield, date, prepTime, description) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(query, [id, name, ingredients, category, author, url, image, cookTime, recipeYield, date, prepTime, description], (error, results) => {
        if (error) {
            console.log('Error querying database:', error);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            console.log('Recipe saved to database successfully!');
            res.status(200).json({ message: 'Recipe saved to database successfully!' });
        }
    });
});

// Saadan kaikki reseptit tietokannasta UUSI

app.get('/recipes', (req, res) => {
    const query = `SELECT * FROM recipes`;
    connection.query(query, (error, results) => {
        if (error) {
            console.log('Error querying database:', error);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            console.log('Retrieved all recipes successfully!');
            res.status(200).json(results);
        }
    });
});

// Saadan yhden tietyn reseptin tietokannasta nimen perusteella UUSI JA EI KÄYTÖSSÄ

app.get('/recipes/:name', (req, res) => {
    const recipeName = req.params.name;
    const query = `SELECT * FROM recipes WHERE name = ?`;
    connection.query(query, [recipeName], (error, results) => {
        if (error) {
            console.log('Error querying database:', error);
            res.status(500).json({ message: 'Internal server error' });
        } else if (results.length === 0) {
            res.status(404).json({ message: `Recipe with id ${recipeName} not found` });
        } else {
            res.status(200).json(results[0]);
        }
    });
});

// Päivitetään recipe nimen perusteella

app.put('/recipes/:name', (req, res) => {
    const { id } = req.params;
    const { name} = req.body;

    const query = `UPDATE recipes 
                 SET name = ?`;

    connection.query(query, [name,id], (error, results) => {
        if (error) {
            console.log('Error updating recipe:', error);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            console.log('Recipe updated successfully!');
            res.status(200).json({ message: 'Recipe updated successfully!' });
        }
    });
});

// Poistetaan recipe nimen perusteella
app.delete('/recipes/:name', (req, res) => {
    const name = req.params.name;
    const query = `DELETE FROM recipes WHERE name=?`;
    connection.query(query, [name], (error, results) => {
        if (error) {
            console.log('Error querying database:', error);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            console.log('Recipe deleted successfully!');
            res.status(200).json({ message: 'Recipe deleted successfully!' });
        }
    });
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});