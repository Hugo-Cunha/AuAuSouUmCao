import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Shared.css';

interface HeaderProps {
  title?: string;
  userData?: { nome: string; nif?: string; telemovel?: string; perfil?: string };
  isRececao?: boolean; // Novo modo para a Diana/Rececionistas
}

const Header: React.FC<HeaderProps> = ({ title, userData, isRececao }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (isRececao) {
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    }
  }, [isRececao]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="site-header" style={{ height: '130px', padding: '0 40px' }}>
      <Link to="/" className="logo-container">
        <div className="logo-circle" style={{ width: '90px', height: '90px' }}>
          <img src="https://cdn.discordapp.com/attachments/1212044201747816518/1496523823208599603/Gemini_Generated_Image_sebx2ssebx2ssebx.png?ex=69ea31eb&is=69e8e06b&hm=e86093c99b49fbbe0b718a5942cb18caa1e6e79fdf19253b2e252c75d225bb2e" alt="Logo" />
        </div>
      </Link>
      
      <div className="header-center">
        {isRececao && userData ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            {/* Bloco Funcionário */}
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Nome: {userData.nome}</p>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Perfil: {userData.perfil || 'Receção'}</p>
            </div>
            {/* Linha Divisória Vertical */}
            <div style={{ width: '2px', height: '60px', backgroundColor: '#1A1A1A' }}></div>
            {/* Bloco Data/Hora */}
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Hora: {currentTime.toLocaleTimeString('pt-PT')}</p>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Data: {currentTime.toLocaleDateString('pt-PT')}</p>
            </div>
          </div>
        ) : userData ? (
          /* Layout Tutor Original */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' }}>
            <span style={{ fontSize: '22px', fontWeight: 'bold' }}>Nome: {userData.nome}</span>
            <span style={{ fontSize: '22px', fontWeight: 'bold' }}>NIF: {userData.nif}</span>
            <span style={{ fontSize: '22px', fontWeight: 'bold' }}>Telemóvel: {userData.telemovel}</span>
          </div>
        ) : (
          <h1 className="header-title">{title}</h1>
        )}
      </div>
      
      <div onClick={handleLogout} style={{ cursor: 'pointer', textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <LogOut size={40} color="#000" />
          <span style={{ position: 'absolute', top: '-5px', right: '-5px', color: '#E74C3C', fontWeight: 'bold', fontSize: '24px' }}>X</span>
        </div>
        <p style={{ margin: '5px 0 0', fontSize: '14px', fontWeight: 'bold' }}>Log Out</p>
      </div>
    </header>
  );
};

export default Header;