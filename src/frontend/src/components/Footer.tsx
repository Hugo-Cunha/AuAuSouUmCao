import React from 'react';
import { Link } from 'react-router-dom';
import './Shared.css';

const Footer: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    // Se não estamos na homepage, redireciona primeiro
    if (window.location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
    } else {
      // Se já estamos na homepage, faz scroll suave
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-columns">
        <div className="footer-col">
          <h4>Conheça-nos</h4>
          <ul>
            <li><a onClick={() => scrollToSection('sobre-nos')} style={{ cursor: 'pointer', color: 'inherit' }}>Sobre Nós</a></li>
            <li><a onClick={() => scrollToSection('opinoes')} style={{ cursor: 'pointer', color: 'inherit' }}>Opiniões de Clientes</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Serviços</h4>
          <ul>
            <li><Link to="/">O nosso Hotel</Link></li>
            <li><a onClick={() => scrollToSection('contactos')} style={{ cursor: 'pointer', color: 'inherit' }}>Clínica Veterinária</a></li>
            <li><a onClick={() => scrollToSection('contactos')} style={{ cursor: 'pointer', color: 'inherit' }}>Rações Premium</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Ajuda</h4>
          <ul>
            <li><a onClick={() => scrollToSection('contactos')} style={{ cursor: 'pointer', color: 'inherit' }}>Contacte-nos</a></li>
            <li>Perguntas Frequentes</li>
            <li><Link to="/tutor">Fazer Reservas</Link></li>
          </ul>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <span className="footer-brand">Au Au sou um Cão!</span>
        <div className="social-icons">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" className="social-icon" />
          <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" className="social-icon" />
          <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" className="social-icon" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;