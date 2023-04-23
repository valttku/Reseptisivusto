import React, { useState } from 'react';
import Header from './Header.js';
import Body from './Body.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchResults = (results) => {
        setSearchResults(results);
    };

    return (
        <div id="Home">
            <Header setSearchResults={handleSearchResults} />
            <Body />
        </div>
    );
}

export default App;

