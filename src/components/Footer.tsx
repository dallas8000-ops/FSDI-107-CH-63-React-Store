import React from 'react';
import '../styles/Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <section>
        <h3>Computer Gadgets</h3>
        <p>High-quality PC accessories at great prices.</p>
      </section>

      <section>
        <h4>Quick links</h4>
        <ul>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">Shipping</a></li>
        </ul>
      </section>

      <section>
        <h4>Follow us</h4>
        <div className="social">
          <a href="#">FB</a>
          <a href="#">TW</a>
          <a href="#">IG</a>
        </div>
      </section>
    </div>

    <div className="footer-bottom">
      © 2025 Computer Gadgets
    </div>
  </footer>
);

export default Footer;