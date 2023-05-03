import React, {useState, useEffect} from "react";
import {Container, Row, Form, Button} from "react-bootstrap";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import "./Userpage.css";
import placeholderImage from "./img/placeholder-image.jpg";

/**
 * Userpage komponentti näyttää kirjautuneen käyttäjän omat reseptit ja antaa käyttäjälle mahdollisuuden muokata ja deletoida omia reseptejään
 *
 * @returns {JSX.Element} Userpage-komponentin palautus JSX-muodossa
 */
function Userpage() {
// Haetaan kirjautuneen käyttäjän tunnus session storagesta
    const signinUsername = sessionStorage.getItem("signinUsername");
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [showPopup, setShowPopup] = useState(null);

    /**
     * Haetaan reseptit serveriltä ja suodatetaan ne kirjautuneen käyttäjätunnuksen perusteella
     */
    useEffect(() => {
        axios
            .get("http://localhost:3001/recipes")
            .then((response) => {
                const filteredRecipes = response.data.filter(
                    (recipe) => recipe.author === signinUsername
                );
                setFilteredRecipes(filteredRecipes);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [signinUsername]);

    /**
     * Poistetaan resepti serveriltä
     *
     * @param {string} recipeName - Poistettavan reseptin nimi
     */
    const deleteRecipe = (recipeName) => {
        axios
            .delete(`http://localhost:3001/recipes/${recipeName}`)
            .then(() => {
                const newRecipes = filteredRecipes.filter(
                    (recipe) => recipe.name !== recipeName
                );
                setFilteredRecipes(newRecipes);
            })
            .catch((err) => console.log(err));
    };

    /**
     * Asetetaan valittu resepti muokattavaksi ja näytetään muokattava kenttä (reseptin nimi) popupissa
     *
     * @param {object} recipe - Muokattava resepti
     */
    const editRecipe = (recipe) => {
        const recipeCopy = JSON.parse(JSON.stringify(recipe));
        setSelectedRecipe({...recipeCopy, id: recipe.id.toString()});
        setShowPopup(recipe.id.toString());
    };
    /**
     * Mäpätään reseptit reseptikorteiksi ja palautetaan reseptin kentät halutussa muodossa
     */
    const recipeList = filteredRecipes.map((recipe) => {
        // Jaetaan ingredients-merkkijono osiin, jotta saadaan käytettyä niiden kanssa li-elementtejä
        const ingredients = recipe.ingredients.split("\n").map((ingredient, index) => (
            <li key={index}>{ingredient.trim()}</li>
        ));
//Tässä palautetaan valittu resepti halutussa muodossa ja laitetaan näkyviin vain ne kentät reseptistä, mitkä eivät ole tyhjiä
        return (
            <div className="card my-3" key={recipe.id} id="recipeCard">
                <h3>{recipe.name}</h3>
                <div className="card-body">
                    <img
                        src={recipe.image || placeholderImage}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = placeholderImage;
                        }}
                        className="img-fluid mx-auto d-block my-3"
                        alt="Recipe image"
                    />
                    <p><strong>Description:</strong> {recipe.description}</p>
                    <div id="recipeInfo">
                        <div id="ingredients">
                            {recipe.ingredients && (
                                <div>
                            <p><strong>Ingredients:</strong></p>
                            <ul>
                                {ingredients}
                            </ul>
                        </div>)}
                        </div>
                        <div>
                            {recipe.author && (
                                <div>
                            <p><strong>Author:</strong></p>
                            <ul>
                                <li> {recipe.author}</li>
                            </ul>
                                </div>)}
                            {recipe.cookTime && (
                                <div>
                            <p><strong>Cook time:</strong></p>
                            <ul>
                                <li>{recipe.cookTime}</li>
                            </ul>
                                </div>)}
                            {recipe.recipeYield && (
                                <div>
                            <p><strong>Recipe yield:</strong></p>
                            <ul>
                                <li>{recipe.recipeYield}</li>
                            </ul>
                                </div>)}
                            {recipe.date && (
                                <div>
                            <p><strong>Date published:</strong></p>
                            <ul>
                                <li>{recipe.date}</li>
                            </ul>
                                </div>)}
                            {recipe.prepTime && (
                                <div>
                            <p><strong>Prep time:</strong></p>
                            <ul>
                                <li>{recipe.prepTime}</li>
                            </ul>
                                </div>)}
                            {recipe.category && (
                                <div>
                            <p><strong>Category:</strong></p>
                            <ul>
                                <li>{recipe.category}</li>
                            </ul>
                                </div>)}
                        </div>
                    </div>
                    <hr/>
                    <div id="editAndDelete">
                        <Button onClick={() => editRecipe(recipe)}>Edit Name</Button>{" "}
                        <Button onClick={() => deleteRecipe(recipe.name)}>Delete</Button>
                    </div>
                </div>
                {showPopup === recipe.id.toString() && (
                    <div className="popup">
                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            axios
                                .put(`http://localhost:3001/recipes/${selectedRecipe.id}`, selectedRecipe)
                                .then((response) => {
                                    console.log('Response:', response.data);
                                    const updatedRecipe = response.data;
                                    const updatedRecipes = filteredRecipes.map((recipe) => {
                                        if (recipe.id === updatedRecipe.id) { // tehdään vertailu id:n perusteella
                                            return updatedRecipe;
                                        } else {
                                            return recipe;
                                        }
                                    });
                                    setFilteredRecipes(updatedRecipes);
                                    setShowPopup(null); // suljetaan muokkaus-popup editoinnin jälkeen
                                    window.location.reload();
                                })
                                .catch((error) => {
                                    console.error('Error:', error);
                                    setShowPopup(null); // suljetaan muokkaus-popup jos tulee virhe
                                });
                        }}>
                            <Form.Group controlId="name">
                                <div id="popUpBarAndButtons">
                                    <Form.Control
                                        className="my-input-field"
                                        type="text"
                                        value={selectedRecipe.name}
                                        onChange={(e) =>
                                            setSelectedRecipe({
                                                ...selectedRecipe,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                    <div id="buttons">
                                        <Button type="submit">
                                            Save Changes
                                        </Button>
                                        <Button onClick={() => setShowPopup(null)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </Form.Group>
                        </Form>
                    </div>
                )}
            </div>
        );
    });
//Palautetaan näkymä joka sisältää tarpeelliset elementit
    return (
        <div>
            <Header/>
            <Container fluid className="userpageBody">
                <h2>{signinUsername}'s Recipes</h2>
                <Row>{recipeList}</Row>
                <br/>
            </Container>
            <Footer/>
        </div>
    );
}

export default Userpage;