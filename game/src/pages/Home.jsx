import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Importações dos seus sprites
import bgDay from '../assets/sprites/background-day.png';
import baseImg from '../assets/sprites/base.png';
import flappyTitle from '../assets/sprites/flappy-bird.png';
import birdMid from '../assets/sprites/bird-midflap.png';
import playBtnImg from '../assets/sprites/play-game.png';
import rankBtnImg from '../assets/sprites/rank.png';

// Importações dos novos botões do topo
import menuBtnImg from '../assets/sprites/icons/menu.png'; 
import soundBtnImg from '../assets/sprites/icons/sound.png'; 
import helpBtnImg from '../assets/sprites/icons/help.png'; 

// Importação da imagem de instruções
import instrucoesImg from '../assets/sprites/instrucoes.png';

export default function Home() {
  // Estado para controlar a visibilidade das instruções
  const [showHelp, setShowHelp] = useState(false);

  // Efeito que cria o temporizador de 6 segundos
  useEffect(() => {
    let timer;
    if (showHelp) {
      // Se showHelp for true, conta 6 segundos e muda para false
      timer = setTimeout(() => {
        setShowHelp(false);
      }, 6000);
    }
    // Limpeza do timer caso o componente seja desmontado antes de dar os 6 seg
    return () => clearTimeout(timer);
  }, [showHelp]);

  // Função para ativar as instruções
  const handleShowHelp = () => {
    setShowHelp(true);
  };

  return (
    <div className="game-container flex justify-center items-center min-h-screen bg-black">
      <div 
        className="relative flex flex-col justify-between overflow-hidden"
        style={{
          height: '100vh',          
          maxHeight: '1080px',      
          aspectRatio: '300 / 500', 
          backgroundImage: `url(${bgDay})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'top center'
        }}
      >
        {/* BOTÕES DO TOPO (Menu, Som, Ajuda) */}
        <div className="absolute top-[3%] left-0 w-full px-[5%] flex justify-between z-30">
          <div className="flex gap-[15%] w-[25%]">
            <button className="w-full hover:scale-110 active:scale-90 transition-transform bg-transparent border-none cursor-pointer p-0">
              <img src={menuBtnImg} alt="Menu" className="w-full h-auto object-contain" />
            </button>
            <button className="w-full hover:scale-110 active:scale-90 transition-transform bg-transparent border-none cursor-pointer p-0">
              <img src={soundBtnImg} alt="Som" className="w-full h-auto object-contain" />
            </button>
          </div>
          
          {/* Container para a área direita do topo (Renderiza Instruções OU Botão Help) */}
          <div className="flex items-start justify-end flex-1 pl-[5%]">
            {showHelp ? (
              <img 
                src={instrucoesImg} 
                alt="Instruções" 
                // Ajuste o w-[80%] caso ache que a imagem ficou muito grande ou pequena
                className="w-[80%] max-w-[180px] h-auto object-contain drop-shadow-md animate-fade-in"
              />
            ) : (
              <button 
                onClick={handleShowHelp}
                className="w-[15%] min-w-[25px] hover:scale-110 active:scale-90 transition-transform bg-transparent border-none cursor-pointer p-0"
              >
                <img src={helpBtnImg} alt="Ajuda" className="w-full h-auto object-contain" />
              </button>
            )}
          </div>
        </div>

        {/* Área Central */}
        <div className="flex-1 flex flex-col items-center justify-center gap-[12%] z-10 pt-[15%]">
          
          {/* Título + Passarinho */}
          <div className="flex items-center justify-center gap-[2%] w-full px-[15%]">
            <img 
              src={flappyTitle} 
              alt="Flappy Bird" 
              className="w-[75%] h-auto drop-shadow-md select-none bg-transparent"
            />
            <img 
              src={birdMid} 
              alt="Bird" 
              className="w-[15%] h-auto animate-bounce select-none bg-transparent"
            />
          </div>

          {/* Botões Play e Ranking */}
          <div className="flex gap-[5%] w-[70%] justify-center">
            <Link to="/game" className="w-[47%] hover:scale-105 active:scale-95 transition-transform outline-none flex justify-center">
              <img 
                src={playBtnImg} 
                alt="Iniciar Jogo" 
                className="w-full h-auto cursor-pointer select-none bg-transparent"
              />
            </Link>

            <Link to="/ranking" className="w-[47%] hover:scale-105 active:scale-95 transition-transform outline-none flex justify-center">
              <img 
                src={rankBtnImg} 
                alt="Ver Ranking" 
                className="w-full h-auto cursor-pointer select-none bg-transparent"
              />
            </Link>
          </div>

        </div>

        {/* Chão */}
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