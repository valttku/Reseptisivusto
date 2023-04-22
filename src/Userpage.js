import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import recipes from './recipes.json';
import axios from 'axios';

function Userpage() {
    const signinUsername = sessionStorage.getItem("signinUsername");
    const [filteredRecipes, setFilteredRecipes] = useState([]);
//.
    useEffect(() => {
        axios.get('http://localhost:3001/recipes')
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

    const deleteRecipe = (recipeName) => {
        axios
            .delete(`http://localhost:3001/recipes/${recipeName}`)
            .then(() => {
                const newRecipes = filteredRecipes.filter((recipe) => recipe.name !== recipeName);
                setFilteredRecipes(newRecipes);
            })
            .catch((err) => console.log(err));
    };

    const recipeList = filteredRecipes.map((recipe) => {
        return (
            <div className="card my-3" key={recipe.name}>
                <div className="card-header">{recipe.name}</div>
                <div className="card-body">
                    <img
                        src={recipe.image}
                        className="img-fluid mx-auto d-block my-3"
                        alt="Recipe image"
                    />
                    <ul>
                        <li>
                            <strong>Ingredients:</strong> {recipe.ingredients}
                        </li>
                        <li>
                            <strong>Category:</strong> {recipe.category}
                        </li>
                        <li>
                            <strong>Author:</strong> {recipe.author}
                        </li>
                        <li>
                            <strong>URL:</strong> <a href={recipe.url}>{recipe.url}</a>
                        </li>
                        <li>
                            <strong>Cook time:</strong> {recipe.cookTime}
                        </li>
                        <li>
                            <strong>Recipe yield:</strong> {recipe.recipeYield}
                        </li>
                        <li>
                            <strong>Date published:</strong> {recipe.datePublished}
                        </li>
                        <li>
                            <strong>Prep time:</strong> {recipe.prepTime}
                        </li>
                        <li>
                            <strong>Description:</strong> {recipe.description}
                        </li>
                    </ul>
                    <button onClick={() => deleteRecipe(recipe.name)}>Delete</button>
                </div>
            </div>
        );
    });

    return (
        <div>
            <Header />
            <div className="container">
                <h1>Recipes</h1>
                <div id="recipe-list">{recipeList}</div>
            </div>
        </div>
    );
}

export default Userpage;