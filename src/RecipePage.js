import React from 'react';
import recipes from './recipes.json';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import Header from "./Header";
import Footer from "./Footer";
import placeholderImage from "./img/placeholder-image.jpg";
import './RecipePage.css';

function RecipePage(props) {
    // Receive the recipe id as a prop
    const { id } = useParams();

    console.log('id:', id);

    const recipe = recipes.find((recipe) => recipe.id === parseInt(id));
    console.log();
    console.log('recipe:', recipe);
    console.log('respa0 :', recipes[0]);

    if (!recipe) {
        return <div>Recipe not found</div>;
    }

    // Split ingredients by newline character and map to list items
    const ingredientsList = recipe.ingredients.split('\n').map((ingredient, index) => {
        return <li key={index}>{ingredient}</li>;
    });

    return (
        <>
            <Header />
            <Container fluid className="recipePageBody">
                <Row>
                    <Col id="descAndImage">
                        <h1>{recipe.name}</h1>
                        <p>{recipe.description}</p>
                        <hr/>
                        <Image
                            src={recipe.image || placeholderImage}
                            alt={recipe.name}
                            onError={(e) => {
                                e.target.src = placeholderImage;
                            }}
                            fluid
                            className="recipeImage"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col id="info">
                        <div className="recipeInfo">
                            <div className="ingredients">
                                {recipe.ingredients && (
                                    <div>
                                        <p>
                                            <strong>Ingredients:</strong>
                                        </p>
                                        <ul>
                                            {ingredientsList}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="otherInfo">
                                {recipe.category && (
                                    <div>
                                        <p>
                                            <strong>Category:</strong>
                                        </p>
                                        <ul>
                                            <li>{recipe.category}</li>
                                        </ul>
                                    </div>
                                )}
                                {recipe.author && (
                                    <div>
                                        <p>
                                            <strong>Author:</strong>
                                        </p>
                                        <ul>
                                            <li>{recipe.author}</li>
                                        </ul>
                                    </div>
                                )}
                                {recipe.cookTime && (
                                    <div>
                                        <p>
                                            <strong>Cook time:</strong>
                                        </p>
                                        <ul>
                                            <li>{recipe.cookTime}</li>
                                        </ul>
                                    </div>
                                )}
                                {recipe.recipeYield && (
                                    <div>
                                        <p>
                                            <strong>Recipe yield:</strong>
                                        </p>
                                        <ul>
                                            <li>{recipe.recipeYield}</li>
                                        </ul>
                                    </div>
                                )}
                                {recipe.date && (
                                    <div>
                                        <p>
                                            <strong>Date published:</strong>
                                        </p>
                                        <ul>
                                            <li>{recipe.date}</li>
                                        </ul>
                                    </div>
                                )}
                                {recipe.prepTime && (
                                    <div>
                                        <p>
                                            <strong>Prep time:</strong>
                                        </p>
                                        <ul>
                                            <li>{recipe.prepTime}</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
}

export default RecipePage;
