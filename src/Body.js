import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import recipeData from './recipes.json';
import placeholderImage from './img/placeholder-image.jpg';
import { useNavigate } from 'react-router-dom';

/**
 * Projektin etusivu.
 * Luo etusivulle gridin, jossa on satunnaisia reseptejä JSON-tiedostosta.
 * Käyttäjä voi ladata lisää reseptejä "Show More"-napin kautta.
 * Reseptin kuvan klikkaus ohjaa käyttäjän reseptin omalle sivulle.
 * @returns {JSX.Element} Renderöity komponentti
 */
function Body() {

    /**
     * Reitittimen navigointiobjekti, jolla voidaan muuttaa URL-osoite.
     * @type {function}
     */
    const navigate = useNavigate();

    /**
     * Nykyisellä hetkellä näytettävät reseptit.
     * @type {array}
     */
    const [displayedRecipes, setDisplayedRecipes] = useState([]);

    useEffect(() => {
        /**
         * Valitsee 12 satunnaista indeksiä ja käyttää indeksejä hakemaan 12 reseptiä JSON-tiedostosta.
         * @function
         */
        const getRandomRecipes = () => {
            const randomIndexes = new Set();
            // Reseptejä generoidaan aina 12
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

    /**
     * Funktio, jota kutsutaan käyttäjän painaessa "Show More"-nappia.
     * Valitsee satunnaisesti 12 reseptiä, jotka eivät ole vielä näkyvissä etusivulla.
     * @function
     */
    const handleShowMoreRecipes = () => {
        // Haetaan taulukko indeksejä jäljellä oleville resepteille, joita ei ole vielä näytetty etusivulla
        const remainingIndexes = Array.from(
            { length: recipeData.length },
            (_, index) => index
        ).filter((index) => !displayedRecipes.some((recipe) => recipe.id === index));
        // Generoidaan 12 satunnaista indeksiä uusille resepteille jäljellä olevista resepteistä
        const randomIndexesToAdd = new Set();
        while (randomIndexesToAdd.size < 12 && remainingIndexes.length > 0 && randomIndexesToAdd.size < remainingIndexes.length) {
            // Valitaan satunnainen indeksi jälkellä olevista indekseistä
            const randomIndex =
                remainingIndexes[Math.floor(Math.random() * remainingIndexes.length)];
            randomIndexesToAdd.add(randomIndex);
            remainingIndexes.splice(remainingIndexes.indexOf(randomIndex), 1);
        }
        const randomRecipesToAdd = Array.from(randomIndexesToAdd).map(
            (index) => recipeData[index]
        );
        // Lisätään uudet reseptit
        setDisplayedRecipes((prevDisplayedRecipes) =>
            prevDisplayedRecipes.concat(randomRecipesToAdd)
        );
    };

    /**
     * Funktio, jota kutsutaan käyttäjän klikkaessa reseptin kuvaa.
     * Ohjaa käyttäjän reseptin omalle sivulle.
     * @function
     * @param {object} recipe - Resepti-olio, joka näytetään reseptisivulla
     */
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
