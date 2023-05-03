import React, {useState, useEffect} from "react";
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import userDetails from './userDetails.json';
import axios from 'axios';
import Header from "./Header";
import Footer from "./Footer"
import 'bootstrap/dist/css/bootstrap.min.css';
import {useNavigate} from 'react-router-dom';
import './signIn.css'

/**
 * Funktio SignIn, joka renderöi kirjautumissivun.
 * @returns {JSX.Element} Kirjautumissivun komponentti.
 */
function SignIn() {

    /**
     * Kirjautumisessa käytetty käyttäjänimi
     * @type {[string, function]}
     */
    const [signinUsername, setSigninUsername] = useState('');
    /**
     * Kirjautumisessa käytetty salasana
     * @type {[string, function]}
     */
    const [signinPassword, setSigninPassword] = useState('');
    /**
     * Rekisteröinnissä käytetty uusi käyttäjänimi
     * @type {[string, function]}
     */
    const [registerUsername, setRegisterUsername] = useState('');
    /**
     * Rekisteröinnissä käytetty uusi email-osoite
     * @type {[string, function]}
     */
    const [registerEmail, setRegisterEmail] = useState('');
    /**
     * Rekisteröinnissä käytetty uusi salasana
     * @type {[string, function]}
     */
    const [registerPassword, setRegisterPassword] = useState('');
    /**
     * Rekisteröinnin vastausdatan asettaminen
     * @type {[string, function]}
     */
    const [post, setPost] = React.useState(null);
    /**
     * Kertoo onko käyttäjä kirjautuneena sisään vai ei
     * @type {[boolean, function]}
     */
    const [signedIn, setSignedIn] = useState(sessionStorage.getItem("signedIn") ? sessionStorage.getItem("signedIn") === "true" : false);
    /**
     * Reitittimen navigointiobjekti, jolla voidaan muuttaa URL-osoite.
     * @type {function}
     */
    const navigate = useNavigate();
    /**
     * Kertoo onko käyttäjä valinnut näytettäväksi myös rekisteröintilomakkeen vai ei.
     * @type {[boolean, function]}
     */
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    /**
     * Rekisteröinnissä käytetty salasana annettuna uudelleen
     * @type {[string, function]}
     */
    const [confirmPassword, setConfirmPassword] = useState('');

// Sign in form submit handler
    /**
     * Funktio joka käsittelee sisäänkirjautumislomakkeen lähetyksen kun käyttäjä valitsee "sign in"-nappulan.
     * @param {Object} event - Tapahtumankäsittelijä
     */
    const handleSigninSubmit = (event) => {
        event.preventDefault();
        console.log(userDetails);

        /**
         * Katsotaan löytyykö käyttäjän antama kirjautumisnimi kirjautumistiedoista. Jos löytyy palautetaan true, muuten false
         */
        const userExists = userDetails.find((user) => {
            return user.username === signinUsername && user.password === signinPassword;
        });

        // Näytetään virheviesti jos käyttäjää ei löydy
        if (!userExists) {
            alert('Error in username or password');
            return;
        }

        // Näytetään tervetuloviesti jos käyttäjänimi ja salasana täsmäävät
        alert('Welcome ' + signinUsername);
        setSignedIn(true);
        //asetetaan sessionStorageen tieto siitä, että käyttäjä on kirjautunut ja kerrotaan sessionStoragelle mikä käyttäjänimi on kirjautuneena
        sessionStorage.setItem("signedIn", JSON.stringify(true));
        sessionStorage.setItem('signinUsername', signinUsername);

        // Tyhjennetään signin-formin kentät
        setSigninUsername('');
        setSigninPassword('');
        //navigoidaan kotisivulle
        navigate('/');
    };
    /**
     * Funktio, joka käsittelee lomakkeen lähetyksen rekisteröintilomakkeella.
     * @param {Event} event Lomakkeen lähetyksestä aiheutuva tapahtuma.
     */
// Register form submit handler
    /**
     * Funktio käsittelee rekisteröintilomakkeen lähetyksen kun käyttäjä on täyttänyt rekisteröintitiedot ja valitsee submit.
     * @param event -Tapahtumankäsittelijä
     */
    const handleRegisterSubmit = (event) => {
        event.preventDefault();

        /**
         * Tarkistetaan löytyykö käyttäjänimi tai e-mail jo käyttäjätiedostoista
         */
        const userExists = userDetails.find((user) => {
            return user.username === registerUsername || user.email === registerEmail;
        });

        /**
         * Tarkastetaan täsmäävätkö annettu salasana ja vahvistussalasana
         * @returns {boolean}
         */
        const unmatchedPassword = () => {
            return confirmPassword === registerPassword;

        }
        //jos salasanat eivät vastaa toisiaan näytetään virheviesti
        if (!unmatchedPassword()) {
            alert("Passwords do not match!");
            return;
        }
        //jos käyttäjänimi on liian lyhyt, näytetään virheviesti
        if (registerUsername.length < 4) {
            alert('Username must have at least 4 characters.');
            return;
        }
        //jos salasana on liian lyhyt, näytetään virheviesti
        if (registerPassword.length < 8) {
            alert('Username must have at least 8 characters.');
            return;
        }

        // Jos käyttäjänimi tai e-mail on rekisteröity jo aiemmin, näytetään virheviesti
        if (userExists) {
            alert('Username or email already in use');
            return;
        }

        /**
         * Muuttujassa on tallessa käyttäjän antamat tiedot
         * @type {{password: string, email: string, username: string}}
         */
        const formData = {
            username: registerUsername,
            email: registerEmail,
            password: registerPassword,
        };
        const form = event.target;

        const users = require("./userDetails.json");
        users.push(formData);

        //Lähetetään serverille tiedot rekisteröitävistä käyttäjätiedoista
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
        setSigninUsername(registerUsername);
        setSigninPassword(registerPassword);
        alert("You are now registered and all set to sign in. Click \"Sign in\" to enter.");

    };

    /**
     * Funktio on tapahtumankäsittelijä rekisteröintilomakkeelle
     */
    function handleRegistrationClick() {
        setShowRegistrationForm(prevState => !prevState);
        const registrationButton = document.getElementById("openregistration");
        if (registrationButton.classList.contains("active")) {
            registrationButton.classList.remove("active");
        } else {
            registrationButton.classList.add("active");
        }
    }
//Sivun sisältö ilman että rekisteröintilomaketta on avattu:
    if (!showRegistrationForm) {
        return (
            <Container fluid className="Signin px-0">
                <Header signedIn={signedIn}/>
                <Container className="Signinbody">
                    <Row>
                        <Col>
                            <h1>Sign in</h1>
                            <Form onSubmit={handleSigninSubmit}>
                                <Form.Group controlId="formSigninUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your username"
                                        value={signinUsername}
                                        onChange={(event) => setSigninUsername(event.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formSigninPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter your password"
                                        value={signinPassword}
                                        onChange={(event) => setSigninPassword(event.target.value)}
                                    />
                                </Form.Group>
                                <div className="buttons">
                                    <Button variant="primary" type="submit" className="button" id="signinbutton">
                                        Sign in
                                    </Button>
                                    <Button variant="secondary" type="button" id="openregistration"
                                            onClick={handleRegistrationClick}>Open registration
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </Container>
        );
    } //Sivun sisältö niin että myös rekisteröintilomake on avoinna
    else {
        return (
            <Container fluid className="Signin px-0">
                <Header signedIn={signedIn}/>
                <Container className="Signinbody">
                    <Row>
                        <Col>
                            <h1>Sign in</h1>
                            <Form onSubmit={handleSigninSubmit}>
                                <Form.Group controlId="formSigninUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your username"
                                        value={signinUsername}
                                        onChange={(event) => setSigninUsername(event.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formSigninPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter your password"
                                        value={signinPassword}
                                        onChange={(event) => setSigninPassword(event.target.value)}
                                    />
                                </Form.Group>
                                <div className="buttons">
                                    <Button variant="primary" type="submit" id="signinbutton">Sign in</Button>
                                    <Button variant="secondary" type="button" id="openregistration"
                                            onClick={handleRegistrationClick}>Open registration
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h1>Register</h1>
                            <Form method="post" onSubmit={handleRegisterSubmit} autocomplete="off">
                                <Form.Group controlId="formRegisterUsername">
                                    <Form.Label>Username (min. 4 characters)</Form.Label>
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
                                        placeholder="Enter password"
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
                                <div className="buttons">
                                    <Button variant="primary" type="submit" id="registerbutton">Submit</Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </Container>
        );
    }
}

export default SignIn;
