import React, { useState } from 'react';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import recipeData from './recipes.json';
import { Link } from 'react-router-dom';

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
                <section id={"navigate"}>
                    <Nav className="mr-auto">
                        <ul>
                            <li><Link to="/">Page1</Link></li>
                            <li><Link to="/">Page2</Link></li>
                            <li><Link to="/">Page3</Link></li>
                            <li><Link to="/SignIn">SignIn</Link></li>
                        </ul>
                    </Nav>
                    <Form inline="true" onSubmit={handleSearch}>
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            className="mr-sm-2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button variant="outline-success" type="submit" inline="true">
                            Search
                        </Button>
                    </Form>
                </section>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Header;