import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PortalTutor from './pages/PortalTutor';     
import DiarioBordoPage from './pages/DiarioBordoPage'; 
import MarcacoesPage from './pages/MarcacoesPage';
import RececaoPage from './pages/RececaoPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/criar-conta" element={<RegisterPage />} />
        
        {/* ROTAS DO TUTOR */}
        <Route path="/tutor" element={<PortalTutor />} />
        <Route path="/tutor/marcacoes" element={<MarcacoesPage />} />
        
        {/* NOVA ROTA DINÂMICA: Agora aceita o ID do animal! */}
        <Route path="/tutor/diario/:idAnimal" element={<DiarioBordoPage />} />
        <Route path="/rececao" element={<RececaoPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;