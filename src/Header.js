import React, { useState } from 'react';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import recipeData from './recipes.json';
import { NavLink } from 'react-router-dom';
import './navbar.css'

function Header(props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

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

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand id="topheading" href="#home">My Recipe App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <section id="navigate">
                    <NavLink to="/NewRecipe" className="nav-link">
                        Add new recipe
                    </NavLink>
                    <NavLink to="/SignIn" className="nav-link">
                        Sign In
                    </NavLink>
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
                </section>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Header;