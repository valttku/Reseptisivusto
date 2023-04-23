import React from 'react';
import './footer.css'

function Footer() {
    return (
        <footer>
            <p>Tuuli Kivisaari, Valtteri Kuitula, Jhon Rastrojo</p>
            <p>Copyright © {new Date().getFullYear()}</p>
        </footer>
    );
}

export default Footer;