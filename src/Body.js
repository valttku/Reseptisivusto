import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import recipeData from './recipes.json';
import placeholderImage from './placeholder-image.jpg';

function Body() {
    const [displayedRecipes, setDisplayedRecipes] = useState([]);

    useEffect(() => {
        const getRandomRecipes = () => {
            const randomIndexes = new Set();
            while (randomIndexes.size < 6) {
                randomIndexes.add(Math.floor(Math.random() * recipeData.length));
            }
            const randomRecipes = Array.from(randomIndexes).map(
                (index) => recipeData[index]
            );
            setDisplayedRecipes(randomRecipes);
        };
        getRandomRecipes();
    }, []);

    const handleShowMoreRecipes = () => {
        const randomIndexes = new Set([...Array(recipeData.length).keys()]);
        const remainingIndexes = [...randomIndexes].filter(
            (index) => !displayedRecipes.some((recipe) => recipe.id === index)
        );
        const randomIndexesToAdd = new Set();
        while (randomIndexesToAdd.size < 6 && remainingIndexes.length > 0) {
            const randomIndex =
                remainingIndexes[Math.floor(Math.random() * remainingIndexes.length)];
            randomIndexesToAdd.add(randomIndex);
            remainingIndexes.splice(remainingIndexes.indexOf(randomIndex), 1);
        }
        const randomRecipesToAdd = Array.from(randomIndexesToAdd).map(
            (index) => recipeData[index]
        );
        setDisplayedRecipes((prevDisplayedRecipes) =>
            prevDisplayedRecipes.concat(randomRecipesToAdd)
        );
    };

    return (
        <Container className="px-0">
            <Row>
                <Col>
                    <div className="images">
                        {displayedRecipes.map((recipe) => (
                            <div className="imageHolder">
                                <Image
                                    src={recipe.image}
                                    alt={recipe.name}
                                    onError={(e) => {
                                        e.target.src = placeholderImage;
                                    }}
                                    fluid
                                    className="cropped-image"
                                />
                                <p id="caption">{recipe.name}</p>
                            </div>
                        ))}
                        <button onClick={handleShowMoreRecipes} id="showMore">Show More</button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Body;
