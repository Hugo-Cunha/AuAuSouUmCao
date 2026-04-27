import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './DiarioBordoPage.css';

interface Registo {
  dataHora: string;
  descricao: string;
}

interface Servico {
  idServico: string;
  tipo: 'Grooming' | 'Passeio' | 'Adestramento';
  data: string;
  preco: number;
  estado: 'Pendente' | 'Finalizado';
}

const DiarioBordoPage: React.FC = () => {
  const { idAnimal } = useParams();
  const [diario, setDiario] = useState<Registo[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [animalNome, setAnimalNome] = useState('A carregar...');
  const [estadoClinico, setEstadoClinico] = useState('...');
  const [loading, setLoading] = useState(true);

  const user = {
    nome: localStorage.getItem('user_nome') || "Utilizador",
    nif: localStorage.getItem('user_nif') || "---",
    telemovel: localStorage.getItem('user_telemovel') || "---",
    perfil: localStorage.getItem('role') || "Tutor"
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'Passeio':
        return '🚶 Passear';
      case 'Grooming':
        return '✂️ Grooming';
      case 'Adestramento':
        return '🎯 Adestramento';
      default:
        return tipo;
    }
  };

  useEffect(() => {
    const fetchDados = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        
        // Buscar historial (diário de bordo)
        const res = await axios.get(`${API_URL}/api/animais/${idAnimal}/historial`);
        setDiario(res.data.diarioBordo);
        setAnimalNome(res.data.nome);
        setEstadoClinico(res.data.estadoClinico);

        // Buscar serviços finalizados do dia
        const resServicos = await axios.get(
          `${API_URL}/api/animais/${idAnimal}/servicos-finalizados`
        );
        setServicos(resServicos.data);
      } catch (e) {
        console.error("Erro ao carregar o diário:", e);
      } finally {
        setLoading(false);
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
          <p>Serviços finalizados hoje: {servicos.length}</p>
        </div>
        <div className="info-text-block">
          <p>Alimentação: Responsivo</p>
          <p>Comportamento: Positivo</p>
        </div>
        <div className="animal-photo-circle">
          <img src="https://images.unsplash.com/photo-1516734212448-1dd58be2cb56?w=200&q=80" alt="Foto do Cão" />
        </div>
      </section>

      {/* SEÇÃO DE SERVIÇOS FINALIZADOS */}
      <section className="tasks-container">
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '15px', color: '#1a1a1a' }}>📔 Registos no Diário:</h3>
        {servicos.length > 0 ? (
          servicos.map((servico) => (
            <div className="task-row" key={servico.idServico}>
              <div className="task-text">
                <h4>{getTipoLabel(servico.tipo)}</h4>
                <p>Hora: {new Date(servico.data).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</p>
                <p>Preço: €{servico.preco.toFixed(2)}</p>
              </div>
              <div className="task-indicator" style={{ backgroundColor: '#10b981' }}></div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#999', marginTop: '10px', fontStyle: 'italic' }}>Nenhum serviço finalizado hoje</p>
        )}
      </section>
        <a href="/tutor" className="btn-voltar">
          Voltar
        </a>

      <hr className="separator" style={{ width: '90%', margin: '20px auto', borderTop: '1px solid #CCCCCC' }} />
      <Footer />
    </div>
  );
};

export default DiarioBordoPage;