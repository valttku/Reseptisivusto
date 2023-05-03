import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import SignIn from './SignIn';
import Userpage from "./Userpage";
import NewRecipe from './NewRecipe';
import RecipePage from './RecipePage';
import reportWebVitals from './reportWebVitals';
import Body from "./Body";
import { BrowserRouter, Routes, Route, Switch } from "react-router-dom";


/**
 * Root-elementti jossa sovellus renderöidään
 * @type {Root}
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
/**
 * Renderöi sovelluksen root-elementtiin käyttäen Reactin Strict  modea. Komponenttien reititys hoidetaan täällä.
 */
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/newrecipe" element={<NewRecipe />} />
                <Route path="/userpage" element={<Userpage />} />
                <Route path="/" element={<Body />} />
                <Route path="/recipe/:id" element={<RecipePage />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
);

reportWebVitals();
