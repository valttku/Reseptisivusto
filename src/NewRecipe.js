
import React, { useState, useEffect } from 'react';
import Header from "./Header";
import './newrecipe.css';


const NewRecipe = () => {
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [category, setCategory] = useState([]);
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');
    const [image, setImage] = useState(null);
    const [cookTime, setCookTime] = useState('');
    const [recipeYield, setRecipeYield] = useState('');
    const [date, setDate] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [description, setDescription] = useState('');


    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        fetch('./recipes.json')
            .then(response => response.json())
            .then(data => setRecipes(data.recipes))
            .catch(error => console.error('Error fetching recipes:', error));
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const recipe = {
            name,
            ingredients: ingredients.split('\n'),
            category,
            author,
            url,
            image,
            cookTime,
            recipeYield,
            date,
            prepTime,
            description,
        };
        console.log("Tässä uusi resepti: " + JSON.stringify(recipe));

        const newRecipes = [...recipes, recipe];
        setRecipes(newRecipes);

        fetch('./recipes.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ recipes: newRecipes }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Recipe added successfully!');
            })
            .catch(error => {
                console.error('There was an error:', error);
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
        setCategory(selectedCategories);
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    return (
        <main>
        <Header/>
            <h1 class="add">Add your own recipe below</h1>
            <p class = "add">Please fill out all sections of the form before you submit.</p>
        <form onSubmit={handleSubmit} className="formRecipe">

            <div className="form-row">
                <label>
                    Name:
                    <input type="text" value={name} onChange={(event) => setName(event.target.value)}/>
                </label>
            </div>
            <div className="form-row">
                <label>
                    Ingredients (one per line):
                    <textarea value={ingredients} onChange={(event) => setIngredients(event.target.value)}/>
                </label>
            </div>
            <div className="form-row">
                <label>
                    Category:
                    <select multiple value={category} onChange={handleCategoryChange}>
                        <option value="dessert">Dessert</option>
                        <option value="meat">Meat</option>
                        <option value="seafood">Seafood</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="undefined">Undefined</option>
                    </select>
                </label>
            </div>
            <div className="form-row">
                <label>
                    Author:
                    <input type="text" value={author} onChange={(event) => setAuthor(event.target.value)}/>
                </label>
            </div>
            <div className="form-row">
                <label>
                    URL:
                    <input type="text" value={url} onChange={(event) => setUrl(event.target.value)}/>
                </label>
            </div>
            <div className="form-row">
                <label>
                    Image:
                    <input type="file" onChange={handleImageChange}/>
                </label>
            </div>
            <div className="form-row">
                <label>
                    Cook Time:
                    <input type="text" value={cookTime} onChange={(event) => setCookTime(event.target.value)}/>
                </label>
            </div>
            <div className="form-row">
                <label>
                    Recipe Yield:
                    <input type="text" value={recipeYield} onChange={(event) => setRecipeYield(event.target.value)}/>
                </label>
            </div>
            <div className="form-row">
                <label>
                    Date:
                    <input type="text" value={date} onChange={(event) => setDate(event.target.value)}/>
                </label>
            </div>
            <div className="form-row">
                <label>
                    Prep Time:
                    <input type="text" value={prepTime} onChange={(event) => setPrepTime(event.target.value)}/>
                </label>
            </div>
            <div className="form-row">
                <label>
                    Description:
                    <textarea value={description} onChange={(event) => setDescription(event.target.value)}/>
                </label>
            </div>
            <div className="form-row-last">
            <button type="submit">Submit</button>
            </div>
        </form>
        </main>

    );
}
export default NewRecipe;
