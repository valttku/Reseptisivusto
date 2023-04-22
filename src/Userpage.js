import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import recipes from './recipes.json';

function Userpage() {
    const signinUsername = sessionStorage.getItem("signinUsername");
    const [filteredRecipes, setFilteredRecipes] = useState([]);

    useEffect(() => {
        const filteredRecipes = recipes.filter(
            (recipe) => recipe.author === signinUsername
        );
        setFilteredRecipes(filteredRecipes);
    }, [signinUsername]);

    const handleDelete = (id) => {
        const deleteConfirmed = window.confirm(
            "Are you sure you want to delete this recipe?"
        );

        if (deleteConfirmed) {
            const newRecipes = filteredRecipes.filter((recipe) => recipe.id !== id);
            setFilteredRecipes(newRecipes);

            const updatedRecipes = {
                recipes: newRecipes
            };
            localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
        }
    };

    const handleModify = (id) => {
    };

    const formatIngredients = (ingredients) => {
        const formattedIngredients = ingredients.split("\n").map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
        ));
        return (
            <ul className="list-unstyled">
                {formattedIngredients}
            </ul>
        );
    };

    const recipeList = filteredRecipes.length ? filteredRecipes.map((recipe) => {
        return (
            <div className="card my-3" key={recipe.id}>
                <div className="card-header">{recipe.name}</div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <img
                                src={recipe.image}
                                className="img-fluid mx-auto d-block my-3"
                                alt="Recipe image"
                            />
                        </div>
                        <div className="col-md-8">
                            <ul className="list-unstyled">
                                {recipe.category && <li><strong>Category:</strong> {recipe.category}</li>}
                                {recipe.url && <li><strong>URL:</strong> <a href={recipe.url}>{recipe.url}</a></li>}
                                {recipe.cookTime && <li><strong>Cook time:</strong> {recipe.cookTime}</li>}
                                {recipe.prepTime && <li><strong>Prep time:</strong> {recipe.prepTime}</li>}
                                {recipe.description && <li><strong>Description:</strong> {recipe.description}</li>}
                                {recipe.ingredients && (
                                    <li>
                                        <strong>Ingredients:</strong>
                                        <div className="row">
                                            <div className="col-md-6">
                                                {formatIngredients(recipe.ingredients)}
                                            </div>
                                        </div>
                                    </li>
                                )}
                            </ul>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button className="btn btn-secondary me-md-2"
                                        onClick={() => handleModify(recipe.id)}>Modify recipe
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDelete(recipe.id)}>Delete
                                    recipe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }) : (
        <div className="card my-3">
            <div className="card-header">You haven't added any recipes yet</div>
            <div className="card-body">
                <p>You can add your first recipe through this <a href="./NewRecipe">link</a>.</p>
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <div className="container mt-3">
                <h2 className="mb-3">{signinUsername}'s Recipes</h2>
                {recipeList}
            </div>
        </>
    );
}

export default Userpage;