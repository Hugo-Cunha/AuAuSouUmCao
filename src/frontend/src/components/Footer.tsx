import React from 'react';
import './Shared.css';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-columns">
        <div className="footer-col">
          <h4>Conheça-nos</h4>
          <ul>
            <li>Quem Somos</li>
            <li>Opiniões de Clientes</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Serviços</h4>
          <ul>
            <li>O nosso Hotel</li>
            <li>Clínica Veterinária</li>
            <li>Site de rações</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Ajuda</h4>
          <ul>
            <li>Contacte-nos</li>
            <li>Perguntas</li>
            <li>Fazer Reservas</li>
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