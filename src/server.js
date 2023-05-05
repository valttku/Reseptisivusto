const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();
const users = require("./userDetails.json");
const recipesjson = require("./recipes.json");
const fs = require("fs");

/**
 * Luodaan Express.js sovellus
 * @type {*|Express}
 */
const app = express();
/**
 *Otetaan Node.js:n path-moduuli käyttöön
 * @type {path.PlatformPath | path}
 */
const path = require('path');

//Lisätään CORS-käytännön mukainen middleware Express-sovellukseen
app.use(cors());
//asetetaan json() -funktio middleware-ketjuun. Tämä middleware analysoi JSON-pyyntötietoja ja lisää niiden tulokset request -olion body-ominaisuuteen
app.use(express.json());
//asetetaan express-sovellus käyttämään middlewarea joka analysoi URL-koodattuja pyyntöjä
app.use(express.urlencoded({ extended: true }));

/**
 * Luodaan MySQL tietokannan config ja yhteys
 * @type {object}
 */
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'recipes',
    //port: 3307
});

/**
 * Funktio luo yhteyden tietokantaan
 */
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
//Kuvien lisäys kasnioon Multeria käyttäen

/**
 * Multerin avulla käsitellään tässä http-pyyntöjä jotka sisältävät kuvia
 * @type {(function(*): (Multer|undefined))|{diskStorage?: (function(*): DiskStorage)|{}, memoryStorage?: (function(*): MemoryStorage)|{}, MulterError?: (function(*, *): void)|{}}}
 */
const multer = require('multer');
//Lisätään kuvat img-kansioon

/**
 * Tallennetaan kuvat img-kansioon multeria käyttäen
 * @type {DiskStorage}
 */
const storage = multer.diskStorage({
    destination: './img',
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

/**
 * Funktio tarkistaa että siirretyt tiedostot ovat kuvatiedostoja
 * @type {Multer|undefined}
 */
const upload = multer({
    storage: storage,
    //tarkistetaan filejen formaatti
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

/**
 * Funktio käsittelee kuvan lataamisen
 */
app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file);
    res.json({ filename: req.file.filename });
});

/**
 * Tallennetaan käyttäjätiedot tietokantaan ja userDetails json-tiedostoon
 * Tiedot saadaan pyyntöobjektina req.body SignIn.js-sivun kautta axios.postilla
 */
app.post('/signin', (req, res) => {
    const { username, email, password } = req.body;
    users.push(req.body);

//tallennus json-tiedostoon:
    fs.writeFile('./userDetails.json', JSON.stringify(users), (err) => {
        if (err) {
            console.log('Error writing to file:', err);
        } else {
            console.log('User details saved to file successfully!');
        }
    });
//tallennus tietokantaan
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

/**
 * Tallennetaan uusi resepti recipes-tietokantaan ja recipes.json-tiedostoon.
 * Tiedot saadaan pyyntöobjektina req.body NewRecipe.js-sivun kautta axios.postilla
 *
 */
app.post('/NewRecipe', (req, res) => {
    const { id, name, ingredients, category, author, url, image, cookTime, recipeYield, date, prepTime, description } = req.body;
    //tallennetaan json-fileen:
    recipesjson.push(req.body);
    fs.writeFile('./recipes.json', JSON.stringify(recipesjson), (err) => {
        if (err) {
            console.log('Error writing to recipes-file:', err);
        } else {
            console.log('Recipe saved to json-file successfully!');
        }
    });
//tallennetaan tietokantaan:
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

/**
 * Funktio hakee kaikki reseptit tietokannasta
 */
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

/**
 * Haetaan tietokannasta yhden reseptin tiedot
 */
//ei ole käytössä
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

/**
 * Funktio päivittää reseptin nimen tietokantaan sekä recipes.json-tiedostoon.
 * Päivitettävän reseptin id saadaan serverille pyyntöobjektina req.params kun userpage.js filessä välitetään se axios.put-kutsuna
 */
app.put('/recipes/:id', (req, res) => {
    //päivitettävän reseptin id
    const { id } = req.params;

    //päivitettävän reseptin uusi nimi
    const { name } = req.body;

    let recipesjson = fs.readFileSync('./recipes.json', 'utf-8');
    const recipes = JSON.parse(recipesjson);
    const index = recipes.findIndex((recipe) => recipe.id === parseInt(id));
    if (index === -1) {
        console.log('Recipe not found');
        res.status(404).json({ message: 'Recipe not found' });
    } else {
        recipes[index].name = name;
        //päivitys recipes.json-tiedostoon
        fs.writeFile('./recipes.json', JSON.stringify(recipes), (err) => {
            if (err) {
                console.log('Error writing to recipes-file:', err);
                res.status(500).json({ message: 'Internal server error' });
            } else {
                console.log('Recipe saved to json-file successfully!');
                //päivitys recipes-tietokantaan
                const query = `UPDATE recipes 
                       SET name = ?
                       WHERE id = ?`;
                connection.query(query, [name, id], (error, results) => {
                    if (error) {
                        console.log('Error updating recipe:', error);
                        res.status(500).json({ message: 'Internal server error' });
                    } else {
                        console.log('Recipe updated successfully!');
                        res.status(200).json({ message: 'Recipe updated successfully!' });
                    }
                });
            }
        });
    }
});

// Poistetaan recipe nimen perusteella
/**
 * Funktio poistaa tietokannasta reseptin reseptin sen perusteella minkä niminen resepti on valittu poistettavaksi.
 * Poistettavan reseptin nimi saadaan serverille pyyntöobjektina kun userpage.js filessä välitetään se axios.delete-kutsuna
 */
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

/**
 * Noutaa kuvan tiedostonimen perusteella
 */
app.get('/img/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'img', imageName);

    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(404).send('Image not found');
        } else {
            res.sendFile(imagePath);
        }
    });
});

// Start server
/**
 * Portti missä serveri käynnistetään
 * @type {number}
 */
const PORT = 3001;
/**
 * Funktio käynnistää http-palvelimen määritellylle portille
 * @param {number} PORT - Portti, jolla palvelin kuuntelee yhteyksiä.
 * @param {function} callback - Suoritettava funktio, kun palvelin on käynnistetty onnistuneesti.
 */
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

