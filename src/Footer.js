import React from 'react';
import './footer.css'

/**
 * Renderöi projektin Footer-komponentin, josta löytyy projektin tekijät sekä nykyinen vuosi.
 * @returns {JSX.Element} Footer-komponentti
 */
function Footer() {
    return (
        <footer>
            <p>Tuuli Kivisaari, Valtteri Kuitula, Jhon Rastrojo</p>
            <p>Copyright © {new Date().getFullYear()}</p>
        </footer>
    );
}

export default Footer;