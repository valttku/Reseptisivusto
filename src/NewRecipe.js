import React, { useState, useEffect } from 'react';
import Header from "./Header";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import recipes from './recipes.json'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const NewRecipe = () => {
    const signinUsername = sessionStorage.getItem('signinUsername');
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [category, setCategory] = useState([]);
    const [author, setAuthor] = useState(signinUsername);
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
            ingredients: ingredients.replace(/,\s+/g, '\n'),
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


        axios
            .post('http://localhost:3001/NewRecipe', recipe)
            .then((response) => {
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
            })
            .catch((error) => {
                alert('Error registering recipes');
                console.log(error);
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
        setCategory(selectedCategories.join(", "));
    };


    const handleImageChange = (event) => {
        const imageFile = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = () => {
            const imageDataUrl = reader.result;
            const imageName = imageFile.name;
            const imageType = imageFile.type.split('/')[1];
            const imageSrc = `/img/${imageName}.${imageType}`;
            const imageBlob = dataURLtoBlob(imageDataUrl);
            saveImage(imageBlob, imageSrc);
            setImage(imageSrc);
        };
    };

    const dataURLtoBlob = (dataURL) => {
        const parts = dataURL.split(',');
        const mimeType = parts[0].match(/:(.*?);/)[1];
        const b64 = atob(parts[1]);
        let n = b64.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = b64.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mimeType });
    };

    const saveImage = (blob, fileName) => {
        const formData = new FormData();
        formData.append('image', blob, fileName);

        fetch('/save-image', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to save image');
                }
                console.log('Image saved successfully!');
            })
            .catch(error => {
                console.error('Error saving image:', error);
            });
    };
//lisättävä server.js:ään koodia kuvan poimimista varten

    return (
        <Container fluid className="Newrecipe px-0">
            <Header/>
            <Container>
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
                                <Form.Control as="textarea" rows={5} value={ingredients} onChange={(event) => setIngredients(event.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Category:</Form.Label>
                                <Form.Control as="select" multiple value={category} onChange={handleCategoryChange}>
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
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Cook Time (minutes):</Form.Label>
                                <Form.Control type="number" value={cookTime} onChange={(event) => setCookTime(event.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Recipe Yield:</Form.Label>
                                <Form.Control type="number" value={recipeYield} onChange={(event) => setRecipeYield(event.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Date:</Form.Label>
                                <Form.Control type="date" value={date} onChange={(event) => setDate(event.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Prep Time (minutes):</Form.Label>
                                <Form.Control type="number" value={prepTime} onChange={(event) => setPrepTime(event.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Description:</Form.Label>
                                <Form.Control as="textarea" rows={5} value={description} onChange={(event) => setDescription(event.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="primary" type="submit">Submit</Button>

                </Form>
            </Container>
        </Container>

    );
}
export default NewRecipe;
