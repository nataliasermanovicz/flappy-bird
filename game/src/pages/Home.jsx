
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAudio } from '../context/AudioContext';

// Importações dos sprites
import bgDay from '../assets/sprites/background-day.png';
import baseImg from '../assets/sprites/base.png';
import flappyTitle from '../assets/sprites/flappy-bird.png';
import birdMid from '../assets/sprites/bird-midflap.png';
import birdUp from '../assets/sprites/bird-upflap.png';
import birdDown from '../assets/sprites/bird-downflap.png';
import playBtnImg from '../assets/sprites/play-game.png';
import rankBtnImg from '../assets/sprites/rank.png';

// Ícones do topo
import menuBtnImg from '../assets/sprites/icons/menu.png';
import soundBtnImg from '../assets/sprites/icons/sound.png';
import muteBtnImg from '../assets/sprites/icons/mute.png';
import helpBtnImg from '../assets/sprites/icons/help.png';

// Instruções
import instrucoesImg from '../assets/sprites/instrucoes.png';

// Importação do som
import swooshSound from '../assets/sounds/swoosh.ogg';

export default function Home() {
  const [showHelp, setShowHelp] = useState(false);
  const [birdFrame, setBirdFrame] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const navigate = useNavigate();

  // Controle global do áudio
  const { isMuted, toggleMute } = useAudio();

  // Frames de animação do passarinho
  const birdFrames = [birdUp, birdMid, birdDown];

  // Animação contínua das asas
  useEffect(() => {
    const interval = setInterval(() => {
      setBirdFrame((previous) => (previous + 1) % birdFrames.length);
    }, 120);

    return () => clearInterval(interval);
  }, []);

  // Fechar instruções automaticamente após 6 segundos
  useEffect(() => {
    let timer;

    if (showHelp) {
      timer = setTimeout(() => {
        setShowHelp(false);
      }, 6000);
    }

    return () => clearTimeout(timer);
  }, [showHelp]);

  // Exibir instruções
  const handleShowHelp = () => {
    if (!isMuted) {
      const audio = new Audio(swooshSound);
      audio.play();
    }

    setShowHelp(true);
  };

  // Iniciar jogo
  const handlePlayClick = (e) => {
    e.preventDefault();

    // Evita múltiplos cliques se a transição já começou
    if (isFading) return;

    // Reproduzir som apenas se o áudio estiver ativado
    if (!isMuted) {
      const audio = new Audio(swooshSound);
      audio.play();
    }

    // Ativa o escurecimento da tela
    setIsFading(true);

    // Aguarda 500ms e muda de página
    setTimeout(() => {
      navigate('/game');
    }, 500);
  };

  return (
    <div className="flex justify-center items-center w-screen h-dvh bg-black overflow-hidden select-none">

      {/* ESTILOS CSS PARA AS ANIMAÇÕES DA HOME */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }

          .animate-float {
            animation: float 0.8s ease-in-out infinite;
          }

          @keyframes scrollGround {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }

          .animate-scroll {
            animation: scrollGround 2.7s linear infinite;
          }
        `}
      </style>

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

        {/* BOTÕES SUPERIORES */}
        <div
          className="w-full pt-12 flex justify-between items-center z-30 shrink-0 box-border"
          style={{
            paddingLeft: '6px',
            paddingRight: '6px',
            paddingTop: '6px'
          }}
        >

          {/* MENU E SOM */}
          <div className="flex gap-4 items-center">

            <button
              className="w-12 h-12 hover:scale-110 active:scale-90 transition-transform bg-transparent border-none cursor-pointer p-0 shrink-0"
              aria-label="Menu"
            >
              <img
                src={menuBtnImg}
                alt="Menu"
                className="w-full h-full object-contain"
              />
            </button>

            {/* BOTÃO DE SOM */}
            <button
              onClick={toggleMute}
              className="w-12 h-12 hover:scale-110 active:scale-90 transition-transform bg-transparent border-none cursor-pointer p-0 shrink-0"
              aria-label={isMuted ? "Ativar som" : "Desativar som"}
            >
              <img
                src={isMuted ? muteBtnImg : soundBtnImg}
                alt={isMuted ? "Som desligado" : "Som ligado"}
                className="w-full h-full object-contain"
              />
            </button>

          </div>

          {/* AJUDA */}
          <div className="relative flex justify-end items-center z-40 w-12 h-12">

            {/* BOTÃO DE AJUDA */}
            <button
              onClick={handleShowHelp}
              className={`w-12 h-12 hover:scale-110 active:scale-90 transition-transform bg-transparent border-none cursor-pointer p-0 shrink-0 ${
                showHelp ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              aria-label="Ajuda"
            >
              <img
                src={helpBtnImg}
                alt="Ajuda"
                className="w-full h-full object-contain"
              />
            </button>

            {/* IMAGEM DE INSTRUÇÕES */}
            <img
              src={instrucoesImg}
              alt="Instruções"
              className={`absolute top-0 right-0 w-52 sm:w-60 max-w-[80vw] h-auto object-contain drop-shadow-md transition-all duration-500 ease-out ${
                showHelp
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-[110%] opacity-0 pointer-events-none'
              }`}
            />

          </div>
        </div>

        {/* ÁREA CENTRAL */}
        <div className="flex-1 min-h-0 flex flex-col items-center relative z-10 w-full">

          {/* TÍTULO E PASSARINHO */}
          <div className="absolute top-[35%] flex items-center justify-center gap-4 w-full px-3 animate-float">
            <img
              src={flappyTitle}
              alt="Flappy Bird"
              className="w-[240px] sm:w-[270px] h-auto drop-shadow-md"
            />

            <img
              src={birdFrames[birdFrame]}
              alt="Bird"
              className="w-12 sm:w-14 h-auto"
            />
          </div>

          {/* BOTÕES PLAY E RANKING PRÓXIMOS AO CHÃO */}
          <div className="absolute bottom-[3%] flex gap-5 w-full justify-center px-4">

            <Link
              to="/game"
              onClick={handlePlayClick}
              className="w-[125px] sm:w-[135px] hover:scale-105 active:scale-95 transition-transform outline-none flex justify-center"
            >
              <img
                src={playBtnImg}
                alt="Iniciar Jogo"
                className="w-full h-auto cursor-pointer"
              />
            </Link>

            <Link
              to="/ranking"
              className="w-[125px] sm:w-[135px] hover:scale-105 active:scale-95 transition-transform outline-none flex justify-center"
            >
              <img
                src={rankBtnImg}
                alt="Ver Ranking"
                className="w-full h-auto cursor-pointer"
              />
            </Link>

          </div>
        </div>

        {/* CHÃO CORRENDO */}
        <div className="w-full shrink-0 z-10 overflow-hidden">
          <div className="flex w-[200%] animate-scroll">
            <img src={baseImg} alt="" className="block w-1/2 h-auto" />
            <img src={baseImg} alt="" className="block w-1/2 h-auto" />
          </div>
        </div>

        {/* CAMADA DE TRANSIÇÃO (OVERLAY ESCURO) */}
        <div
          className={`absolute inset-0 bg-black z-50 pointer-events-none transition-opacity duration-500 ${
            isFading ? 'opacity-100' : 'opacity-0'
          }`}
        ></div>

      </div>
    </div>
  );
}
