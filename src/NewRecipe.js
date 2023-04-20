
import React, { useState, useEffect } from 'react';
import Header from "./Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import recipes from './recipes.json'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';


const NewRecipe = () => {
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [category, setCategory] = useState([]);
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');
    const [image, setImage] = useState(null);
    const [cookTime, setCookTime] = useState('');
    const [recipeYield, setRecipeYield] = useState('');
    const [date, setDate] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [description, setDescription] = useState('');


    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        fetch('./recipes.json')
            .then(response => response.json())
            .then(data => setRecipes(data.recipes))
            .catch(error => console.error('Error fetching recipes:', error));
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const recipe = {
            name,
            ingredients: ingredients.split('\n'),
            category,
            author,
            url,
            image,
            cookTime,
            recipeYield,
            date,
            prepTime,
            description,
        };
        //Testing
        console.log("Tässä uusi resepti: " + JSON.stringify(recipe));
        const recipes = require("./recipes.json");
        console.log("Tässä kaikki reseptit:");
        console.dir(recipes);
        recipes.push(recipe);
        console.log("Tässä kaikki reseptit uudelleen:");
        console.dir(recipes);


        const newRecipes = [...recipes, recipe];
        setRecipes(newRecipes);

        fetch('./recipes.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ recipes: newRecipes }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Recipe added successfully!');
            })
            .catch(error => {
                console.error('There was an error:', error);
            });
    };


    const handleCategoryChange = (event) => {
        const options = event.target.options;
        const selectedCategories = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedCategories.push(options[i].value);
            }
        }
        setCategory(selectedCategories);
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    return (
        <Container>
            <Header />
            <h1 className="add">Add your own recipe below</h1>
            <p className="add">Please fill out all sections of the form before you submit.</p>
            <Form onSubmit={handleSubmit} className="formRecipe">
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type="text" value={name} onChange={(event) => setName(event.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Ingredients (one per line):</Form.Label>
                            <Form.Control as="textarea" value={ingredients} onChange={(event) => setIngredients(event.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Category:</Form.Label>
                            <Form.Control as="select" multiple value={category} onChange={handleCategoryChange}>
                                <option value="dessert">Dessert</option>
                                <option value="meat">Meat</option>
                                <option value="seafood">Seafood</option>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="vegan">Vegan</option>
                                <option value="undefined">Undefined</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Author:</Form.Label>
                            <Form.Control type="text" value={author} onChange={(event) => setAuthor(event.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>URL:</Form.Label>
                            <Form.Control type="text" value={url} onChange={(event) => setUrl(event.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Image:</Form.Label>
                            <Form.Control type="file" onChange={handleImageChange} />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="cookTime">
                    <Form.Label>Cook Time:</Form.Label>
                    <Form.Control type="text" value={cookTime} onChange={(event) => setCookTime(event.target.value)} />
                </Form.Group>

                <Form.Group controlId="recipeYield">
                    <Form.Label>Recipe Yield:</Form.Label>
                    <Form.Control type="text" value={recipeYield} onChange={(event) => setRecipeYield(event.target.value)} />
                </Form.Group>

                <Form.Group controlId="date">
                    <Form.Label>Date:</Form.Label>
                    <Form.Control type="text" value={date} onChange={(event) => setDate(event.target.value)} />
                </Form.Group>

                <Form.Group controlId="prepTime">
                    <Form.Label>Prep Time:</Form.Label>
                    <Form.Control type="text" value={prepTime} onChange={(event) => setPrepTime(event.target.value)} />
                </Form.Group>

                <Form.Group controlId="description">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control as="textarea" value={description} onChange={(event) => setDescription(event.target.value)} />
                </Form.Group>

                <Button variant="primary" type="submit">Submit</Button>

            </Form>
        </Container>

    );
}
export default NewRecipe;
