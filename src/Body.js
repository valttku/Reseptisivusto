import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import recipeData from './recipes.json';
import placeholderImage from './img/placeholder-image.jpg';
import { useNavigate } from 'react-router-dom';
function Body() {
    const navigate = useNavigate();

    const [displayedRecipes, setDisplayedRecipes] = useState([]);

    useEffect(() => {
        const getRandomRecipes = () => {
            const randomIndexes = new Set();
            while (randomIndexes.size < 12) {
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
        const remainingIndexes = Array.from(
            { length: recipeData.length },
            (_, index) => index
        ).filter((index) => !displayedRecipes.some((recipe) => recipe.id === index));

        const randomIndexesToAdd = new Set();
        while (
            randomIndexesToAdd.size < 12 &&
            remainingIndexes.length > 0 &&
            randomIndexesToAdd.size < remainingIndexes.length
            ) {
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

    const handleRecipeClick = (recipe) => {
        navigate(`/recipe/${recipe.id}`);
    };

    return (
        <Container className="imageRow px-0">
            <Row>
                <Col>
                    <div className="images">
                        {displayedRecipes.map((recipe) => (
                            <div className="imageHolder" key={recipe.id} onClick={() => handleRecipeClick(recipe)}>
                                <Image
                                    src={recipe.image || placeholderImage}
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
                    </div>
                    <div className="showMoreButton">
                        <button onClick={handleShowMoreRecipes} id="showMore">Show More</button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Body;
