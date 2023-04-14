import React, { useState } from 'react';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import recipeData from './recipes.json';

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
                    <Nav.Link href="#page1">Page 1</Nav.Link>
                    <Nav.Link href="#page2">Page 2</Nav.Link>
                    <Nav.Link href="#page3">Page 3</Nav.Link>
                    <Nav.Link href="#page4">Page 4</Nav.Link>
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
