import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import recipeData from './recipes.json';

function Body() {
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * recipeData.length);
        const randomRecipe = recipeData[randomIndex];
        setRecipe(randomRecipe);
    }, []);

    return (
        <Container>
            <Row>
                <Col>
                    <h1>Heading 1</h1>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis posuere blandit risus, sed pellentesque odio vulputate id. Aliquam suscipit scelerisque diam vel facilisis. Nam sed justo mi. Sed posuere risus ac mauris vehicula efficitur. Proin convallis nisi vel congue molestie. Vivamus id libero in mi interdum mollis. In blandit sapien vel posuere euismod. Suspendisse potenti. Aenean ac ante sed quam euismod posuere a vel massa.
                    </p>
                    {recipe && (
                        <>
                            <Image src={recipe.image} alt={recipe.name} fluid />
                            <p>{recipe.description}</p>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default Body;
