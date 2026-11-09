
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAudio } from '../context/AudioContext';

// Importações dos sprites
import bgDay from '../assets/sprites/background-day.png';
import baseImg from '../assets/sprites/base.png';
import panelRanking from '../assets/sprites/panel-ranking.png';

// Ícones do topo
import menuBtnImg from '../assets/sprites/icons/back.png';


// Importação do som
import swooshSound from '../assets/sounds/swoosh.ogg';

export default function Ranking() {

  const navigate = useNavigate();

  // Controle global do áudio
  const { isMuted, toggleMute } = useAudio();


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

          

          {/* AJUDA */}
          <div className="relative flex justify-end items-center z-40 w-12 h-12">

        

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


        </div>

        {/* CHÃO CORRENDO */}
        <div className="w-full shrink-0 z-10 overflow-hidden">
          <div className="flex w-[200%] animate-scroll">
            <img src={baseImg} alt="" className="block w-1/2 h-auto" />
            <img src={baseImg} alt="" className="block w-1/2 h-auto" />
          </div>
        </div>

      </div>
    </div>
  );
}
