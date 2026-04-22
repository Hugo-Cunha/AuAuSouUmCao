import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Plus, Trash2, Check } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './MarcacoesPage.css';

interface Animal {
  idAnimal: string;
  nome: string;
  raca: string;
  reatividade: string;
  microchip: string;
  estado: string;
  tutorNif: string;
}

interface Reserva {
  idReserva: string;
  dataEntrada: string;
  dataSaida: string;
  estado: string;
  animalId: string;
  animal: Animal;
  boxNumero: number;
}

const MarcacoesPage: React.FC = () => {
  const [dataSelecionada, setDataSelecionada] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [animalSelecionado, setAnimalSelecionado] = useState<Animal | null>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarNovoFormulario, setMostrarNovoFormulario] = useState(false);

  // Dados do utilizador autenticado
  const utilizador = {
    nome: localStorage.getItem('user_nome') || 'Utilizador',
    nif: localStorage.getItem('user_nif') || '---',
    telemovel: localStorage.getItem('user_telemovel') || '---',
  };

  // Carregar animais e reservas ao montar
  useEffect(() => {
    const fetchDados = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        
        // Buscar lista de animais
        const resAnimais = await axios.get(`${API_URL}/api/animais`);
        setAnimais(resAnimais.data);

        // Buscar reservas
        const resReservas = await axios.get(`${API_URL}/api/reservas`);
        setReservas(resReservas.data);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  // Formulário para novo animal
  const [novoAnimal, setNovoAnimal] = useState<Animal>({
    idAnimal: '',
    nome: '',
    raca: '',
    reatividade: '',
    microchip: '',
    estado: 'Saudavel',
    tutorNif: utilizador.nif,
  });

  const handleNovoAnimalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNovoAnimal({ ...novoAnimal, [name]: value });
  };

  const adicionarAnimal = async () => {
    if (!novoAnimal.nome || !novoAnimal.raca) {
      alert('Por favor, preencha os campos obrigatórios!');
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const res = await axios.post(`${API_URL}/api/animais`, {
        nome: novoAnimal.nome,
        raca: novoAnimal.raca,
        tutorNif: utilizador.nif,
        microchip: novoAnimal.microchip || undefined,
        estado: novoAnimal.estado,
      });

      setAnimais([...animais, res.data]);
      setAnimalSelecionado(res.data);
      setMostrarNovoFormulario(false);
      setNovoAnimal({
        idAnimal: '',
        nome: '',
        raca: '',
        reatividade: '',
        microchip: '',
        estado: 'Saudavel',
        tutorNif: utilizador.nif,
      });
    } catch (err) {
      console.error('Erro ao adicionar animal:', err);
      alert('Erro ao adicionar animal!');
    }
  };

  const criarReserva = async () => {
    if (!dataSelecionada || !animalSelecionado) {
      alert('Por favor, selecione a data e o animal!');
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const res = await axios.post(`${API_URL}/api/reservas`, {
        data: dataSelecionada,
        idAnimal: animalSelecionado.idAnimal,
        boxNumero: 1,
      });

      setReservas([...reservas, res.data]);
      alert('Reserva criada com sucesso!');
    } catch (err) {
      console.error('Erro ao criar reserva:', err);
      alert('Erro ao criar reserva!');
    }
  };

  const apagarReserva = async (idReserva: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      await axios.delete(`${API_URL}/api/reservas/${idReserva}`);
      setReservas(reservas.filter((r) => r.idReserva !== idReserva));
      alert('Reserva eliminada com sucesso!');
    } catch (err) {
      console.error('Erro ao eliminar reserva:', err);
      alert('Erro ao eliminar reserva!');
    }
  };

  // Filtrar reservas da data selecionada
  const reservasDia = reservas.filter((r) => {
    const dataEntrada = new Date(r.dataEntrada).toISOString().split('T')[0];
    return dataEntrada === dataSelecionada;
  });

  if (loading) {
    return (
      <div className="marcacoes-page-container">
        <Header userData={utilizador} />
        <div className="loading">Carregando...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="marcacoes-page-container">
      <Header userData={utilizador} />

      <main className="marcacoes-main">
        <h1 className="page-title">Minhas Marcações</h1>

        <div className="marcacoes-content">
          {/* PARTE 1: SELEÇÃO DE DATA */}
          <section className="secao-calendario">
            <h2>
              <Calendar size={24} /> Selecione a Data
            </h2>

            <div className="calendario-container">
              <input
                type="date"
                value={dataSelecionada}
                onChange={(e) => setDataSelecionada(e.target.value)}
                className="date-input"
              />
              <p className="data-selecionada">
                Data Selecionada: <strong>{new Date(dataSelecionada).toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
              </p>
            </div>

            {/* Reservas do dia */}
            <div className="marcacoes-do-dia">
              <h3>Reservas para este dia</h3>
              {reservasDia.length > 0 ? (
                <ul className="marcacoes-lista">
                  {reservasDia.map((reserva) => (
                    <li key={reserva.idReserva} className="marcacao-item">
                      <div>
                        <span>{reserva.animal.nome}</span>
                        <p className="estado-reserva">{reserva.estado}</p>
                      </div>
                      <button
                        onClick={() => apagarReserva(reserva.idReserva)}
                        className="btn-apagar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-marcacoes">Sem reservas para este dia</p>
              )}
            </div>
          </section>

          {/* PARTE 2: ADICIONAR ANIMAL */}
          <section className="secao-cao">
            <h2>
              <Plus size={24} /> Selecione ou Adicione um Animal
            </h2>

            <div className="cao-selector">
              <h3>Animais Registados</h3>
              {animais.length > 0 ? (
                <div className="caos-grid">
                  {animais.map((animal) => (
                    <div
                      key={animal.idAnimal}
                      className={`cao-card ${animalSelecionado?.idAnimal === animal.idAnimal ? 'ativo' : ''}`}
                      onClick={() => setAnimalSelecionado(animal)}
                    >
                      <div className="cao-card-header">
                        <h4>{animal.nome}</h4>
                        {animalSelecionado?.idAnimal === animal.idAnimal && (
                          <Check size={20} className="check-icon" />
                        )}
                      </div>
                      <p><strong>Raça:</strong> {animal.raca}</p>
                      <p><strong>Estado:</strong> {animal.estado}</p>
                      <p><strong>Reatividade:</strong> {animal.reatividade}</p>
                      <p><strong>Microchip:</strong> {animal.microchip}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-caos">Nenhum animal registado</p>
              )}
            </div>

            {/* Botão para adicionar novo animal */}
            <button
              className="btn-adicionar-cao"
              onClick={() => setMostrarNovoFormulario(!mostrarNovoFormulario)}
            >
              <Plus size={18} /> Adicionar Novo Animal
            </button>

            {/* Formulário para novo animal */}
            {mostrarNovoFormulario && (
              <form className="novo-cao-form">
                <h3>Registar Novo Animal</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label>Nome do Animal *</label>
                    <input
                      type="text"
                      name="nome"
                      value={novoAnimal.nome}
                      onChange={handleNovoAnimalChange}
                      placeholder="ex: Bobby"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Raça *</label>
                    <input
                      type="text"
                      name="raca"
                      value={novoAnimal.raca}
                      onChange={handleNovoAnimalChange}
                      placeholder="ex: Labrador"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Microchip</label>
                    <input
                      type="text"
                      name="microchip"
                      value={novoAnimal.microchip}
                      onChange={handleNovoAnimalChange}
                      placeholder="ex: 123456789"
                    />
                  </div>
                  <div className="form-group">
                    <label>Reatividade</label>
                    <input
                      type="text"
                      name="reatividade"
                      value={novoAnimal.reatividade}
                      onChange={handleNovoAnimalChange}
                      placeholder="ex: Normal"
                    />
                  </div>
                </div>

                <button type="button" onClick={adicionarAnimal} className="btn-confirmar">
                  Registar Animal
                </button>
              </form>
            )}

            {/* Botão para criar reserva */}
            {animalSelecionado && (
              <button onClick={criarReserva} className="btn-criar-marcacao">
                Confirmar Reserva para {animalSelecionado.nome}
              </button>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MarcacoesPage;
