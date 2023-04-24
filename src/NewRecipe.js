import React, { useState, useEffect } from 'react';
import Header from "./Header";
import Footer from "./Footer";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import recipesData from './recipes.json'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './NewRecipe.css'

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
    const [selectedOption, setSelectedOption] = useState("");

    const [recipes, setRecipes] = useState([]);



    useEffect(() => {
        setRecipes(recipesData);
        const currentDate = new Date().toISOString().slice(0, 10);
        setDate(currentDate);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const maxId = Math.max(...recipes.map(recipe => recipe.id), 0);
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
        //Testing
        console.log("Tässä uusi resepti: " + JSON.stringify(recipe));
        console.log("Tässä kaikki reseptit:");
        console.dir(recipes);
        setRecipes([...recipes, recipe]);

        axios
            .post('http://localhost:3001/NewRecipe', { ...recipe, id: recipe.id })
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
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        axios.post('http://localhost:3001/upload', formData)
            .then((response) => {
                setImage(response.data.url);
                setUrl(response.data.url);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleUrlChange = (event) => {
        setUrl(event.target.value);
    }
    const [useImageAddress, setUseImageAddress] = useState(false);

    const handleRadioChange = (event) => {
        if (event.target.value === "upload") {
            setUseImageAddress(false);
            setImage(null); // clear previous image selection
            setUrl(""); // clear previous url selection
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
                                <Form.Label>Cook Time</Form.Label>
                                <Form.Control type="number" min="0" value={cookTime} placeholder="minutes"
                                              onChange={(event) => setCookTime(event.target.value)}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Prep Time</Form.Label>
                                <Form.Control type="number" min="0" value={prepTime} placeholder="minutes"
                                              onChange={(event) => setPrepTime(event.target.value)}/>
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
                                <Form.Label>Image:</Form.Label>
                                <div>
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
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>URL:</Form.Label>
                                <Form.Control type="text" value={url} placeholder="If recipe is borrowed, add url to original recipe" onChange={(event) => setUrl(event.target.value)}/>
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