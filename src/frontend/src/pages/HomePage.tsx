import React from 'react';
import { User, Calendar, UserPlus} from 'lucide-react';
import { Link } from 'react-router-dom'; // <-- IMPORTAÇÃO NOVA (O "Motor" de navegação)
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      
      {/* 1. HEADER */}
      <header className="site-header">
        <div className="logo-container">
          <div className="logo-circle">
            <img src="https://cdn.discordapp.com/attachments/1212044201747816518/1496523823208599603/Gemini_Generated_Image_sebx2ssebx2ssebx.png?ex=69ea31eb&is=69e8e06b&hm=e86093c99b49fbbe0b718a5942cb18caa1e6e79fdf19253b2e252c75d225bb2e" alt="auau"/>
          </div>
        </div>
        <h1 className="header-title">Home Page</h1>
        
        {/* --- BOTÃO INICIAR SESSÃO NO TOPO --- */}
        <Link to="/login" className="header-login" style={{ textDecoration: 'none', color: 'inherit' }}>
          <User size={24} color="#1A1A1A" />
          <span>Iniciar Sessão</span>
        </Link>
      </header>

      {/* 2. SECÇÃO HERO */}
      <section className="hero-section">
        <h2 className="hero-slogan">Somos de todos os cães para todos os cães</h2>
        <div className="hero-gallery">
          <img src="https://images.unsplash.com/photo-1537151608804-ea6f23c3d56a?w=400&q=80" alt="São Bernardo" />
          <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80" alt="Cão com chapéu" />
          <img src="https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=400&q=80" alt="Shih Tzu" />
          <img src="https://images.unsplash.com/photo-1546975490-e8b92a360b24?w=400&q=80" alt="Cães abraçados" />
        </div>
      </section>

      {/* 3. SECÇÃO SERVIÇOS */}
      <section className="services-section">
        <h2 className="section-title">Tudo o que oferecemos</h2>
        <div className="services-grid">
          <div className="service-item">
            <img src="https://images.unsplash.com/photo-1628009368231-7bb7cbcb8127?w=400&q=80" alt="Veterinário" />
            <p>Veterinário</p>
          </div>
          <div className="service-item">
            <img src="https://images.unsplash.com/photo-1516734212448-1dd58be2cb56?w=400&q=80" alt="Banhos" />
            <p>Banhos</p>
          </div>
          <div className="service-item">
            <img src="https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400&q=80" alt="Tosquia" />
            <p>Tosquia</p>
          </div>
          <div className="service-item">
            <img src="https://images.unsplash.com/photo-1522276498395-f4f68f718455?w=400&q=80" alt="Passeios" />
            <p>Passeios</p>
          </div>
        </div>
      </section>

      {/* 4. SECÇÃO OPERAÇÕES */}
      <section className="operations-section">
        <h2 className="section-title">Operações</h2>
        <div className="operations-grid">
          
          <div className="operation-card">
            <h3>Marcação e Reserva</h3>
            <div className="op-icon-wrapper">
              <Calendar size={48} color="#1A1A1A" />
            </div>
          </div>
          
          {/* --- BOTÃO LOGIN NO CENTRO --- */}
          <Link to="/login" className="operation-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3>Login</h3>
            <div className="op-icon-wrapper">
              <User size={48} color="#1A1A1A" />
            </div>
          </Link>
          
          {/* --- BOTÃO CRIAR CONTA NO CENTRO --- */}
          <Link to="/criar-conta" className="operation-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3>Criar Conta</h3>
            <div className="op-icon-wrapper">
              <UserPlus size={48} color="#1A1A1A" />
            </div>
          </Link>

        </div>
      </section>

      {/* 5. FOOTER */}
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
            {/* Ícones de redes sociais podem ser adicionados aqui */}
            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" className="social-icon" />
            <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" className="social-icon" />
            <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" className="social-icon" />
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;