import React, { useState, useRef, useEffect } from 'react';
import { Navbar, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import './navbar.css'
import recipes from './recipes.json';

/**
 * Renderöi projektin navigointipalkin.
 * @returns {JSX.Element} Navbar-komponentti.
 */
function Header() {

    /**
     * Kuvastaa onko käyttäjä kirjautunut sisään sovellukseen vai ei.
     * @type {[boolean, function]}
     */
    const [signedIn, setSignedIn] = useState(sessionStorage.getItem("signedIn") ? sessionStorage.getItem("signedIn") === "true" : false);

    /**
     * Käyttäjän kirjautumisnimi.
     * @type {string}
     */
    const signinUsername = sessionStorage.getItem('signinUsername');

    /**
     * Käyttäjän syöttämä kysely hakukenttään.
     * @type {[string, function]}
     */
    const [searchQuery, setSearchQuery] = useState('');

    /**
     * Hakutulokset, jotka palautuvat kyselystä.
     * @type {array}
     */
    const [searchResults, setSearchResults] = useState([]);

    /**
     * Viite hakupalkkiin.
     */
    const searchRef = useRef(null);

    /**
     * Reitittimen navigointiobjekti, jolla voidaan muuttaa URL-osoite.
     * @type {function}
     */
    const navigate = useNavigate();

    /**
     * Käsittelee reseptien haun.
     * @param {object} event - Tapahtumankäsittelijä
     */
    const handleSearch = (event) => {
        event.preventDefault();
        // Etsitään reseptit, joiden nimi sisältää hakukyselyn.
        if (searchQuery) {
            const results = recipes.filter(recipe => {
                const name = recipe.name.toLowerCase();
                const query = searchQuery.toLowerCase();
                return name.includes(query);
            });
            setSearchResults(results);
        } else {
            // Asetetaan tulokseksi tyhjä taulukko, jos reseptejä ei löytynyt.
            setSearchResults([]);
        }
    }

    /**
     * Tarkistaa klikkaako käyttäjä hakupalkin ulkopuolelle.
     */
    useEffect(() => {
        // Jos käyttäjä klikkaa hakupalkin ulkopuolelle, hakutulokseksi asetetaan tyhjä taulukko ja hakupalkki sulkeutuu.
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchResults([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    /**
     * Käsittelee käyttäjän uloskirjautumisen.
     */
    const handleSignout = () => {
        localStorage.setItem('signinUsername', '');
        setSignedIn(false);
        sessionStorage.removeItem('signedIn');
        sessionStorage.removeItem('signinUsername');
        // Palautetaan käyttäjä takaisin etusivulle uloskirjautumisen jälkeen.
        navigate('/');
    }

    return (
        <Navbar expand="lg">
            <Navbar.Brand id="topheading" href="/">Recipe App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <div className="nav-container">
                    <section id="navigate">
                        <div id="navLinks">
                            {signedIn && (
                                <>
                                    <NavLink to="/NewRecipe" className="nav-link">
                                        Add new recipe
                                    </NavLink>
                                    <NavLink to="/Userpage" className="nav-link" id="myRecipes">
                                        My recipes
                                    </NavLink>
                                </>
                            )}
                            {!signedIn && (
                                <NavLink to="/SignIn" className="nav-link">
                                    Sign In
                                </NavLink>
                            )}
                        </div>
                        <div>
                            <Form id="searchBarAndButton" onSubmit={handleSearch}>
                                <Form.Control
                                    type="text"
                                    placeholder="Find a recipe"
                                    className="mr-sm-2 userInput"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                />
                                <Button variant="outline-success" type="submit">
                                    Search
                                </Button>
                            </Form>
                            <div className="loggedIn">
                                {signedIn && (
                                    <div>
                                        Signed in as&nbsp;<b>{signinUsername}</b>
                                        <Button
                                            variant="outline-success"
                                            type="Signout"
                                            onClick={handleSignout}
                                            className="loggedInButton"
                                        >
                                            Sign out
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className="search-container" ref={searchRef}>
                                {searchResults.length > 0 && (
                                    <div className="search-results">
                                        {searchResults.map((recipe, index) => (
                                            <div key={index} className="search-result">
                                                <Link to={`/recipe/${recipe.id}`} onClick={() => setSearchResults([])}>
                                                    <p>{recipe.name}</p>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Header;