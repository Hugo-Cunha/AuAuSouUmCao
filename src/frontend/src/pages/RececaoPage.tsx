import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './RececaoPage.css';

interface Reserva {
  idReserva: string;
  dataEntrada: string;
  dataSaida: string;
  estado: string;
  animal: {
    nome: string;
    raca: string;
    tutorNif: string;
    tutor?: {
      utilizador?: { nome: string };
    };
    planoVacinal?: { documento: string; isValido: boolean };
  };
}

const RececaoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'IN' | 'OUT'>('IN');
  const [showBilling, setShowBilling] = useState(false);
  const [reservaParaPagar, setReservaParaPagar] = useState<string | null>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  
  const funcionario = { 
    nome: localStorage.getItem('user_nome') || "Funcionário", 
    perfil: localStorage.getItem('role') || "Receção" 
  };
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/reservas`);
      setReservas(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // CORREÇÃO: Função atualizada com try/catch e a Rota de Cancelar!
  const handleCheckInAction = async (id: string, accept: boolean) => {
    try {
      if (accept) {
        // Botão "S"
        await axios.patch(`${API_URL}/api/reservas/${id}/checkin`);
        alert("Check-In realizado com sucesso!");
      } else {
        // Botão "N" - Agora avisa a BD!
        await axios.patch(`${API_URL}/api/reservas/${id}/cancelar`);
        alert("Reserva cancelada e removida da lista.");
      }
      fetchData(); // Atualiza a tabela imediatamente
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Ocorreu um erro no servidor ao processar a ação.");
    }
  };

  const handleFinalizarPagamento = async () => {
    if (!reservaParaPagar) return;
    try {
      await axios.patch(`${API_URL}/api/reservas/${reservaParaPagar}/checkout`);
      alert("Pagamento e Check-OUT concluídos com sucesso!");
      setShowBilling(false);
      setReservaParaPagar(null);
      fetchData(); 
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro ao finalizar pagamento.");
    }
  };

  if (showBilling) {
    return (
      <div className="rececao-page">
        <Header userData={funcionario} />
        <div className="billing-bar">Check-OUT Pagar</div>
        <div className="rececao-card" style={{ margin: '0 25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '26px' }}>Faturação</h1>
            <div className="logo-circle" style={{ width: '100px', height: '100px', border: '2px solid #7DDFD3' }}>
              <img src="https://cdn.discordapp.com/attachments/1212044201747816518/1496523823208599603/Gemini_Generated_Image_sebx2ssebx2ssebx.png?ex=69ea31eb&is=69e8e06b&hm=e86093c99b49fbbe0b718a5942cb18caa1e6e79fdf19253b2e252c75d225bb2e" alt="Logo" />
            </div>
          </div>
          <table className="rececao-table" style={{ marginTop: '20px' }}>
            <thead>
              <tr><th>Descrição</th><th>Qtd</th><th>Preço Unitário</th><th>Valor</th></tr>
            </thead>
            <tbody>
              <tr><td>Reserva(dias)</td><td>3</td><td>25,00€</td><td>75,00€</td></tr>
              <tr><td>Banho</td><td>1</td><td>10,00€</td><td>10,00€</td></tr>
              <tr><td colSpan={2}></td><td>Imposto 23%</td><td>24,15€</td></tr>
              <tr><td colSpan={2}></td><td><strong>Total</strong></td><td><strong>129,15€</strong></td></tr>
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', margin: '20px 40px' }}>
            <button className="btn-filter" style={{ padding: '10px 30px' }} onClick={() => setShowBilling(false)}>Cancelar</button>
            <button className="btn-pagar" onClick={handleFinalizarPagamento}>PAGAR</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="rececao-page">
      <Header userData={funcionario} />
      
      <nav className="tabs-bar">
        <button className={`tab-btn ${activeTab === 'IN' ? 'active' : ''}`} onClick={() => setActiveTab('IN')}>Check-IN</button>
        <div className="tab-separator"></div>
        <button className={`tab-btn ${activeTab === 'OUT' ? 'active' : ''}`} onClick={() => setActiveTab('OUT')}>Check-OUT</button>
      </nav>

      <main className="rececao-content">
        {activeTab === 'IN' && (
          <aside className="filters-col">
            <span className="filter-label">Filtro:</span>
            <button className="btn-filter">Ord Data</button>
            <button className="btn-filter">Pre-Check-In<br/>Feito:</button>
          </aside>
        )}

        <div className="rececao-card">
          <h2>{activeTab === 'IN' ? 'Check-IN pré-feitos:' : 'Check-OUT:'}</h2>
          
          <table className="rececao-table">
            <thead>
              {activeTab === 'IN' ? (
                <tr><th>Nome</th><th>Ficha Tecnica</th><th>Pre-Check-IN</th><th>Operações</th></tr>
              ) : (
                <tr><th>Nome</th><th>Nome do Dono</th><th>Dia de Saida</th><th>Confirmar Saida</th></tr>
              )}
            </thead>
            <tbody>
              {reservas.filter(r => activeTab === 'IN' ? r.estado === 'Pendente' : r.estado === 'CheckIn').map((r, i) => (
                <tr key={i}>
                  {activeTab === 'IN' ? (
                    <>
                      <td>{r.animal.nome}</td>
                      <td>
                        {r.animal.planoVacinal?.documento ? (
                           <a href={`${API_URL}${r.animal.planoVacinal.documento}`} target="_blank" style={{color: '#17a2b8'}}>ver_pdf</a>
                        ) : "Sem Ficha"}
                      </td>
                      <td>{r.animal.planoVacinal?.isValido ? "Sim" : "Não"}</td>
                      <td>
                        <button className="btn-s" onClick={() => handleCheckInAction(r.idReserva, true)}>S</button>
                        <button className="btn-n" onClick={() => handleCheckInAction(r.idReserva, false)}>N</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{r.animal.nome}</td>
                      <td>{r.animal.tutor?.utilizador?.nome || 'Dono não encontrado'}</td>
                      <td>{new Date(r.dataSaida).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className="btn-pagar" 
                          onClick={() => {
                            setReservaParaPagar(r.idReserva); 
                            setShowBilling(true);
                          }}
                        >
                          Pagar
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            {activeTab === 'IN' ? (
              <>
                <span style={{ marginRight: '15px' }}>Check-IN presenciais:</span>
                <button className="btn-filter" style={{ borderRadius: '20px', padding: '10px 30px' }}>Começar</button>
              </>
            ) : (
              <button className="btn-filter" style={{ backgroundColor: '#FFF', border: '1px solid #BBBBBB' }}>Em caso de Emergência</button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RececaoPage;