import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // <-- IMPORTAÇÃO NOVA
import Header from '../components/Header';
import Footer from '../components/Footer';
import './DiarioBordoPage.css';

interface Registo {
  dataHora: string;
  descricao: string;
}

const DiarioBordoPage: React.FC = () => {
  const { idAnimal } = useParams(); // <-- LÊ O ID DO CÃO A PARTIR DO URL
  const [diario, setDiario] = useState<Registo[]>([]);
  const [animalNome, setAnimalNome] = useState('A carregar...');
  const [estadoClinico, setEstadoClinico] = useState('...');

  const user = {
    nome: localStorage.getItem('user_nome') || "Utilizador",
    nif: localStorage.getItem('user_nif') || "---",
    telemovel: localStorage.getItem('user_telemovel') || "---"
  };

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        // Vai buscar o historial do cão específico!
        const res = await axios.get(`${API_URL}/api/animais/${idAnimal}/historial`);
        setDiario(res.data.diarioBordo);
        setAnimalNome(res.data.nome);
        setEstadoClinico(res.data.estadoClinico);
      } catch (e) { 
        console.error("Erro ao carregar o diário:", e); 
      }
    };
    
    if (idAnimal) {
        fetchDados();
    }
  }, [idAnimal]);

  return (
    <div className="diario-page-container">
      <Header userData={user} />

      <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'lighter', margin: '20px 0' }}>Diário de Bordo</h2>

      <section className="animal-info-card">
        <div className="info-text-block">
          <h2>Detalhes do Animal:</h2>
          <p>Nome: {animalNome}</p>
          <p>Estado: {estadoClinico}</p>
          <p>To-do: Banho | Passeio</p>
        </div>
        <div className="info-text-block">
          <p>Alimentação: Responsivo</p>
          <p>Comportamento: Positivo</p>
        </div>
        <div className="animal-photo-circle">
          <img src="https://images.unsplash.com/photo-1516734212448-1dd58be2cb56?w=200&q=80" alt="Cão" />
        </div>
      </section>

      <section className="tasks-container">
        {diario.length > 0 ? diario.map((item, idx) => (
          <div className="task-row" key={idx}>
            <div className="task-text">
              <h4>Registo: {new Date(item.dataHora).toLocaleString('pt-PT')}</h4>
              <p>Nota: {item.descricao}</p>
            </div>
            <div className="task-indicator" style={{ backgroundColor: idx % 2 === 0 ? '#39FF14' : '#FFE600' }}></div>
          </div>
        )) : (
            <p style={{ textAlign: 'center', color: '#1A1A1A', marginTop: '20px' }}>Ainda não há registos no diário de hoje.</p>
        )}
      </section>

      <hr className="separator" style={{ width: '90%', margin: '20px auto', borderTop: '1px solid #CCCCCC' }} />
      <Footer />
    </div>
  );
};

export default DiarioBordoPage;