import React, { useState } from 'react';
import { User} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthPages.css'; // Usamos um CSS comum para as duas páginas

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Utilizador'); // Role por defeito
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Dispara o pedido para o teu backend local
      const resposta = await axios.post('http://localhost:3000/api/login', {
        username,
        password,
        role
      });
      
      alert(resposta.data.message); // Avisa que correu bem
      // Guarda o token no browser (Local Storage) conforme Capítulo 4.2.2
      localStorage.setItem('token', resposta.data.token);
      
      // Redireciona consoante a role
      if (role === 'Gestora') navigate('/gestao');
      else if (role === 'Staff') navigate('/staff');
      else navigate('/'); // Volta à Home se for utilizador normal

    } catch (erro: any) {
      alert(erro.response?.data?.error || 'Erro ao tentar iniciar sessão.');
    }
  };

  return (
    <div className="auth-container">
      {/* HEADER */}
      <header className="site-header">
        <Link to="/" className="logo-container" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="logo-circle">
            <span className="logo-title">Au au...</span>
            <span className="logo-subtitle">sou um cão</span>
          </div>
        </Link>
        <h1 className="header-title">Página de LOGIN</h1>
        <div className="header-login">
          <User size={24} color="#1A1A1A" />
          <span>Iniciar Sessão</span>
        </div>
      </header>

      {/* MAIN SECTION */}
      <section className="auth-main-section">
        <form className="auth-form-card" onSubmit={handleLogin}>
          <h2>Login</h2>
          
          <label>Username:</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          
          <div className="form-buttons">
            <button type="submit" className="btn-primary">Login</button>
            <Link to="/criar-conta" className="btn-secondary">Criar Conta</Link>
          </div>
        </form>

        {/* ROLES PANEL */}
        <div className="roles-panel">
          {['Gestora', 'Utilizador', 'Staff', 'Receção', 'Veterinaria'].map(r => (
            <button 
              key={r} 
              type="button"
              className={`role-button ${role === r ? 'active' : ''}`}
              onClick={() => setRole(r)}
            >
              {r}
            </button>
          ))}
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
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;