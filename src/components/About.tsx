import { useState } from 'react';
import { IconInfoCircle, IconShoppingCart } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import '../styles/About.css';

function About() {
  const [isEmailVisible, setIsEmailVisible] = useState(false);

  function showEmailInformation() {
    setIsEmailVisible(true);
  }

  function hideEmailInformation() {
    setIsEmailVisible(false);
  }

  return (
    <main className="about">
      <section className="about-hero">
        <h1>🖥️ Computer Gadget Store <IconInfoCircle size={32} color="#F7B32B" style={{verticalAlign: 'middle', marginLeft: 8}} /></h1>
        <p className="subtitle">Your trusted destination for premium computer technology</p>
        <Link to="/cart" style={{ textDecoration: 'none' }}>
          <button
            type="button"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '1rem', display: 'flex', alignItems: 'center' }}
            aria-label="Go to cart"
          >
            <IconShoppingCart size={28} color="#4F8EF7" style={{marginRight: 8}} />
            <span style={{color: '#4F8EF7', fontWeight: 'bold', fontSize: '1rem'}}>Cart</span>
          </button>
        </Link>
      </section>

      <section className="about-content">
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            At Computer Gadgets Store, we are dedicated to providing our customers with the highest quality computer products and accessories. Our mission is to make cutting-edge technology accessible to everyone, from casual users to professional enthusiasts.
          </p>
        </div>

        <div className="about-section">
          <h2>Why Choose Us?</h2>
          <ul className="features-list">
            <li>✓ Curated selection of premium computer gadgets</li>
            <li>✓ Competitive pricing with regular discounts</li>
            <li>✓ Expert customer support team</li>
            <li>✓ Fast and reliable shipping</li>
            <li>✓ Easy returns and exchanges</li>
            <li>✓ Warranty on all products</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>Our Story</h2>
          <p>
            Founded in 2024, Computer Gadgets Store started with a simple vision: to create a platform where tech enthusiasts can discover and purchase the latest computer products. What began as a small venture has grown into a trusted online store serving thousands of customers worldwide.
          </p>
          <p>
            We believe in quality, reliability, and customer satisfaction. Every product in our catalog is carefully selected to ensure it meets our high standards. Our team works tirelessly to bring you the best deals on the latest technology.
          </p>
        </div>

        <div className="about-section">
          <h2>Contact Information</h2>
          <div className="contact-info">
            <p>
              <strong>Business address</strong>
              <br />
              1234 Tech Avenue, Suite 100
              <br />
              San Diego, CA 92101
            </p>
            <p>
              <strong>Phone</strong>
              <br />
              <a href="tel:+15551234567">(555) 123-4567</a>
            </p>
            <p>
              <strong>Email</strong>
              <br />
              <span
                style={{ fontFamily: 'Lucida Handwriting', cursor: 'pointer' }}
                onMouseEnter={showEmailInformation}
                onMouseLeave={hideEmailInformation}
              >
                {isEmailVisible ? 'dallas8000@gmail.com' : 'Hover here to show my email'}
              </span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
