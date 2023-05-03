import React from 'react';
import recipes from './recipes.json';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import Header from "./Header";
import Footer from "./Footer";
import placeholderImage from "./img/placeholder-image.jpg";
import './RecipePage.css';

/**
 * Renderöi reseptisivun reseptille riippuen reseptin id:stä sivun URL:ssä.
 * @returns {JSX.Element}
 */
function RecipePage() {

    /**
     * Hakee id-parametrin URL:stä.
     */
    const { id } = useParams();

    /**
     * Etsii resepti-olion listasta id:n perusteella.
     * @type {object | undefined} - Resepti-olio tai undefined, jos reseptiä ei löytynyt.
     */
    const recipe = recipes.find((recipe) => recipe.id === parseInt(id));

    /**
     * Jakaa reseptin ainesosat \n-merkillä ja käy listan läpi. Asettaa ainesosat listaan.
     * @type {JSX.Element[]} - Lista reseptin ainesosista.
     */
    const ingredientsList = recipe.ingredients.split('\n').map((ingredient, index) => {
        return <li key={index}>{ingredient}</li>;
    });

    // Jos reseptiä ei löydy id:n perusteella, tämä renderöidään sivulle
    if (!recipe) {
        return <div>Recipe not found</div>;
    }

    return (
        <div>
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
        </div>
    );
}

export default RecipePage;
