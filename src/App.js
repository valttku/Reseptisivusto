import React, { useState } from 'react';
import Header from './Header.js';
import Body from './Body.js';
import Footer from "./Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import {Switch, Route} from "react-router-dom";
import RecipePage from "./RecipePage";

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

