import React from 'react';
import { User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Shared.css';

interface HeaderProps {
  title?: string; // Opcional agora
  userData?: { nome: string; nif: string; telemovel: string }; // Novo: Dados do utilizador
}

const Header: React.FC<HeaderProps> = ({ title, userData }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Limpa tudo (token, nome, nif...)
    navigate('/login');
  };

  // Se houver userData, usamos o estilo de Dashboard (130px)
  const isDashboard = !!userData;

  return (
    <header className="site-header" style={{ height: isDashboard ? '130px' : '72px' }}>
      {/* ESQUERDA: Logo */}
      <Link to="/" className="logo-container">
        <div className="logo-circle" style={{ width: isDashboard ? '90px' : '52px', height: isDashboard ? '90px' : '52px' }}>
          <img 
            src="https://cdn.discordapp.com/attachments/1212044201747816518/1496523823208599603/Gemini_Generated_Image_sebx2ssebx2ssebx.png?ex=69ea31eb&is=69e8e06b&hm=e86093c99b49fbbe0b718a5942cb18caa1e6e79fdf19253b2e252c75d225bb2e" 
            alt="Logo"
          />
        </div>
      </Link>
      
      {/* CENTRO: Título OU Dados do Utilizador */}
      <div className="header-center">
        {isDashboard ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' }}>
            <span style={{ fontSize: '22px', fontWeight: 'bold' }}>Nome: {userData.nome}</span>
            <span style={{ fontSize: '22px', fontWeight: 'bold' }}>NIF: {userData.nif}</span>
            <span style={{ fontSize: '22px', fontWeight: 'bold' }}>Telemóvel: {userData.telemovel}</span>
          </div>
        ) : (
          <h1 className="header-title">{title}</h1>
        )}
      </div>
      
      {/* DIREITA: Iniciar Sessão OU Log Out */}
      <div className="header-right">
        {isDashboard ? (
          <div onClick={handleLogout} className="header-login" style={{ cursor: 'pointer' }}>
            <LogOut size={40} color="#E74C3C" />
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Log Out</span>
          </div>
        ) : (
          <Link to="/login" className="header-login">
            <User size={24} color="#1A1A1A" />
            <span>Iniciar Sessão</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;