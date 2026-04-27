import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './AuthPages.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Mandamos só Email e Password
      const resposta = await axios.post(`${API_URL}/api/login`, { username, password });
      
      // Extraímos também os dados do utilizador que o backend vai enviar
      const { token, role, message, nome, nif, telemovel } = resposta.data;
      
      alert(message); 
      localStorage.setItem('token', token);
      localStorage.setItem('role', role); 
      
      // Guardamos os dados pessoais para o cabeçalho
      localStorage.setItem('user_nome', nome || '');
      localStorage.setItem('user_nif', nif || '');
      localStorage.setItem('user_telemovel', telemovel || '');
      
      // O REDIRECIONAMENTO AUTOMÁTICO MÁGICO!
      if (role === 'Admin') {
        navigate('/gestao');
      } else if (role === 'Staff') {
        navigate('/staff');
      } else if (role === 'Vet') {
        navigate('/vet')
      } else if (role === 'Rececao') { // <-- ADICIONA ISTO
        navigate('/rececao');
      } else {
        navigate('/tutor'); 
      }
    } catch (erro: any) {
      alert(erro.response?.data?.error || 'Erro ao tentar iniciar sessão.');
    }
  };

  return (
    <div className="auth-container">
      <Header title="Página de LOGIN" />

      <section className="auth-main-section center-card">
        <form className="auth-form-card" style={{ maxWidth: '450px' }} onSubmit={handleLogin}>
          <h2>Iniciar Sessão</h2>
          
          <label>Email:</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          
          <div className="form-buttons center-btn">
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
          </div>
          <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '13px' }}>
            Ainda não tem conta? <span style={{ color: '#7DDFD3', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate('/criar-conta')}>Registe-se aqui</span>
          </p>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default LoginPage;