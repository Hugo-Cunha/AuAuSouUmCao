import React, { useState } from 'react';
import { MapPin, Camera, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './StaffPage.css';

interface Tarefa {
  id: string;
  tipo: 'passear' | 'comer' | 'outro';
  cao: string;
  jaula: number;
  horario: string;
  concluida: boolean;
  foto?: string;
}

const StaffPage: React.FC = () => {
  const staff = {
    nome: localStorage.getItem('user_nome') || 'Utilizador',
    nif: localStorage.getItem('user_nif') || '---',
    telemovel: localStorage.getItem('user_telemovel') || '---',
    perfil: localStorage.getItem('role') || 'Staff',
  };

  // Tarefas de exemplo
  const [tarefas, setTarefas] = useState<Tarefa[]>([
    {
      id: '1',
      tipo: 'passear',
      cao: 'Bobby',
      jaula: 14,
      horario: '16:35 - 17:00',
      concluida: false,
    },
    {
      id: '2',
      tipo: 'comer',
      cao: 'Bobby',
      jaula: 14,
      horario: '20:35 - 20:45',
      concluida: false,
    },
  ]);

  const [tarefaSelecionada] = useState<Tarefa | null>(
    tarefas[0]
  );

  const concluirTarefa = (id: string) => {
    setTarefas(
      tarefas.map((t) => (t.id === id ? { ...t, concluida: true } : t))
    );
  };

  const adicionarFoto = () => {
    alert('Funcionalidade de foto será implementada');
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'passear':
        return 'Passear';
      case 'comer':
        return 'Dar de Comer';
      default:
        return 'Outra Tarefa';
    }
  };

  return (
    <div className="staff-page-container">
      <Header userData={staff} />

      <main className="staff-main">
        <div className="staff-header">
          <div className="staff-info">
            <p>
              <strong>Nome:</strong> {staff.nome}
            </p>
            <p>
              <strong>Número:</strong> {staff.nif}
            </p>
          </div>
          <div className="staff-time">
            <p>
              <strong>Horas:</strong> {new Date().toLocaleTimeString('pt-PT')}{' '}
              {new Date().toLocaleDateString('pt-PT')}
            </p>
          </div>
        </div>

        <div className="staff-content">
          {/* COLUNA ESQUERDA - TAREFAS DIÁRIAS */}
          <section className="tarefas-section">
            <div className="tarefas-header">
              <h2>Tarefas Diárias:</h2>
              <button
                className="btn-modo-telemovel"
                onClick={() => {}}
              >
                Modo Telemovel
              </button>
            </div>

            <div className="tarefas-lista">
              {tarefas.map((tarefa) => (
                <div
                  key={tarefa.id}
                  className={`tarefa-card ${tarefa.concluida ? 'concluida' : ''}`}
                >
                  <div className="tarefa-header">
                    <h3>{getTipoLabel(tarefa.tipo)}</h3>
                    {tarefa.concluida && (
                      <CheckCircle size={20} className="check-icon" />
                    )}
                  </div>
                  <p className="tarefa-info">
                    Cão: <strong>{tarefa.cao}</strong> (jaula {tarefa.jaula}) ver
                    no mapa
                  </p>
                  <p className="tarefa-horario">Horário: {tarefa.horario}</p>
                  <div className="tarefa-actions">
                    <button
                      className="btn-foto"
                      onClick={() => adicionarFoto()}
                    >
                      <Camera size={16} /> Adicionar Foto
                    </button>
                    {!tarefa.concluida && (
                      <button
                        className="btn-feito"
                        onClick={() => concluirTarefa(tarefa.id)}
                      >
                        Feito
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* COLUNA DIREITA - DETALHES DA TAREFA */}
          {tarefaSelecionada && (
            <section className="detalhes-section">
              <h3>Passear:</h3>
              <div className="detalhes-card">
                <p className="detalhes-info">
                  Cão: <strong>{tarefaSelecionada.cao}</strong> (jaula{' '}
                  {tarefaSelecionada.jaula}) ver no mapa
                </p>
                <p className="detalhes-horario">
                  Horário: {tarefaSelecionada.horario}
                </p>

                <button className="btn-foto-grande">
                  <Camera size={18} /> Adicionar Foto
                </button>
              </div>

              {/* MAPA */}
              <div className="mapa-container">
                <div className="mapa-placeholder">
                  <MapPin size={48} />
                  <p>Mapa interativo</p>
                </div>
              </div>

              <button className="btn-voltar">Voltar</button>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StaffPage;