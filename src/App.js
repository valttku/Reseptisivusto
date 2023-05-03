import React from 'react';
import Header from './Header.js';
import Body from './Body.js';
import Footer from "./Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

/**
 * Komponentti renderöi sivun Header-, Body- ja Footer-komponenteista koostuvan näkymän.
 * @returns {JSX.Element}
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

