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
  boletimVacinasUrl?: string;
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
  const today = new Date();
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const [dataEntrada, setDataEntrada] = useState<string>(formatDate(today));
  const [dataSaida, setDataSaida] = useState<string>(() => {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDate(tomorrow);
  });
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [animalSelecionado, setAnimalSelecionado] = useState<Animal | null>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarNovoFormulario, setMostrarNovoFormulario] = useState(false);

  // Estados para novo animal
  const [vacinasFile, setVacinasFile] = useState<File | null>(null);
  const [racaCustomizada, setRacaCustomizada] = useState('');
  
  // Estados para serviços na reserva
  const [banhos, setBanhos] = useState<number>(0);
  const [tosquias, setTosquias] = useState<number>(0);
  const [passeios, setPasseios] = useState<number>(0);

  // Dados do utilizador autenticado
  const utilizador = {
    nome: localStorage.getItem('user_nome') || 'Utilizador',
    nif: localStorage.getItem('user_nif') || '---',
    telemovel: localStorage.getItem('user_telemovel') || '---',
    perfil: localStorage.getItem('role') || 'Tutor', // <-- ADICIONA ISTO
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
    boletimVacinasUrl: '',
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
      const finalRaca = novoAnimal.raca === 'Outros' ? racaCustomizada : novoAnimal.raca;
      
      const formData = new FormData();
      formData.append('nome', novoAnimal.nome);
      formData.append('raca', finalRaca);
      formData.append('reatividade', novoAnimal.reatividade);
      formData.append('tutorNif', utilizador.nif);
      formData.append('microchip', novoAnimal.microchip || '');
      formData.append('estado', novoAnimal.estado);
      formData.append('boletimVacinasUrl', novoAnimal.boletimVacinasUrl || '');
      if (vacinasFile) {
        formData.append('vacinasFile', vacinasFile);
      }

      const res = await axios.post(`${API_URL}/api/animais`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
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
        boletimVacinasUrl: '',
      });
      setRacaCustomizada('');
    } catch (err) {
      console.error('Erro ao adicionar animal:', err);
      alert('Erro ao adicionar animal!');
    }
  };

  const animaisTutor = animais.filter((a) => a.tutorNif === utilizador.nif);

  // Calcular preço total
  const calcularPreco = () => {
    const entrada = new Date(dataEntrada);
    const saida = new Date(dataSaida);
    const dias = (saida.getTime() - entrada.getTime()) / (1000 * 60 * 60 * 24);
    
    const precoEstadia = dias * 20; // 20€ por dia
    const precoBanhos = banhos * 20; // 20€ por banho
    const precoTosquias = tosquias * 10; // 10€ por tosquia
    const precoPasseios = passeios * 10; // 10€ por passeio
    
    return precoEstadia + precoBanhos + precoTosquias + precoPasseios;
  };

  const criarReserva = async () => {
    if (!dataEntrada || !dataSaida || !animalSelecionado) {
      alert('Por favor, selecione o intervalo e o animal!');
      return;
    }

    if (new Date(dataSaida) <= new Date(dataEntrada)) {
      alert('A data de saída deve ser posterior à data de entrada.');
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const res = await axios.post(`${API_URL}/api/reservas`, {
        dataEntrada,
        dataSaida,
        idAnimal: animalSelecionado.idAnimal,
        boxNumero: 1,
        banhos: banhos,
        tosquias: tosquias,
        passeios: passeios
      });

      setReservas([...reservas, res.data]);
      alert('Reserva criada com sucesso!');
      setAnimalSelecionado(null);
      setBanhos(0);
      setTosquias(0);
      setPasseios(0);
    } catch (err: any) {
      console.error('Erro ao criar reserva:', err);
      const mensagem = err?.response?.data?.error || 'Erro ao criar reserva!';
      alert(mensagem);
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

  const datanormal = (data: string) => {
    const d = new Date(data);
    return d.toLocaleDateString('pt-PT');
  }

  const reservasProprias = reservas.filter((r) => r.animal.tutorNif === utilizador.nif);

  // Filtrar reservas no intervalo selecionado
  const countReservas = reservas.filter((r) => {
    const entrada = new Date(r.dataEntrada);
    const saida = new Date(r.dataSaida);
    const selecionadaEntrada = new Date(dataEntrada);
    const selecionadaSaida = new Date(dataSaida);
    
    return (
        (entrada >= selecionadaEntrada && entrada < selecionadaSaida) ||
        (saida > selecionadaEntrada && saida <= selecionadaSaida) ||
        (entrada <= selecionadaEntrada && saida >= selecionadaSaida)
    );
  }).length;

  const calcularMaxAdicionais = () => {
    const entrada = new Date(dataEntrada);
    const saida = new Date(dataSaida);
    const dias = (saida.getTime() - entrada.getTime()) / (1000 * 60 * 60 * 24);
    return Math.ceil(dias); // Permitir 1 tosquia por dia
};


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
        <div>
        <a href="/tutor" className="btn-voltar">
          Voltar
        </a>
        <h1 className="page-title">Minhas Marcações</h1>
    </div>
        <div className="marcacoes-content">
          {/* PARTE 1: SELEÇÃO DE DATA */}
          <section className="secao-calendario">
            <h2>
              <Calendar size={24} /> Selecione a Data
            </h2>

            <div className="calendario-container">
              <div className="date-range-row">
                <div>
                  <label>Entrada</label>
                  <input
                    type="date"
                    value={dataEntrada}
                    onChange={(e) => setDataEntrada(e.target.value)}
                    className="date-input"
                  />
                </div>
                <div>
                  <label>Saída</label>
                  <input
                    type="date"
                    value={dataSaida}
                    onChange={(e) => setDataSaida(e.target.value)}
                    className="date-input"
                    min={dataEntrada}
                  />
                </div>
              </div>
              <p className="data-selecionada">
                Intervalo: <strong>{new Date(dataEntrada).toLocaleDateString('pt-PT')} - {new Date(dataSaida).toLocaleDateString('pt-PT')}</strong>
              </p>
            </div>

            {/* Reservas do dia */}
            <div className="marcacoes-do-dia">
              <h3>Reservas neste intervalo - {countReservas}</h3>

              <h3>Reservas Minhas</h3>
              {reservasProprias.length > 0 ? (
                <ul className="marcacoes-lista">
                  {reservasProprias.map((reserva) => (
                    <li key={reserva.idReserva} className="marcacao-item">
                      <div>
                        <span>{reserva.animal.nome}</span>
                        <p className="estado-reserva">{reserva.estado}</p>
                        <p className="reserva-descricao">Data Entrada: {datanormal(reserva.dataEntrada)} e Data Saida: {datanormal(reserva.dataSaida)}</p>
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
              {animaisTutor.length > 0 ? (
                <div className="caos-grid">
                  {animaisTutor.map((animal) => (
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
                    <select
                      name="raca"
                      value={novoAnimal.raca}
                      onChange={handleNovoAnimalChange}
                      required
                    >
                      <option value="">Selecione a raça</option>
                      <option value="Labrador">Labrador</option>
                      <option value="Poodle">Poodle</option>
                      <option value="Bulldog">Bulldog</option>
                      <option value="Pastor Alemão">Pastor Alemão</option>
                      <option value="Golden Retriever">Golden Retriever</option>
                      <option value="Beagle">Beagle</option>
                      <option value="Dachshund">Dachshund</option>
                      <option value="Pug">Pug</option>
                      <option value="Shih Tzu">Shih Tzu</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                </div>

                {novoAnimal.raca === 'Outros' && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>Especifique a Raça</label>
                      <input
                        type="text"
                        value={racaCustomizada}
                        onChange={(e) => setRacaCustomizada(e.target.value)}
                        placeholder="ex: Pinscher"
                      />
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Reatividade *</label>
                    <select
                      name="reatividade"
                      value={novoAnimal.reatividade}
                      onChange={handleNovoAnimalChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="Não Reativo">Não Reativo</option>
                      <option value="Reativo">Reativo</option>
                    </select>
                </div>
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
                </div>

                <div className="form-row form-row-full">
                  <div className="form-group">
                    <label>Boletim de Vacinas (PDF)</label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setVacinasFile(e.target.files?.[0] || null)}
                    />
                    {vacinasFile && <p className="file-info">✓ {vacinasFile.name}</p>}
                  </div>
                </div>

                <button type="button" onClick={adicionarAnimal} className="btn-confirmar">
                  Registar Animal
                </button>
              </form>
            )}

            {/* Botão para criar reserva */}
            {animalSelecionado && (
              <div className="detalhes-reserva-section">
                <h3>Confirmar Reserva para {animalSelecionado.nome}</h3>
                <p><strong>Período:</strong> {new Date(dataEntrada).toLocaleDateString('pt-PT')} até {new Date(dataSaida).toLocaleDateString('pt-PT')}</p>
                <p><strong>Raça:</strong> {animalSelecionado.raca}</p>
                <p><strong>Reatividade:</strong> {animalSelecionado.reatividade}</p>
                
                {/* Seleção de Serviços */}
                <div className="servicos-section">
                  <h4>Serviços Adicionais</h4>
                  
                  <div className="form-group">
                    <label>Banhos (€20 cada)</label>
                    <input
                      type="number"
                      min="0"
                      max={calcularMaxAdicionais()}
                      value={banhos}
                      onChange={(e) => setBanhos(Math.max(0, parseInt(e.target.value) || 0))}
                      className="quantity-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Tosquias (€10 cada)</label>
                    <input
                      type="number"
                      min="0"
                      max={calcularMaxAdicionais()}
                      value={tosquias}
                      onChange={(e) => setTosquias(Math.max(0, parseInt(e.target.value) || 0))}
                      className="quantity-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Passeios (€10 cada)</label>
                    <input
                      type="number"
                      min="0"
                      max={calcularMaxAdicionais()*2}
                      value={passeios}
                      onChange={(e) => setPasseios(Math.max(0, parseInt(e.target.value) || 0))}
                      className="quantity-input"
                    />
                  </div>
                </div>

                {/* Resumo de Preço */}
                <div className="preco-resumo">
                  <p><strong>Estadia:</strong> {((new Date(dataSaida).getTime() - new Date(dataEntrada).getTime()) / (1000 * 60 * 60 * 24)).toFixed(1)} dias × €20 = €{(((new Date(dataSaida).getTime() - new Date(dataEntrada).getTime()) / (1000 * 60 * 60 * 24)) * 20).toFixed(2)}</p>
                  <p><strong>Banhos:</strong> {banhos} × €20 = €{(banhos * 20).toFixed(2)}</p>
                  <p><strong>Tosquias:</strong> {tosquias} × €10 = €{(tosquias * 10).toFixed(2)}</p>
                  <p><strong>Passeios:</strong> {passeios} × €10 = €{(passeios * 10).toFixed(2)}</p>
                  <p className="preco-total"><strong>Total: €{calcularPreco().toFixed(2)}</strong></p>
                </div>

                <button onClick={criarReserva} className="btn-criar-marcacao">
                  Confirmar Reserva - €{calcularPreco().toFixed(2)}
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MarcacoesPage;
