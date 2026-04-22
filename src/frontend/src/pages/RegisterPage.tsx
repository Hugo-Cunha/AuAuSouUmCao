import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './AuthPages.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', password: '', confirmPassword: '', telemovel: '', nif: '', email: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://hotel-animais-api2-env.eba-2mnnmdjt.eu-west-3.elasticbeanstalk.com';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("As passwords não coincidem!");
    }

    try {
      const resposta = await axios.post(`${API_URL}/api/register`, formData);
      alert(resposta.data.message); 
      navigate('/login'); 
    } catch (erro: any) {
      alert(erro.response?.data?.error || 'Erro ao tentar criar a conta.');
    }
  };

  return (
    <div className="auth-container">
      <Header title="Página de Criar Conta" />

      <section className="auth-main-section center-card">
        <form className="auth-form-card register-card" onSubmit={handleRegister}>
          <h2>Criar Conta</h2>
          <label>Nome Completo:</label>
          <input type="text" name="username" onChange={handleChange} required />
          <label>Password:</label>
          <input type="password" name="password" onChange={handleChange} required />
          <label>Re-Confirmar Password:</label>
          <input type="password" name="confirmPassword" onChange={handleChange} required />
          <label>Número de telemóvel:</label>
          <input type="tel" name="telemovel" onChange={handleChange} required />
          <label>NIF:</label>
          <input type="text" name="nif" onChange={handleChange} required />
          <label>Email:</label>
          <input type="email" name="email" onChange={handleChange} required />
          <button type="submit" className="btn-secondary center-btn">Criar Conta</button>
        </form>
      </section>
      
      <div className="empty-space"></div>
      <Footer />
    </div>
  );
};

export default RegisterPage;