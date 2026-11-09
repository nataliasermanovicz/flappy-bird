import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Importações dos sprites
import bgDay from '../assets/sprites/background-day.png';
import baseImg from '../assets/sprites/base.png';
import flappyTitle from '../assets/sprites/flappy-bird.png';
import birdMid from '../assets/sprites/bird-midflap.png';
import playBtnImg from '../assets/sprites/play-game.png';
import rankBtnImg from '../assets/sprites/rank.png';

// Ícones do topo
import menuBtnImg from '../assets/sprites/icons/menu.png';
import soundBtnImg from '../assets/sprites/icons/sound.png';
import helpBtnImg from '../assets/sprites/icons/help.png';

// Instruções
import instrucoesImg from '../assets/sprites/instrucoes.png';

export default function Home() {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    let timer;

    if (showHelp) {
      timer = setTimeout(() => {
        setShowHelp(false);
      }, 6000);
    }

    return () => clearTimeout(timer);
  }, [showHelp]);

  const handleShowHelp = () => {
    setShowHelp(true);
  };

  return (
    <div className="flex justify-center items-center w-screen h-dvh bg-black overflow-hidden select-none">

      {/* CONTAINER PRINCIPAL DO JOGO */}
      <div
        className="relative flex flex-col overflow-hidden shadow-2xl box-border"
        style={{
          width: 'min(100vw, 60dvh)',
          height: 'min(100dvh, 166.6667vw)',
          aspectRatio: '3 / 5',
          backgroundImage: `url(${bgDay})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >

        {/* BOTÕES SUPERIORES (Espaçamento aumentado para pt-12 e px-10) */}
<div
  className="w-full pt-12 flex justify-between items-center z-30 shrink-0 box-border"
  style={{
    paddingLeft: '6px',
    paddingRight: '6px',
    paddingTop: '6px'
  }}
>          {/* MENU E SOM */}
          <div className="flex gap-4 items-center">

            <button
              className="w-8 h-8 hover:scale-110 active:scale-90 transition-transform bg-transparent border-none cursor-pointer p-0 shrink-0"
              aria-label="Menu"
            >
              <img
                src={menuBtnImg}
                alt="Menu"
                className="w-full h-full object-contain"
              />
            </button>

            <button
              className="w-8 h-8 hover:scale-110 active:scale-90 transition-transform bg-transparent border-none cursor-pointer p-0 shrink-0"
              aria-label="Som"
            >
              <img
                src={soundBtnImg}
                alt="Som"
                className="w-full h-full object-contain"
              />
            </button>

          </div>

          {/* AJUDA */}
          <div className="flex justify-end items-center z-30">

            {showHelp ? (
              <img
                src={instrucoesImg}
                alt="Instruções"
                className="w-36 h-auto object-contain drop-shadow-md animate-fade-in"
              />
            ) : (
              <button
                onClick={handleShowHelp}
                className="w-8 h-8 hover:scale-110 active:scale-90 transition-transform bg-transparent border-none cursor-pointer p-0 shrink-0"
                aria-label="Ajuda"
              >
                <img
                  src={helpBtnImg}
                  alt="Ajuda"
                  className="w-full h-full object-contain"
                />
              </button>
            )}

          </div>
        </div>

        {/* ÁREA CENTRAL */}
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-8 z-10 w-full">

          {/* TÍTULO E PASSARINHO */}
          <div className="flex items-center justify-center gap-3 w-full px-4">

            <img
              src={flappyTitle}
              alt="Flappy Bird"
              className="w-[190px] sm:w-[210px] h-auto drop-shadow-md"
            />

            <img
              src={birdMid}
              alt="Bird"
              className="w-9 sm:w-10 h-auto animate-bounce"
            />

          </div>

          {/* BOTÕES PLAY E RANKING */}
          <div className="flex gap-4 w-full justify-center px-4">

            <Link
              to="/game"
              className="w-[115px] hover:scale-105 active:scale-95 transition-transform outline-none flex justify-center"
            >
              <img
                src={playBtnImg}
                alt="Iniciar Jogo"
                className="w-full h-auto cursor-pointer"
              />
            </Link>

            <Link
              to="/ranking"
              className="w-[115px] hover:scale-105 active:scale-95 transition-transform outline-none flex justify-center"
            >
              <img
                src={rankBtnImg}
                alt="Ver Ranking"
                className="w-full h-auto cursor-pointer"
              />
            </Link>

          </div>
        </div>

        {/* CHÃO */}
        <div className="w-full shrink-0 z-10 overflow-hidden">
          <img
            src={baseImg}
            alt=""
            className="block w-full h-auto"
          />
        </div>

      </div>
    </div>
  );
}