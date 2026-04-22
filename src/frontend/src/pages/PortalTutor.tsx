import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- 1. Nova Importação
import Header from '../components/Header';
import Footer from '../components/Footer';
import './PortalTutor.css';

interface RegistoDiario {
    dataHora: string;
    descricao: string;
    fotoUrl: string;
}

interface HistorialAnimal {
    idAnimal: string;
    nome: string;
    estadoClinico: string;
    diarioBordo: RegistoDiario[];
}

const PortalTutor: React.FC = () => {
    const [historial, setHistorial] = useState<HistorialAnimal | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
    const navigate = useNavigate(); // <-- 2. Inicializar o Navegador

    const utilizadorAtual = {
        nome: localStorage.getItem('user_nome') || "Utilizador",
        nif: localStorage.getItem('user_nif') || "---",
        telemovel: localStorage.getItem('user_telemovel') || "---"
    };

    useEffect(() => {
        const fetchHistorial = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                const resposta = await axios.get(`${API_URL}/api/animais/A-789/historial`);
                setHistorial(resposta.data);
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistorial();
    }, []);

    // 3. Função para evitar que clicar no botão "Ver Fotos" dispare o clique do cartão todo
    const handleVerFotosClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Impede que o clique "vaze" para o cartão principal
        alert("Em breve: Galeria de Fotos!");
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
            <Header userData={utilizadorAtual} />

            <main className="tutor-main-section">
                
                {/* 2A. CARD ESQUERDO */}
                <div className="tutor-card card-left" onClick={() => navigate('/tutor/marcacoes')}>
                    <h2 className="tutor-card-title">Marcação e Reserva</h2>
                    <img 
                      src="https://img.freepik.com/free-vector/appointment-booking-with-calendar_23-2148556782.jpg" 
                      alt="Calendário e Reserva" 
                    />
                </div>

                {/* 2B. CARD DIREITO (AGORA CLICÁVEL!) */}
                {/* 4. Adicionamos o onClick aqui para navegar para a página completa */}
                <div className="tutor-card card-right" onClick={() => navigate('/tutor/diario')}>
                    <h2 className="tutor-card-title">Diário de Bordo</h2>
                    
                    {loading ? (
                        <p style={{ textAlign: 'center' }}>A carregar dados do hóspede...</p>
                    ) : historial ? (
                        <>
                            <div className="animal-details-subcard">
                                <div className="details-col">
                                    <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Detalhes do Animal:</span>
                                    <span>Nome: {historial.nome}</span>
                                    <span>Estado: {historial.estadoClinico}</span>
                                    <span>To-do: Banho | Passeio</span>
                                </div>
                                <div className="details-col">
                                    <span>Alimentação: Responsivo</span>
                                    <span>Comportamento: Positivo</span>
                                </div>
                                <div>
                                    <button className="btn-fotos" onClick={handleVerFotosClick}>
                                        Ver Fotos<br/>Tiradas
                                    </button>
                                </div>
                            </div>

                            <div className="tasks-area">
                                {historial.diarioBordo.map((registo, index) => {
                                    const corIndicador = index % 2 === 0 ? '#27AE60' : '#F1C40F'; 
                                    const dataFormatada = new Date(registo.dataHora).toLocaleString('pt-PT', {
                                        hour: '2-digit', minute: '2-digit', second: '2-digit',
                                        day: '2-digit', month: '2-digit', year: 'numeric'
                                    });

                                    return (
                                        <div className="task-item" key={index}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ fontSize: '12px' }}>
                                                    <strong>Registo:</strong> {dataFormatada} -- Comportamento: Positivo
                                                </span>
                                                <span style={{ fontSize: '12px' }}>
                                                    <strong>Nota:</strong> {registo.descricao}
                                                </span>
                                            </div>
                                            <div className="status-indicator" style={{ backgroundColor: corIndicador }}></div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <p style={{ textAlign: 'center', color: 'red' }}>Erro ao carregar o Diário.</p>
                    )}
                </div>

            </main>

            <hr className="separator" />
            <Footer />
        </div>
    );
};

export default PortalTutor;