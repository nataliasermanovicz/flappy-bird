import { Link } from 'react-router-dom';

// Importações dos seus sprites
import bgDay from '../assets/sprites/background-day.png';
import baseImg from '../assets/sprites/base.png';
import flappyTitle from '../assets/sprites/flappy-bird.png';
import birdMid from '../assets/sprites/bird-midflap.png';
import playBtnImg from '../assets/sprites/play-game.png';
import rankBtnImg from '../assets/sprites/rank.png';

export default function Home() {
  return (
    <div className="game-container">
      <div 
        className="relative flex flex-col justify-between overflow-hidden"
        style={{
          height: '100vh',
          aspectRatio: '300 / 500',
          backgroundImage: `url(${bgDay})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'top center'
        }}
      >
        {/* Área do céu (flex-1 para ocupar todo o espaço acima do chão e centralizar os elementos) */}
        <div className="flex-1 flex flex-col items-center justify-center gap-12 z-10">
          
          {/* Título + Passarinho */}
          <div className="flex items-center justify-center gap-2">
            <img 
              src={flappyTitle} 
              alt="Flappy Bird" 
              className="w-[178px] h-[66px] drop-shadow-md select-none"
            />
            <img 
              src={birdMid} 
              alt="Bird" 
              className="w-8 h-auto animate-bounce select-none"
            />
          </div>

          {/* Botões Play e Ranking */}
          <div className="flex gap-4">
            <Link to="/game" className="hover:scale-105 active:scale-95 transition-transform">
              <img 
                src={playBtnImg} 
                alt="Iniciar Jogo" 
                className="h-14 w-auto cursor-pointer select-none drop-shadow"
              />
            </Link>

            <Link to="/ranking" className="hover:scale-105 active:scale-95 transition-transform">
              <img 
                src={rankBtnImg} 
                alt="Ver Ranking" 
                className="h-14 w-auto cursor-pointer select-none drop-shadow"
              />
            </Link>
          </div>

        </div>

        {/* Chão mantido a 22.4% da altura */}
        <div 
          className="w-full shrink-0 z-10"
          style={{
            height: '22.4%',
            backgroundImage: `url(${baseImg})`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%',
            backgroundPosition: 'left top'
          }}
        />
      </div>
    </div>
  );
}