import React, { useState, useEffect } from 'react';
import Header from "./Header";
import Footer from "./Footer";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import recipesData from './recipes.json'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './NewRecipe.css'
/**
 * Komponentti uuden reseptin lisäämistä varten
 * @constructor
 * @returns JSX lomake jossa uuden reseptin voi lisätä
 */
const NewRecipe = () => {
    /**
     * username used in sign in
     * @type {string}
     */
    const signinUsername = sessionStorage.getItem('signinUsername');
    /**
     * Recipe name
     * @type {[string, function]}
     */
    const [name, setName] = useState('');
    /**
     * Recipe ingredients
     * @type {[string, function]}
     */
    const [ingredients, setIngredients] = useState('');
    /**
     * Recipe category
     * @type {[array, function]}
     */
    const [category, setCategory] = useState([]);
    /**
     * Recipe author
     * @type {[string, function]}
     */
    const [author, setAuthor] = useState(signinUsername);
    /**
     * Url to original recipe is optional
     * @type {[string, function]}
     */
    const [url, setUrl] = useState('');
    /**
     * Url to image
     * @type {[string, function]}
     */
    const [image, setImage] = useState(null);
    /**
     * Recipe cookTime
     * @type {[string, function]}
     */
    const [cookTime, setCookTime] = useState('');
    /**
     * How many people is the recipe for
     * @type {[string, function]}
     */
    const [recipeYield, setRecipeYield] = useState('');
    /**
     * Current date
     * @type {[string, function]}
     */
    const [date, setDate] = useState('');
    /**
     * Recipe prep time
     * @type {[string, function]}
     */
    const [prepTime, setPrepTime] = useState('');
    /**
     * Description of the recipe
     * @type {[string, function]}
     */
    const [description, setDescription] = useState('');
    /**
     * Recipes
     * @type {[array, function]}
     */
    const [recipes, setRecipes] = useState([]);


    useEffect(() => {
        setRecipes(recipesData);
        const currentDate = new Date().toISOString().slice(0, 10);
        setDate(currentDate);
        setCategory("Breakfast")
    }, []);

    /**
     * Funktio joka käsittelee lomakkeen lähetyksen kun käyttäjä valitsee "submit"-nappulan.
     * Tallennetaan reseptin tiedot oikeisiin kenttiin.
     * @param {Object} event - Tapahtumankäsittelijä
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        /**
         * Suurin reseptin id
         * @type {number}
         */
        const maxId = Math.max(...recipes.map(recipe => recipe.id), 0);
        /**
         * Resepti kenttineen
         * @type {{date: string, image: unknown, recipeYield: string, author: string, name: string, cookTime: string, ingredients: string, description: string, id: number, category: *[], url: string, prepTime: string}}
         */
        const recipe = {
            id: maxId + 1,
            name,
            ingredients: ingredients.replace(/,\s+/g, '\n'),
            category,
            author,
            url,
            image: image || '', // set image to empty string if it's null or undefined
            cookTime: cookTime + " minutes",
            recipeYield: "Serves " + recipeYield + ".",
            date,
            prepTime: prepTime + " minutes",
            description,
        };
        //Testailua
        console.log("Tässä uusi resepti: " + JSON.stringify(recipe));
        console.log("Tässä kaikki reseptit:");
        console.dir(recipes);
        setRecipes([...recipes, recipe]);
//Lähetetään resepti serverille
        axios
            .post('http://localhost:3001/NewRecipe', { ...recipe, id: recipe.id })
            .then(() => {
                setAuthor('');
                setImage('');
                setDate('');
                setCategory('');
                setUrl('');
                setRecipeYield('');
                setCookTime('');
                setPrepTime('');
                setDescription('');
                setIngredients('');
                setName('');
                window.location.reload();
            })
            .catch((error) => {
                alert('Error registering recipes. Make sure that you have a successful database connection and that you have filled ALL recipe details.');
                console.log(error);
            });
    };

    /**
     * Funktio käsittelee kategorioiden valinnan.
     * @param {Object} event - Tapahtumankäsittelijä
     */
    const handleCategoryChange = (event) => {
        //Huom tällä hetkellä poimii vain viimeisenä valitun kategorian
        const options = event.target.options;
        //valitut kategriat
        const selectedCategories = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedCategories.push(options[i].value);
            }
        }
        setCategory(selectedCategories.join(", "));
    };

    /**
     * Funktio käsittelee valokuvan lataamisen järjestelmään
     * @param {Object} event - Tapahtumankäsittelijä
     */
    const handleImageChange = (event) => {
        /**
         * Kuvatiedosto
         */
        const file = event.target.files[0];
        console.log(`const file: ${file}`);

        /**
         * Lomakkeen tiedot
         * @type {FormData}
         */
        const formData = new FormData();
        formData.append('image', file);
        axios.post('http://localhost:3001/upload', formData)
            .then((response) => {
                /**
                 * Kuvan nimi
                 */
                const imageName = response.data.filename;
                /**
                 * Polku kuvatiedostoon
                 * @type {string}
                 */
                const imagePath = 'http://localhost:3001/img/' + imageName;
                setImage(imagePath);
                console.log(`imagePath: ${imagePath}`);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    /**
     * Funktio käsittelee käyttäjän syöttämän urlin lisäämisen
     * @param {Object} event - Tapahtumankäsittelijä
     */
    //Huom. urlia ei enää pyydetä viimeisimmässä versiossa
    const handleUrlChange = (event) => {
        setUrl(event.target.value);
    }
    const [useImageAddress, setUseImageAddress] = useState(false);

    /**
     * Funktio käsittelee käyttäjän valinnan kuvan lataamisen ja kuvan osoitteen syöttämisen välillä
     * @param {Object} event - Tapahtumankäsittelijä
     */
    const handleRadioChange = (event) => {
        //jos käyttäjä haluaa ladata omista kansioistaan kuvatiedoston
        if (event.target.value === "upload") {
            setUseImageAddress(false);
            setImage(null); // clear previous image selection
            setUrl(""); // clear previous url selection
            //Jos käyttäjä haluaa syöttää netistä löytyvän kuvan urlin
        } else if (event.target.value === "address") {
            setUseImageAddress(true);
            setImage(null); // clear previous image selection
            setUrl(""); // clear previous url selection
        }
    };

    return (
        <Container fluid className="Newrecipe px-0">
            <Header/>
            <Container fluid className="newRecipeBody">
                <h1 className="add">Add new recipe</h1>
                <p className="add">Please fill out all sections of the form before you submit.</p>
                <Form onSubmit={handleSubmit} className="formRecipe">
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Name:</Form.Label>
                                <Form.Control type="text" value={name}
                                              onChange={(event) => setName(event.target.value)}/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Ingredients (one per line):</Form.Label>
                                <Form.Control as="textarea" className="textArea" rows={5} value={ingredients}
                                              onChange={(event) => setIngredients(event.target.value)}/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Prep Time:</Form.Label>
                                <Form.Control type="number" min="0" value={prepTime} placeholder="minutes"
                                              onChange={(event) => setPrepTime(event.target.value)}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Cook Time:</Form.Label>
                                <Form.Control type="number" min="0" value={cookTime} placeholder="minutes"
                                              onChange={(event) => setCookTime(event.target.value)}/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Recipe Yield:</Form.Label>
                                <Form.Control type="number" min="0" value={recipeYield}
                                              onChange={(event) => setRecipeYield(event.target.value)}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Category:</Form.Label>
                                <Form.Control as="select" value={category} onChange={handleCategoryChange} id="categories">
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                    <option value="Dessert">Dessert</option>
                                    <option value="Meat">Meat</option>
                                    <option value="Vegan">Vegan</option>
                                    <option value="Vegetarian">Vegetarian</option>
                                    <option value="Fish">Fish</option>
                                    <option value="Seafood">Seafood</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Description:</Form.Label>
                                <Form.Control as="textarea" className="textArea" rows={5} value={description}
                                              onChange={(event) => setDescription(event.target.value)}/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <div id="radioButtons">
                                    <Form.Check
                                        type="radio"
                                        id="uploadImage"
                                        label="Upload an image"
                                        checked={!useImageAddress}
                                        onChange={() => setUseImageAddress(false)}
                                    />
                                    <Form.Check
                                        type="radio"
                                        id="insertImageAddress"
                                        label="Insert image address"
                                        checked={useImageAddress}
                                        onChange={() => setUseImageAddress(true)}
                                    />
                                </div>
                                {useImageAddress ? (
                                    <Form.Control
                                        type="text"
                                        value={image}
                                        onChange={(event) => setImage(event.target.value)}
                                    />
                                ) : (
                                    <Form.Control
                                        type="file"
                                        onChange={handleImageChange}
                                    />
                                )}
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="buttonDiv">
                        <Button variant="primary" type="submit">Submit</Button>
                    </div>
                </Form>
            </Container>
            <Footer/>
        </Container>
    );
}

export default NewRecipe;