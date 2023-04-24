import React from 'react';
import recipes from './recipes.json';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import Header from "./Header";

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

    return (
        <>
            <Header />
            <Container className="mt-4">
                <Row>
                    <Col md={8}>
                        <h2>{recipe.name}</h2>
                        <p>{recipe.description}</p>
                        <Image
                            src={recipe.image}
                            className="img-fluid mx-auto d-block my-3"
                            alt="Recipe image"
                        />
                    </Col>
                    <Col md={4}>
                        <h5 className="mb-3">Recipe Info</h5>
                        {recipe.ingredients && (
                        <p>
                            <strong>Ingredients:</strong> {recipe.ingredients}
                        </p>
                        )}
                        {recipe.category && (
                        <p>
                            <strong>Category:</strong> {recipe.category}
                        </p>
                        )}
                        {recipe.author && (
                        <p>
                            <strong>Author:</strong> {recipe.author}
                        </p>)}
                        {recipe.url && (
                            <p>
                                <strong>URL:</strong> <a href={recipe.url}>{recipe.url}</a>
                            </p>
                        )}
                        {recipe.cookTime && (
                            <p>
                                <strong>Cook time:</strong> {recipe.cookTime}
                            </p>
                        )}
                        {recipe.recipeYield && (
                            <p>
                                <strong>Recipe yield:</strong> {recipe.recipeYield}
                            </p>
                        )}
                        {recipe.date && (
                            <p>
                                <strong>Date published:</strong> {recipe.date}
                            </p>
                        )}
                        {recipe.prepTime && (
                            <p>
                                <strong>Prep time:</strong> {recipe.prepTime}
                            </p>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default RecipePage;
