import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PortalTutor from './pages/PortalTutor';   
import DiarioBordoPage from './pages/DiarioBordoPage';
import MarcacoesPage from './pages/MarcacoesPage'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/criar-conta" element={<RegisterPage />} />
        
        {/* NOVAS ROTAS DO TUTOR */}
        <Route path="/tutor" element={<PortalTutor />} />
        <Route path="/tutor/diario" element={<DiarioBordoPage />} />
        <Route path="/tutor/marcacoes" element={<MarcacoesPage />} />
        
        {/* Rota antiga do staff (podes manter ou apagar se já não usares) */}
        <Route path="/staff" element={<DiarioBordoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;