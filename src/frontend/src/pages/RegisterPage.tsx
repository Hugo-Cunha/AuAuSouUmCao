import React, { useState } from 'react';
import { User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthPages.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', password: '', confirmPassword: '', telemovel: '', nif: '', email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("As passwords não coincidem!");
    }

    try {
      // Dispara os dados para o Backend gravar na Base de Dados
      const resposta = await axios.post('http://localhost:3000/api/register', formData);
      alert(resposta.data.message); // Sucesso! Conta Criada!
      navigate('/login'); // Vai para a página de login
    } catch (erro: any) {
      alert(erro.response?.data?.error || 'Erro ao tentar criar a conta.');
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
        <h1 className="header-title">Página de Criar Conta</h1>
        <Link to="/login" className="header-login" style={{ textDecoration: 'none', color: 'inherit' }}>
          <User size={24} color="#1A1A1A" />
          <span>Iniciar Sessão</span>
        </Link>
      </header>

      {/* MAIN SECTION */}
      <section className="auth-main-section center-card">
        <form className="auth-form-card register-card" onSubmit={handleRegister}>
          <h2>Criar Conta</h2>
          
          <label>Username:</label>
          <input type="text" name="username" onChange={handleChange} required />
          
          <label>Password:</label>
          <input type="password" name="password" onChange={handleChange} required />

          <label>Re-Confirmar Password:</label>
          <input type="password" name="confirmPassword" onChange={handleChange} required />

          <label>Número de telemóvel:</label>
          <input type="tel" name="telemovel" onChange={handleChange} required />

          <label>NIF:</label>
          <input type="text" name="nif" onChange={handleChange} required />

          <label>Email(endereço eletrónico):</label>
          <input type="email" name="email" onChange={handleChange} required />
          
          <button type="submit" className="btn-secondary center-btn">Criar Conta</button>
        </form>
      </section>
      
      <div className="empty-space"></div>

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

export default RegisterPage;