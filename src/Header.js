import React, { useState } from 'react';
import { Navbar, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink, Link } from 'react-router-dom';
import './navbar.css'
import recipes from './recipes.json';

function Header() {
    const [signedIn, setSignedIn] = useState(sessionStorage.getItem("signedIn") ? sessionStorage.getItem("signedIn") === "true" : false);
    const signinUsername = sessionStorage.getItem('signinUsername');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSignout = () => {
        localStorage.setItem('signinUsername', '');
        setSignedIn(false);
        sessionStorage.removeItem('signedIn');
        sessionStorage.removeItem('signinUsername');
    }

    const handleSearch = (event) => {
        event.preventDefault();

        if (searchQuery) {
            const results = recipes.filter(recipe => {
                const name = recipe.name.toLowerCase();
                const query = searchQuery.toLowerCase();
                return name.includes(query);
            });

            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }

    return (
        <Navbar expand="lg">
            <Navbar.Brand id="topheading" href="/">
                My Recipe App
            </Navbar.Brand>
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
                                    <NavLink to="/Userpage" className="nav-link">
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
                            <Form onSubmit={handleSearch}>
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
                        </div>
                    </section>
                    <section className="loggedIn">
                        {signedIn && (
                            <>
                                Signed in as&nbsp;<b>{signinUsername}</b>
                                <Button
                                    variant="outline-success"
                                    type="Signout"
                                    onClick={handleSignout}
                                    className="loggedInButton"
                                >
                                    Sign out
                                </Button>
                            </>
                        )}
                    </section>
                    <section>
                        <div className="search-container">
                            {searchResults.length > 0 && (
                                <div className="search-results">
                                    {searchResults.map((recipe, index) => (
                                        <div key={index} className="search-result">
                                            <Link to={`/recipe/${recipe.id}`}>
                                                <img src={recipe.image} alt={recipe.name} />
                                            </Link>
                                            <p>{recipe.name}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Header;