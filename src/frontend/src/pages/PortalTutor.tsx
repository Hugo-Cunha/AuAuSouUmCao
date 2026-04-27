import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './PortalTutor.css';

interface Animal {
    idAnimal: string;
    nome: string;
    estado: string;
    tutorNif: string;
}

interface Reserva {
    idReserva: string;
    estado: string;
    animalId: string;
    animal: Animal;
    dataEntrada: string;
    dataSaida: string;
}

const PortalTutor: React.FC = () => {
    const [reservasAtivas, setReservasAtivas] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const utilizador = {
        nome: localStorage.getItem('user_nome') || "Utilizador",
        nif: localStorage.getItem('user_nif') || "---",
        telemovel: localStorage.getItem('user_telemovel') || "---",
        perfil: localStorage.getItem('role') || "Tutor" // <-- ADICIONA ISTO
    };

    useEffect(() => {
        const fetchDados = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                
                // Vai buscar todas as reservas
                const res = await axios.get(`${API_URL}/api/reservas`);
                const todasAsReservas: Reserva[] = res.data;

                // Filtra para mostrar APENAS as reservas do Tutor logado que estão em "CheckIn"
                const filtradas = todasAsReservas.filter(r => 
                    r.animal.tutorNif === utilizador.nif && 
                    r.estado === 'CheckIn'
                );

                setReservasAtivas(filtradas);
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDados();
    }, [utilizador.nif]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
            <Header userData={utilizador} />

            <main className="tutor-main-section">
                
                {/* CARD ESQUERDO: Marcações */}
                <div className="tutor-card card-left" onClick={() => navigate('/tutor/marcacoes')} style={{ cursor: 'pointer' }}>
                    <h2 className="tutor-card-title">Marcação e Reserva</h2>
                    <img 
                      src="https://img.freepik.com/free-vector/appointment-booking-with-calendar_23-2148556782.jpg" 
                      alt="Reservas" 
                    />
                </div>

                {/* CARD DIREITO: Hóspedes Ativos (Diário de Bordo) */}
                <div className="tutor-card card-right">
                    <h2 className="tutor-card-title">Hóspedes Ativos</h2>
                    
                    {loading ? (
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>A verificar estadias...</p>
                    ) : reservasAtivas.length > 0 ? (
                        <div className="tasks-area" style={{ marginTop: '20px' }}>
                            {reservasAtivas.map(reserva => (
                                <div 
                                    key={reserva.idReserva} 
                                    className="task-item"
                                    onClick={() => navigate(`/tutor/diario/${reserva.animalId}`)}
                                    style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid #7DDFD3' }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                            {reserva.animal.nome}
                                        </span>
                                        <span style={{ fontSize: '12px', color: '#555' }}>
                                            Estadia: {new Date(reserva.dataEntrada).toLocaleDateString()} a {new Date(reserva.dataSaida).toLocaleDateString()}
                                        </span>
                                        <span style={{ fontSize: '13px', color: '#27AE60', fontWeight: 'bold', marginTop: '5px' }}>
                                            Ver Diário de Bordo ➜
                                        </span>
                                    </div>
                                    <div className="status-indicator" style={{ backgroundColor: '#27AE60' }}></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: '40px', padding: '0 20px' }}>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1A1A1A' }}>Nenhum patudo hospedado de momento.</p>
                            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>O diário de bordo ficará disponível aqui assim que o check-in for realizado na nossa receção.</p>
                        </div>
                    )}
                </div>

            </main>

            <hr className="separator" />
            <Footer />
        </div>
    );
};

export default PortalTutor;