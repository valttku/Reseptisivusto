import React, {useState} from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import userDetails from './userDetails.json';
import axios from 'axios';
import Header from "./Header";



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
            username: signinUsername,
            password: signinPassword
        };

        axios.post('/SignIn', formData)
            .then((response) => {
                alert(response.data.message);
                setSigninUsername('');
                setSigninPassword('');
            })
            .catch((error) => {
                alert(error.response.data.message);
            });

        // Add user to userDetails array
        userDetails.push(formData);

        // Save updated userDetails to localStorage
        localStorage.setItem('userDetails', JSON.stringify(userDetails));

        // Show success message
        alert('User registered successfully');

        // Reset form fields
        setRegisterUsername('');
        setRegisterEmail('');
        setRegisterPassword('');
    };

    return (
        <main className="Signin">
            <Header/>
            <body className="Signinbody">
            <Row>
                <Col>
                    <h1>Sign in</h1>
                    <Form onSubmit={handleSigninSubmit} className = "SigninForm">
                        <Form.Group controlId="formSigninUsername" className="form-row">
                            <Form.Label className = "signinlabel" column sm={2}>Username</Form.Label>
                            <Col sm={10}>
                                <Form.Control
                                    className = "control"
                                    type="text"
                                    placeholder="Enter username"
                                    value={signinUsername}
                                    onChange={(event) => setSigninUsername(event.target.value)}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group controlId="formSigninPassword" className="form-row">
                            <Form.Label className = "signinlabel"  column sm={2}>Password</Form.Label>
                            <Col sm={10}>
                                <Form.Control
                                    className = "control"
                                    type="password"
                                    placeholder="Password"
                                    value={signinPassword}
                                    onChange={(event) => setSigninPassword(event.target.value)}
                                />
                            </Col>
                        </Form.Group>

                        <div className="form-row-last">
                            <button variant="primary" type="submit">Submit</button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h3>If you are signing in for the first time, then please register a new account first:</h3>
                    <h1>Register</h1>
                    <Form onSubmit={handleRegisterSubmit} className="registerForm">
                        <Form.Group controlId="formRegisterUsername" className="form-row">
                            <Form.Label className = "registerlabel" column sm={2}>Username</Form.Label>
                            <Col sm={10}>
                                <Form.Control
                                    className = "control"
                                    type="text"
                                    placeholder="Enter username"
                                    value={registerUsername}
                                    onChange={(event) => setRegisterUsername(event.target.value)}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="form-row">
                            <Form.Label className = "registerlabel" column sm={2}>Email address</Form.Label>
                            <Col sm={10}>
                                <Form.Control
                                    className = "control"
                                    type="email"
                                    placeholder="Enter email"
                                    value={registerEmail}
                                    onChange={(event) => setRegisterEmail(event.target.value)}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group controlId="formPassword" className="form-row">
                            <Form.Label className = "registerlabel" column sm={2}>Password</Form.Label>
                            <Col sm={10}>
                                <Form.Control
                                    className = "control"
                                    type="password"
                                    placeholder="Password"
                                    value={registerPassword}
                                    onChange={(event) => setRegisterPassword(event.target.value)}
                                />
                            </Col>
                        </Form.Group>

                        <div className="form-row-last">
                            <button variant="primary" type="submit">Submit</button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </body>
        </main>
    );
}

export default SignIn;
