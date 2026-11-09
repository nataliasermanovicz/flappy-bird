import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Ranking from './pages/Ranking';

import { AudioProvider } from './context/AudioContext';

export default function App() {
  return (
    <Router>
      <AudioProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route
            path="*"
            element={<div>Página não encontrada (Erro 404)</div>}
          />
        </Routes>
      </AudioProvider>
    </Router>
  );
}