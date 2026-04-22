import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header'; // <-- Passamos a usar o Header partilhado
import Footer from '../components/Footer'; // <-- Passamos a usar o Footer partilhado
import './DiarioBordoPage.css';

interface Registo {
  dataHora: string;
  descricao: string;
}

const DiarioBordoPage: React.FC = () => {
  const [diario, setDiario] = useState<Registo[]>([]);
  const [animalNome, setAnimalNome] = useState('Bobby');

  // Lê dinamicamente os dados do utilizador que guardámos no Login
  const user = {
    nome: localStorage.getItem('user_nome') || "Utilizador",
    nif: localStorage.getItem('user_nif') || "---",
    telemovel: localStorage.getItem('user_telemovel') || "---"
  };

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const res = await axios.get(`${API_URL}/api/animais/A-789/historial`);
        setDiario(res.data.diarioBordo);
        setAnimalNome(res.data.nome);
      } catch (e) { console.error(e); }
    };
    fetchDados();
  }, []);

  return (
    <div className="diario-page-container">
      
      {/* 1. HEADER INTELIGENTE PARTILHADO */}
      {/* Ao passarmos a propriedade userData, ele entra no modo "Autenticado" */}
      <Header userData={user} />

      <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'lighter', margin: '20px 0' }}>Diário de Bordo</h2>

      {/* 2. Card Detalhes do Animal */}
      <section className="animal-info-card">
        <div className="info-text-block">
          <h2>Detalhes do Animal:</h2>
          <p>Nome: {animalNome}</p>
          <p>Estado: Saudável</p>
          <p>To-do: Banho | Passeio ....</p>
        </div>
        <div className="info-text-block">
          <p>Alimentação: Responsivo</p>
          <p>Comportamento: Positivo</p>
        </div>
        <div className="animal-photo-circle">
          <img src="https://images.unsplash.com/photo-1516734212448-1dd58be2cb56?w=200&q=80" alt="Pinscher" />
        </div>
      </section>

      {/* 3. Área de Tarefas */}
      <section className="tasks-container">
        {diario.map((item, idx) => (
          <div className="task-row" key={idx}>
            <div className="task-text">
              <h4>Tarefa: Passear -- {new Date(item.dataHora).toLocaleTimeString()} -- Comportamento: Positivo</h4>
              <p>Nota: {item.descricao}</p>
            </div>
            {/* Indicador Neon: Verde para pares, Amarelo para ímpares */}
            <div className="task-indicator" style={{ backgroundColor: idx % 2 === 0 ? '#39FF14' : '#FFE600' }}></div>
          </div>
        ))}

        <div className="action-buttons-row">
          <button className="btn-pill">Adicionar Tarefa</button>
          <button className="btn-pill">Adicionar Dias</button>
        </div>
      </section>

      <hr className="separator" style={{ width: '90%', margin: '20px auto', borderTop: '1px solid #CCCCCC' }} />

      {/* 4. FOOTER PARTILHADO */}
      <Footer />
      
    </div>
  );
};

export default DiarioBordoPage;