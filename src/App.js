import React from 'react';
import Header from './Header.js';
import Body from './Body.js';
import Footer from "./Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

/**
 * Komponentti renderöi sivun header, body ja footer komponenteista koostuvan näkymän
 * @returns {JSX.Element}
 * @constructor
 */
function App() {

    return (
        <div id="Home">
            <Header />
            <Body />
            <Footer />
        </div>
    );
}

export default App;

