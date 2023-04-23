import React, { useState } from 'react';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import recipeData from './recipes.json';
import { NavLink } from 'react-router-dom';
import './navbar.css'

function Header(props) {
    const [signedIn, setSignedIn] = useState(sessionStorage.getItem("signedIn") ? sessionStorage.getItem("signedIn") === "true" : false);
    const signinUsername = sessionStorage.getItem('signinUsername');
    const userName = JSON.parse(sessionStorage.getItem("signedIn"));
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    console.log(signedIn);
    console.log(signinUsername);

    const handleSearch = (e) => {
        e.preventDefault();
        // Filter recipes based on the search query
        const filteredResults = recipeData.filter((recipe) => {
            const name = recipe.name || '';
            return name.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setSearchResults(filteredResults);
        props.setSearchResults(filteredResults);
    };

    const handleSignout = () => {
        localStorage.setItem('signinUsername', '');
        setSignedIn(false);
        sessionStorage.removeItem('signedIn');
        sessionStorage.removeItem('signinUsername');
    }

    return (
        <Navbar expand="lg">
            <Navbar.Brand id="topheading" href="/">My Recipe App</Navbar.Brand>
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
                                        Your recipes
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
                            <Form inline onSubmit={handleSearch}>
                                <Form.Control
                                    type="text"
                                    placeholder="Find a recipe"
                                    className="mr-sm-2 userInput"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
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
                                <b>{signinUsername}</b>
                                <Button variant="outline-success" type="Signout" onClick={handleSignout} className="loggedInButton">
                                    Sign out
                                </Button>
                            </>
                        )}
                    </section>
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Header;