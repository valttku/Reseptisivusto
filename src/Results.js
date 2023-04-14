import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

function Results({ searchResults }) {
    return (
        <Container>
            {searchResults.map((result) => (
                <Row key={result.id}>
                    <Col>
                        <h1>{result.name}</h1>
                        <p>{result.description}</p>
                        <Image src={result.image} alt={result.description} fluid />
                    </Col>
                </Row>
            ))}
        </Container>
    );
}

export default Results;
