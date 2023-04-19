import {useState} from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import userDetails from './userDetails.json';
import axios from 'axios';

function SignIn() {
    // Sign in form state
    const [signinUsername, setSigninUsername] = useState('');
    const [signinPassword, setSigninPassword] = useState('');

    // Register form state
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');

    // Sign in form submit handler
    const handleSigninSubmit = (event) => {
        event.preventDefault();

        // Find user by username and password
        const userExists = userDetails.find((user) => {
            return user.userName === signinUsername && user.password === signinPassword;
        });

        // Show error if user not found
        if (!userExists) {
            alert('Error in username or password');
            return;
        }

        // Show welcome message if user found
        alert('Welcome ' + signinUsername);

        // Reset form fields
        setSigninUsername('');
        setSigninPassword('');
    };

    // Register form submit handler
    const handleRegisterSubmit = (event) => {
        event.preventDefault();

        // Check if user already exists
        const userExists = userDetails.find((user) => {
            return user.userName === registerUsername || user.email === registerEmail;
        });

        // Show error if user already exists
        if (userExists) {
            alert('Username or email already in use');
            return;
        }

        const formData = {
            username: registerUsername,
            email: registerEmail,
            password: registerPassword,
        };

        axios
            .post('/SignIn', formData) //Tästä se errori tulee, POST url takia tulee selaimessa 404 errori eli ei löydä sitä.
            .then((response) => {
                alert(response.data);
                setRegisterUsername('');
                setRegisterEmail('');
                setRegisterPassword('');
            })
            .catch((error) => {
                alert('Error registering user');
                console.log(error);
            });
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h1>Sign in</h1>
                    <Form onSubmit={handleSigninSubmit}>
                        <Form.Group controlId="formSigninUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={signinUsername}
                                onChange={(event) => setSigninUsername(event.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formSigninPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={signinPassword}
                                onChange={(event) => setSigninPassword(event.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h3>If you are signing in for the first time, then please register a new account first:</h3>
                    <h1>Register</h1>
                    <Form onSubmit={handleRegisterSubmit}>
                        <Form.Group controlId="formRegisterUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={registerUsername}
                                onChange={(event) => setRegisterUsername(event.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={registerEmail}
                                onChange={(event) => setRegisterEmail(event.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={registerPassword}
                                onChange={(event) => setRegisterPassword(event.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default SignIn;
