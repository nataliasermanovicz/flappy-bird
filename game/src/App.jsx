import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Ranking from './pages/Ranking';
// import Login from './pages/Login';
// import Cadastro from './pages/Cadastro';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/ranking" element={<Ranking />} />
        {/* Adicione as rotas de autenticação depois */}
        <Route path="*" element={<div>Página não encontrada (Erro 404)</div>} />
      </Routes>
    </Router>
  );
}