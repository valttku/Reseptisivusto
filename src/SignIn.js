import React, {useState, useEffect} from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import userDetails from './userDetails.json';
import axios from 'axios';
import Header from "./Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';


function SignIn() {
    // Sign in form state
    const [signinUsername, setSigninUsername] = useState('');
    const [signinPassword, setSigninPassword] = useState('');


    // Register form state
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [post, setPost]= React.useState(null);
    const [signedIn, setSignedIn] = useState(sessionStorage.getItem("signedIn") ? sessionStorage.getItem("signedIn") === "true" : false);
    const navigate = useNavigate();
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [confirmPassword,setConfirmPassword] = useState('');
    //console.log(`Kirjautuneena sisään as ${signinUsername}`);

    // Sign in form submit handler
    const handleSigninSubmit = (event) => {
        event.preventDefault();
        console.log(userDetails);
        // Find user by username and password
        const userExists = userDetails.find((user) => {
            return user.username === signinUsername && user.password === signinPassword;
        });

        // Show error if user not found
        if (!userExists) {
            alert('Error in username or password');
            return;
        }

        // Show welcome message if user found
        alert('Welcome ' + signinUsername);
        setSignedIn(true);

        sessionStorage.setItem("signedIn", JSON.stringify(true));
        sessionStorage.setItem('signinUsername', signinUsername);

        // Redirect to homepage


        // Reset form fields
        setSigninUsername('');
        setSigninPassword('');
        navigate('/');
    };

    // Register form submit handler
    const handleRegisterSubmit = (event) => {
        event.preventDefault();

        // Check if user already exists
        const userExists = userDetails.find((user) => {
            return user.username === registerUsername || user.email === registerEmail;
        });

        const unmatchedPassword = () => {
            return confirmPassword === registerPassword;

        }

        if (!unmatchedPassword()){
            alert("Passwords do not match!");
            return;
        }

        if (registerUsername.length < 4 ) {
            alert('Username must have at least 4 characters.');
            return;
        }

        if (registerPassword.length < 8 ) {
            alert('Username must have at least 8 characters.');
            return;
        }

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
        const form = event.target;
        //Testing
        console.log("Tässä uusi käyttäjä: " + JSON.stringify(formData));
        const users = require("./userDetails.json");
        console.log("Tässä kaikki käyttäjät:");
        console.dir(users);
        users.push(formData);
        console.log("Tässä kaikki käyttäjät uudelleen:");
        console.dir(users);

//.
        //fetch('/signin', { method: form.method, body: formData });
        axios
            .post('http://localhost:3001/signin', formData)
            .then((response) => {
                setPost(response.data);
                setRegisterUsername('');
                setRegisterEmail('');
                setRegisterPassword('');
                setConfirmPassword('');
            })
            .catch((error) => {
                alert('Error registering user');
                console.log(error);
            });
    };

    function handleRegistrationClick() {
        if(!showRegistrationForm){
        setShowRegistrationForm(true);}
        else{
            setShowRegistrationForm(false);
        }
    }

if(!showRegistrationForm){
    return (
        <Container fluid className="Signin px-0">
            <Header signedIn={signedIn} />
            <Container className="Signinbody">
                <Row>
                    <Col>
                        <h1>Sign in</h1>
                        <Form onSubmit={handleSigninSubmit}>
                            <Form.Group controlId="formSigninUsername">
                                <Form.Label>Username (min 4 characters)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    value={signinUsername}
                                    onChange={(event) => setSigninUsername(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formSigninPassword">
                                <Form.Label>Password (min. 8 characters)</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={signinPassword}
                                    onChange={(event) => setSigninPassword(event.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" id="signinbutton">Sign in</Button>
                            <p>If you are a first time user, register first:</p>
                            <Button variant="secondary" type="button" id="openregistration" onClick={handleRegistrationClick}>Open registration</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </Container>
    );} else{

    return(
        <Container fluid className="Signin px-0">
            <Header signedIn={signedIn} />
            <Container className="Signinbody">
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
                            <Button variant="primary" type="submit" id="signinbutton">Sign in</Button>
                            <p>If you are a first time user, register first:</p>
                            <Button variant="secondary" type="button" id="openregistration" onClick={handleRegistrationClick}>Open registration</Button>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1>Register</h1>
                        <Form method="post" onSubmit={handleRegisterSubmit} autocomplete="off">
                            <Form.Group controlId="formRegisterUsername">
                                <Form.Label>Username (min 4 characters)</Form.Label>
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
                                <Form.Label>Password (min. 8 characters)</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={registerPassword}
                                    onChange={(event) => setRegisterPassword(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="confirmFormPassword">
                                <Form.Label>Confirm password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" id="registerbutton">Submit</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}

        }


export default SignIn;
