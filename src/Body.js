import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import recipeData from './recipes.json';

function Body() {
    const [recipe1, setRecipe1] = useState(null);
    const [recipe2, setRecipe2] = useState(null);

    useEffect(() => {
        let randomIndex1 = Math.floor(Math.random() * recipeData.length);
        let randomIndex2 = Math.floor(Math.random() * recipeData.length);
        while (randomIndex2 === randomIndex1) {
            randomIndex2 = Math.floor(Math.random() * recipeData.length);
        }
        setRecipe1(recipeData[randomIndex1]);
        setRecipe2(recipeData[randomIndex2]);
    }, []);

    return (
        <Container>
            <Row>
                <Col>
                    <h1>Heading 1</h1>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis posuere blandit risus, sed pellentesque odio vulputate id. Aliquam suscipit scelerisque diam vel facilisis. Nam sed justo mi. Sed posuere risus ac mauris vehicula efficitur. Proin convallis nisi vel congue molestie. Vivamus id libero in mi interdum mollis. In blandit sapien vel posuere euismod. Suspendisse potenti. Aenean ac ante sed quam euismod posuere a vel massa.
                    </p>
                    {recipe1 && (
                        <div className="imageHolder">
                            <Image
                                src={recipe1.image}
                                alt={recipe1.name}
                                fluid
                                className="cropped-image"
                            />
                            <p>{recipe1.name}</p>
                        </div>
                    )}
                    {recipe2 && (
                        <div className="imageHolder">
                            <Image
                                src={recipe2.image}
                                alt={recipe2.name}
                                fluid
                                className="cropped-image"
                            />
                            <p>{recipe2.name}</p>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default Body;

