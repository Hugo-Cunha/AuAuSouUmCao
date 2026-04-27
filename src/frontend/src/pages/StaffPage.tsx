import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Camera, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './StaffPage.css';

interface Animal {
  idAnimal: string;
  nome: string;
  raca?: string;
}

interface Box {
  numero: number;
  tamanho: number;
  ocupacao: number;
}

interface Reserva {
  idReserva: string;
  animal: Animal;
  box: Box;
  dataEntrada: string;
  dataSaida: string;
}

interface Tarefa {
  idServico: string;
  tipo: 'Grooming' | 'Passeio' | 'Adestramento';
  data: string;
  preco: number;
  reserva: Reserva;
}

const StaffPage: React.FC = () => {
  const staff = {
    nome: localStorage.getItem('user_nome') || 'Utilizador',
    nif: localStorage.getItem('user_nif') || '---',
    telemovel: localStorage.getItem('user_telemovel') || '---',
    perfil: localStorage.getItem('role') || 'Staff',
  };

  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<Tarefa | null>(null);
  const [staffCount, setStaffCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Buscar tarefas do dia e info do staff
  useEffect(() => {
    const fetchDados = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        
        // Buscar tarefas do dia
        const resTarefas = await axios.get(`${API_URL}/api/tarefas`);
        setTarefas(resTarefas.data);

        // Buscar contagem de staff
        const resStaff = await axios.get(`${API_URL}/api/funcionarios/count`);
        setStaffCount(resStaff.data.total);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  const concluirTarefa = async (id: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      await axios.patch(`${API_URL}/api/tarefas/${id}/concluir`);
      
      // Atualizar lista removendo tarefa
      setTarefas(tarefas.filter((t) => t.idServico !== id));
      setTarefaSelecionada(null);
      alert('Tarefa concluída com sucesso!');
    } catch (err) {
      console.error('Erro ao concluir tarefa:', err);
      alert('Erro ao concluir tarefa');
    }
  };

  const adicionarFoto = () => {
    alert('Funcionalidade de foto será implementada');
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'Passeio':
        return 'Passear';
      case 'Grooming':
        return 'Grooming';
      case 'Adestramento':
        return 'Adestramento';
      default:
        return tipo;
    }
  };

  // Agrupar tarefas por data
  const tarefasPorData = tarefas.reduce(
    (acc, tarefa) => {
      const data = new Date(tarefa.data).toLocaleDateString('pt-PT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!acc[data]) {
        acc[data] = [];
      }
      acc[data].push(tarefa);
      return acc;
    },
    {} as Record<string, Tarefa[]>
  );

  if (loading) {
    return (
      <div className="staff-page-container">
        <Header userData={staff} />
        <div className="loading">Carregando tarefas...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="staff-page-container">
      <Header userData={staff} />

      <main className="staff-main">
        <div className="staff-info-bar">
          <p>
            <strong>Staff:</strong> {staffCount} membros
          </p>
          <p>
            <strong>Tarefas do dia:</strong> {tarefas.length}
          </p>
        </div>

        <div className="staff-content">
          {/* COLUNA ESQUERDA - TAREFAS DIÁRIAS */}
          <section className="tarefas-section">
            <h2>Tarefas:</h2>

            <div className="tarefas-lista">
              {tarefas.length > 0 ? (
                Object.entries(tarefasPorData).map(([data, tarefasDodia]) => (
                  <div key={data}>
                    <h4 className="tarefa-data">{data}</h4>
                    {tarefasDodia.map((tarefa) => (
                      <div
                        key={tarefa.idServico}
                        className={`tarefa-card ${
                          tarefaSelecionada?.idServico === tarefa.idServico
                            ? 'ativo'
                            : ''
                        }`}
                        onClick={() => setTarefaSelecionada(tarefa)}
                      >
                        <div className="tarefa-header">
                          <h3>{getTipoLabel(tarefa.tipo)}</h3>
                        </div>
                        <p className="tarefa-info">
                          Cão: <strong>{tarefa.reserva.animal.nome}</strong> (jaula{' '}
                          {tarefa.reserva.box.numero})
                        </p>
                        <p className="tarefa-horario">
                          Hora:{' '}
                          {new Date(tarefa.data).toLocaleTimeString('pt-PT', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p className="no-tarefas">Sem tarefas</p>
              )}
            </div>
          </section>

          {/* COLUNA DIREITA - DETALHES DA TAREFA SELECIONADA */}
          {tarefaSelecionada && (
            <section className="detalhes-section">
              <h3>{getTipoLabel(tarefaSelecionada.tipo)}</h3>
              <div className="detalhes-card">
                <p className="detalhes-info">
                  Cão: <strong>{tarefaSelecionada.reserva.animal.nome}</strong>{' '}
                  (jaula {tarefaSelecionada.reserva.box.numero})
                </p>
                <p className="detalhes-horario">
                  Horário:{' '}
                  {new Date(tarefaSelecionada.data).toLocaleTimeString('pt-PT', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="detalhes-race">
                  Raça: <strong>{tarefaSelecionada.reserva.animal.raca || 'N/A'}</strong>
                </p>

                <button
                  className="btn-foto-grande"
                  onClick={() => adicionarFoto()}
                >
                  <Camera size={18} /> Adicionar Foto
                </button>
              </div>

              {/* MAPA */}
              <div className="mapa-container">
                <div className="mapa-placeholder">
                  <MapPin size={48} />
                  <p>Jaula {tarefaSelecionada.reserva.box.numero}</p>
                </div>
              </div>

              <button
                className="btn-feito-grande"
                onClick={() =>
                  concluirTarefa(tarefaSelecionada.idServico)
                }
              >
                ✓ Tarefa Concluída
              </button>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StaffPage;