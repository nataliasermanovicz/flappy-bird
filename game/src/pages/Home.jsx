
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAudio } from '../context/AudioContext';

// Sprites do jogo
import bgDay from '../assets/sprites/background-day.png';
import baseImg from '../assets/sprites/base.png';
import flappyTitle from '../assets/sprites/flappy-bird.png';
import birdMid from '../assets/sprites/bird-midflap.png';
import birdUp from '../assets/sprites/bird-upflap.png';
import birdDown from '../assets/sprites/bird-downflap.png';
import playBtnImg from '../assets/sprites/play-game.png';
import rankBtnImg from '../assets/sprites/rank.png';

// Ícones
import menuBtnImg from '../assets/sprites/icons/menu.png';
import soundBtnImg from '../assets/sprites/icons/sound.png';
import muteBtnImg from '../assets/sprites/icons/mute.png';
import helpBtnImg from '../assets/sprites/icons/help.png';

// Instruções
import instrucoesImg from '../assets/sprites/instrucoes.png';

// Som
import swooshSound from '../assets/sounds/swoosh.ogg';

export default function Home() {
  const [showHelp, setShowHelp] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [birdFrame, setBirdFrame] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Configurações salvas
  const [theme, setTheme] = useState(
    () => localStorage.getItem('flappyTheme') || 'dia'
  );

  const [difficulty, setDifficulty] = useState(
    () => localStorage.getItem('flappyDifficulty') || 'medio'
  );

  const navigate = useNavigate();
  const { isMuted, toggleMute } = useAudio();

  const birdFrames = [birdUp, birdMid, birdDown];

  // Salvar tema
  useEffect(() => {
    localStorage.setItem('flappyTheme', theme);
  }, [theme]);

  // Salvar dificuldade
  useEffect(() => {
    localStorage.setItem('flappyDifficulty', difficulty);
  }, [difficulty]);

  // Animação do passarinho
  useEffect(() => {
    const interval = setInterval(() => {
      setBirdFrame((previous) => (previous + 1) % birdFrames.length);
    }, 120);

    return () => clearInterval(interval);
  }, []);

  // Fechar instruções automaticamente
  useEffect(() => {
    let timer;

    if (showHelp) {
      timer = setTimeout(() => {
        setShowHelp(false);
      }, 6000);
    }

    return () => clearTimeout(timer);
  }, [showHelp]);

  // Som dos botões
  const playSound = () => {
    if (!isMuted) {
      const audio = new Audio(swooshSound);
      audio.play().catch(() => {});
    }
  };

  // Abrir menu
  const handleMenuClick = () => {
    playSound();
    setShowMenu(true);
    setShowHelp(false);
  };

  // Fechar menu
  const handleCloseMenu = () => {
    playSound();
    setShowMenu(false);
  };

  // Ajuda
  const handleShowHelp = () => {
    playSound();
    setShowHelp(true);
  };

  // Iniciar jogo
  const handlePlayClick = (e) => {
    e.preventDefault();

    if (isFading) return;

    playSound();
    setIsFading(true);

    setTimeout(() => {
      navigate('/game');
    }, 500);
  };

  return (
    <div className="flex justify-center items-center w-screen h-dvh bg-black overflow-hidden select-none">

      <style>{`

        /* ANIMAÇÕES */

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        .animate-float {
          animation: float 0.8s ease-in-out infinite;
        }

        @keyframes scrollGround {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-scroll {
          animation: scrollGround 2.7s linear infinite;
        }

        @keyframes menuAppear {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(15px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .menu-appear {
          animation: menuAppear 0.2s steps(5) forwards;
        }

        /* FUNDO DO MENU */

        .settings-overlay {
          position: absolute;
          inset: 0;
          z-index: 40;
          background: rgba(0, 0, 0, 0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        /* PAINEL */

        .settings-panel {
          position: relative;
          width: 100%;
          max-width: 370px;
          background: #fff0b8;
          border: 5px solid #593324;
          border-radius: 9px;
          padding: 48px 18px 22px;
          box-shadow:
            0 8px 0 #352018,
            inset 0 0 0 4px #f8d88d,
            inset 0 0 0 7px #d89c54;
        }

        /* CABEÇALHO */

        .settings-header {
          position: absolute;
          top: -24px;
          left: 50%;
          transform: translateX(-50%);
          width: 72%;
          padding: 11px 8px;
          background: #f28b32;
          border: 4px solid #4c281d;
          border-radius: 7px;
          box-shadow: 0 5px 0 #68351f;
          color: white;
          text-align: center;
          font-family: monospace;
          font-size: 22px;
          font-weight: 1000;
          text-shadow: 3px 3px #64301d;
          letter-spacing: 2px;
        }

        /* TÍTULOS */

        .settings-label {
          color: #482b20;
          font-family: monospace;
          font-weight: 1000;
          font-size: clamp(15px, 4vw, 19px);
          text-align: center;
          margin-bottom: 13px;
          text-shadow: 1px 1px #e0b875;
        }

        /* BOTÕES */

        .settings-button {
          background: #fffafa;
          border: 3px solid #51332e;
          border-radius: 7px;
          color: #493026;
          font-family: monospace;
          font-weight: 1000;
          box-shadow: 0 5px 0 #a18a83;
          cursor: pointer;
          transition: transform 0.1s, background 0.1s;
        }

        .settings-button:hover {
          filter: brightness(1.08);
        }

        .settings-button:active {
          transform: translateY(4px);
          box-shadow: 0 1px 0 #a18a83;
        }

        /* BOTÃO SELECIONADO */

        .settings-button.selected {
          background: #18a9ec;
          color: white;
          border-color: #33251f;
          box-shadow:
            0 5px 0 #125b91,
            inset 0 0 0 3px #63d7ff;
          text-shadow: 2px 2px #24517b;
        }

        /* SEPARADORES */

        .settings-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 20px 0 13px;
        }

        .settings-divider::before,
        .settings-divider::after {
          content: '';
          flex: 1;
          height: 5px;
          background: #dca95f;
        }

        /* BOTÃO VOLTAR */

        .settings-back {
          width: 75%;
          height: 55px;
          margin: 25px auto 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          font-size: 17px;
        }

        /* TEMA NOTURNO */

        .night-overlay {
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          background: rgba(7, 15, 65, 0.62);
          mix-blend-mode: multiply;
        }

        @media (max-height: 600px) {
          .settings-panel {
            transform: scale(0.82);
            padding-top: 40px;
            padding-bottom: 15px;
          }

          .settings-divider {
            margin-top: 12px;
          }

          .settings-back {
            margin-top: 17px;
          }
        }

      `}</style>

      {/* CONTAINER PRINCIPAL */}

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

        {/* EFEITO DO TEMA NOTURNO */}

        {theme === 'noite' && (
          <div className="night-overlay" />
        )}

        {/* BOTÕES SUPERIORES */}

        <div
          className="w-full flex justify-between items-center z-30 shrink-0 box-border"
          style={{
            paddingLeft: '6px',
            paddingRight: '6px',
            paddingTop: '6px'
          }}
        >

          <div className="flex gap-4 items-center">

            {/* MENU */}

            <button
              onClick={handleMenuClick}
              className="w-12 h-12 hover:scale-110 active:scale-90 transition-transform bg-transparent border-none cursor-pointer p-0 shrink-0"
              aria-label="Abrir menu"
            >
              <img
                src={menuBtnImg}
                alt="Menu"
                className="w-full h-full object-contain"
              />
            </button>

            {/* SOM */}

            <button
              onClick={toggleMute}
              className="w-12 h-12 hover:scale-110 active:scale-90 transition-transform bg-transparent border-none cursor-pointer p-0 shrink-0"
              aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
            >
              <img
                src={isMuted ? muteBtnImg : soundBtnImg}
                alt="Som"
                className="w-full h-full object-contain"
              />
            </button>

          </div>

          {/* AJUDA */}

          <div className="relative flex justify-end items-center z-40 w-12 h-12">

            <button
              onClick={handleShowHelp}
              className={`w-12 h-12 hover:scale-110 active:scale-90 transition-transform bg-transparent border-none cursor-pointer p-0 shrink-0 ${
                showHelp ? 'opacity-0 pointer-events-none' : ''
              }`}
              aria-label="Ajuda"
            >
              <img
                src={helpBtnImg}
                alt="Ajuda"
                className="w-full h-full object-contain"
              />
            </button>

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

          {/* BOTÕES PLAY E RANKING */}

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

        {/* CHÃO */}

        <div className="w-full shrink-0 z-10 overflow-hidden">

          <div className="flex w-[200%] animate-scroll">

            <img src={baseImg} alt="" className="block w-1/2 h-auto" />
            <img src={baseImg} alt="" className="block w-1/2 h-auto" />

          </div>

        </div>

        {/* MENU DE CONFIGURAÇÕES */}

        {showMenu && (

          <div
            className="settings-overlay"
            onClick={handleCloseMenu}
          >

            <div
              className="settings-panel menu-appear"
              onClick={(e) => e.stopPropagation()}
            >

              {/* CABEÇALHO */}

              <div className="settings-header">
                ✦ MENU ✦
              </div>

              {/* TEMA */}

              <div className="settings-divider">
                <h2 className="settings-label mb-0">
                  Tema:
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">

                <button
                  onClick={() => {
                    playSound();
                    setTheme('dia');
                  }}
                  className={`settings-button h-[65px] text-[16px] ${
                    theme === 'dia' ? 'selected' : ''
                  }`}
                >
                  <span className="text-xl mr-2">☀</span>
                  Dia
                </button>

                <button
                  onClick={() => {
                    playSound();
                    setTheme('noite');
                  }}
                  className={`settings-button h-[65px] text-[16px] ${
                    theme === 'noite' ? 'selected' : ''
                  }`}
                >
                  <span className="text-xl mr-2">☾</span>
                  Noite
                </button>

              </div>

              {/* DIFICULDADE */}

              <div className="settings-divider">

                <h2 className="settings-label mb-0">
                  Dificuldade:
                </h2>

              </div>

              <div className="grid grid-cols-3 gap-2">

                {[
                  { id: 'facil', label: 'Fácil' },
                  { id: 'medio', label: 'Médio' },
                  { id: 'dificil', label: 'Difícil' }
                ].map((option) => (

                  <button
                    key={option.id}
                    onClick={() => {
                      playSound();
                      setDifficulty(option.id);
                    }}
                    className={`settings-button h-[62px] text-[13px] ${
                      difficulty === option.id ? 'selected' : ''
                    }`}
                  >
                    {option.label}
                  </button>

                ))}

              </div>

              {/* VOLTAR */}

              <button
                onClick={handleCloseMenu}
                className="settings-button settings-back"
              >
                <span className="text-2xl text-[#ed573b]">
                  ◀
                </span>

                Voltar
              </button>

            </div>

          </div>

        )}

        {/* TRANSIÇÃO */}

        <div
          className={`absolute inset-0 bg-black z-50 pointer-events-none transition-opacity duration-500 ${
            isFading ? 'opacity-100' : 'opacity-0'
          }`}
        />

      </div>
    </div>
  );
}
