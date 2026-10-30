import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-cyan-300">
      <h1 className="text-4xl font-bold text-white mb-8 drop-shadow-md">Flappy Bird</h1>
      
      <div className="flex gap-4">
        {/* Link redireciona para a rota /game onde o Canvas será montado */}
        <Link to="/game" className="px-6 py-2 bg-green-500 text-white font-bold rounded shadow-lg border-2 border-green-700">
          PLAY
        </Link>
        
        {/* Link redireciona para a rota /ranking */}
        <Link to="/ranking" className="px-6 py-2 bg-orange-400 text-white font-bold rounded shadow-lg border-2 border-orange-600">
          RANKING
        </Link>
      </div>
    </div>
  );
}