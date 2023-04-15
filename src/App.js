import React, { useState } from 'react';
import Header from './Header.js';
import Body from './Body.js';
import Results from './Results.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import recipeData from './recipes.json';

function App() {
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchResults = (results) => {
        setSearchResults(results);
    };

    return (
        <div>
            <Header setSearchResults={handleSearchResults} />
            <Body />
            {searchResults.length > 0 && <Results searchResults={searchResults} />}
        </div>
    );
}

export default App;

// Testikommentti
