import React from 'react';
import { User, UserPlus } from 'lucide-react';
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
          <img src="https://evidensia.pt/getmedia/a45da972-934e-41f3-99c1-d49fdcebae59/Sao-Bernardo-perfil.webp" alt="São Bernardo" />
          <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80" alt="Cão com chapéu" />
          <img src="https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=400&q=80" alt="Shih Tzu" />
          <img src="https://images.unsplash.com/photo-1546975490-e8b92a360b24?w=400&q=80" alt="Cães abraçados" />
        </div>
      </section>

      {/* SECÇÃO SERVIÇOS */}
      <section className="services-section">
        <h2 className="section-title">Tudo o que oferecemos</h2>
        <div className="services-grid">
          <div className="service-item"><img src="https://media.rtp.pt/anossatarde/wp-content/uploads/sites/158/2024/06/08-cao-e-gato-com-veterinario-860x507.jpg" alt="Veterinário" /><p>Veterinário</p></div>
          <div className="service-item"><img src="https://www.zooplus.pt/magazine/wp-content/uploads/2020/09/shampoo-para-caes.webp" alt="Banhos" /><p>Banhos</p></div>
          <div className="service-item"><img src="https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400&q=80" alt="Tosquia" /><p>Tosquia</p></div>
          <div className="service-item"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTSzIR1QFsn9_aYoX-TXLR21Cwjr7mlKavyA&s" alt="Passeios" /><p>Passeios</p></div>
        </div>
      </section>

      {/* SECÇÃO OPERAÇÕES */}
      <section className="operations-section">
        <h2 className="section-title">Operações</h2>
        <div className="operations-grid">
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
      {/* SECÇÃO SOBRE NÓS */}
      <section className="about-us-section" id="sobre-nos">
        <h2 className="section-title">Sobre Nós</h2>
        <div className="about-content">
          <div className="about-subsection">
            <h3>A Nossa História</h3>
            <p>O "Au Au... Sou um Cão!" nasceu em 2021, fundado por <strong>Diana Gonçalves Silva</strong>, estudante de Medicina Veterinária na Universidade de Trás-os-Montes e Alto Douro, durante a pandemia de COVID-19. O que começou como uma solução criativa para a falta de trabalho na área de veterinária transformou-se numa operação profissional e próspera.</p>
            <p>A visão de Diana era aliar o <strong>rigor clínico</strong> ao <strong>bem-estar animal</strong>, criando um espaço onde cada cão fosse tratado como parte da família. Com o apoio inicial do seu namorado e agora com uma equipa dedicada de profissionais, o hotel evoluiu de forma notável.</p>
          </div>
          <div className="about-subsection">
            <h3>O Nosso Compromisso</h3>
            <p>Com 30 quartos equipados e capacidade de 80 animais em períodos de pico, garantimos:</p>
            <ul className="values-list">
              <li><strong>Bem-estar Animal:</strong> Ambiente seguro, confortável e enriquecido para cada hóspede</li>
              <li><strong>Rigor Clínico:</strong> Monitorização veterinária contínua, dietas especiais e medicação controlada</li>
              <li><strong>Profissionalismo:</strong> Equipa treinada em cuidados caninos, higiene e comportamento animal</li>
              <li><strong>Transparência:</strong> Relatórios diários e comunicação contínua com os proprietários</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECÇÃO TESTEMUNHOS */}
      <section className="testimonials-section" id="opinoes">
        <h2 className="section-title">O que dizem sobre nós</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-quote">"O melhor serviço de cuidado com cães que já conheci. A equipa é muito dedicada e meu Bobby adora!"</p>
            <p className="testimonial-author">- Maria Silva</p>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-quote">"Profissionalismo de topo. Minha Bella voltou do banho impecável e muito feliz. Recomendo!"</p>
            <p className="testimonial-author">- João Costa</p>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-quote">"Serviço excepcional, preços justos e equipa atencioso. Já são 3 anos que confiamos neles."</p>
            <p className="testimonial-author">- Ana Ferreira</p>
          </div>
        </div>
      </section>

      {/* SECÇÃO LOCALIZAÇÃO, CONTACTO E ALIMENTOS */}
      <section className="location-contact-section" id="contactos">
        <h2 className="section-title">Localização, Contacto e Alimentos</h2>
        <div className="location-contact-grid">
          <div className="location-card">
            <h3>📍 Localização</h3>
            <p><strong>Endereço:</strong> Avenida do Parque, 42, 4700-123 Braga, Portugal</p>
            <p><strong>Horário:</strong> Seg-Sex: 08:00-18:00, Sáb: 09:00-13:00, Dom: Fechado</p>
            <p><strong>Estacionamento:</strong> Parque disponível no local com 50 lugares</p>
          </div>
          <div className="contact-card">
            <h3>📞 Contacto</h3>
            <p><strong>Telefone:</strong> +351 925 123 456</p>
            <p><strong>Email:</strong> info@auausouumcao.pt</p>
            <p><strong>WhatsApp:</strong> <a href="https://wa.me/351925123456" target="_blank" rel="noopener noreferrer">Enviar mensagem</a></p>
          </div>
          <div className="food-card">
            <h3>🥗 Marcas de Alimentos para Cães</h3>
            <p><strong>Royal Canin</strong> - Nutrição especializada por raça</p>
            <p><strong>Purina Pro Plan</strong> - Ótima relação qualidade-preço</p>
            <p><strong>Hill's Science Diet</strong> - Fórmulas premium e veterinárias</p>
          </div>
        </div>
      </section>

      {/* SECÇÃO FORMULÁRIO DE CONTACTO */}
      <section className="contact-form-section">
        <h2 className="section-title">Fale Connosco</h2>
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Nome *</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Assunto *</label>
            <input type="text" id="subject" name="subject" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Mensagem *</label>
            <textarea id="message" name="message" rows={6} required></textarea>
          </div>
          <button type="submit" className="form-submit-button">Enviar Mensagem</button>
        </form>
      </section>

      {/* FOOTER PARTILHADO */}
      <Footer />
    </div>
  );
};

export default HomePage;