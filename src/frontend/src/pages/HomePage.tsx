import React from 'react';
import { User, Calendar, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      {/* HEADER PARTILHADO */}
      <Header title="Home Page" />

      {/* SECÇÃO HERO */}
      <section className="hero-section">
        <h2 className="hero-slogan">Somos de todos os cães para todos os cães</h2>
        <div className="hero-gallery">
          <img src="https://images.unsplash.com/photo-1537151608804-ea6f23c3d56a?w=400&q=80" alt="São Bernardo" />
          <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80" alt="Cão com chapéu" />
          <img src="https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=400&q=80" alt="Shih Tzu" />
          <img src="https://images.unsplash.com/photo-1546975490-e8b92a360b24?w=400&q=80" alt="Cães abraçados" />
        </div>
      </section>

      {/* SECÇÃO SERVIÇOS */}
      <section className="services-section">
        <h2 className="section-title">Tudo o que oferecemos</h2>
        <div className="services-grid">
          <div className="service-item"><img src="https://images.unsplash.com/photo-1628009368231-7bb7cbcb8127?w=400&q=80" alt="Veterinário" /><p>Veterinário</p></div>
          <div className="service-item"><img src="https://images.unsplash.com/photo-1516734212448-1dd58be2cb56?w=400&q=80" alt="Banhos" /><p>Banhos</p></div>
          <div className="service-item"><img src="https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400&q=80" alt="Tosquia" /><p>Tosquia</p></div>
          <div className="service-item"><img src="https://images.unsplash.com/photo-1522276498395-f4f68f718455?w=400&q=80" alt="Passeios" /><p>Passeios</p></div>
        </div>
      </section>

      {/* SECÇÃO OPERAÇÕES */}
      <section className="operations-section">
        <h2 className="section-title">Operações</h2>
        <div className="operations-grid">
          <div className="operation-card">
            <h3>Marcação e Reserva</h3>
            <div className="op-icon-wrapper"><Calendar size={48} color="#1A1A1A" /></div>
          </div>
          <Link to="/login" className="operation-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3>Login</h3>
            <div className="op-icon-wrapper"><User size={48} color="#1A1A1A" /></div>
          </Link>
          <Link to="/criar-conta" className="operation-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3>Criar Conta</h3>
            <div className="op-icon-wrapper"><UserPlus size={48} color="#1A1A1A" /></div>
          </Link>
        </div>
      </section>

      {/* FOOTER PARTILHADO */}
      <Footer />
    </div>
  );
};

export default HomePage;