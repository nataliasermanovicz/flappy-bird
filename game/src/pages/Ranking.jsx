
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../context/AudioContext';

// Sprites
import bgDay from '../assets/sprites/background-day.png';
import bgNight from '../assets/sprites/background-night.png';
import baseImg from '../assets/sprites/base.png';
import playBtnImg from '../assets/sprites/play-game.png';
import newImg from '../assets/sprites/new.png';

// Som
import swooshSound from '../assets/sounds/swoosh.ogg';

export default function Ranking() {
  const navigate = useNavigate();
  const { isMuted } = useAudio();

  const [isFading, setIsFading] = useState(false);

  // Recuperar tema selecionado na Home
  const selectedTheme = localStorage.getItem('flappyTheme') || 'dia';

  const backgroundImg = selectedTheme === 'noite'
    ? bgNight
    : bgDay;

  // Recuperar e ordenar pontuações
  const [scores] = useState(() => {
    try {
      const savedScores = JSON.parse(
        localStorage.getItem('ranking') || '[]'
      );

      return [...savedScores].sort(
        (a, b) => Number(b.score) - Number(a.score)
      );

    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
      return [];
    }
  });

  // Calcular recorde pessoal
  const bestScore = scores.length > 0
    ? Math.max(
        ...scores.map(item => Number(item.score) || 0)
      )
    : 0;

  // Marcar pontuações como visualizadas
  useEffect(() => {
    try {
      const savedScores = JSON.parse(
        localStorage.getItem('ranking') || '[]'
      );

      const updatedScores = savedScores.map(item => ({
        ...item,
        isNew: false
      }));

      localStorage.setItem(
        'ranking',
        JSON.stringify(updatedScores)
      );

    } catch (error) {
      console.error('Erro ao atualizar ranking:', error);
    }
  }, []);

  // Som dos botões
  const playSound = () => {
    if (!isMuted) {
      const audio = new Audio(swooshSound);
      audio.play().catch(() => {});
    }
  };

  // Voltar para Home
  const handlePlayClick = () => {
    if (isFading) return;

    playSound();

    setIsFading(true);

    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  return (
    <div className="flex justify-center items-center w-screen h-dvh bg-black overflow-hidden select-none">

      {/* ESTILOS */}
      <style>
        {`
          @keyframes scrollGround {
            0% {
              transform: translateX(0%);
            }

            100% {
              transform: translateX(-50%);
            }
          }

          .animate-scroll {
            animation: scrollGround 2.7s linear infinite;
          }

          /* SCROLLBAR */
          .ranking-scroll::-webkit-scrollbar {
            width: 5px;
          }

          .ranking-scroll::-webkit-scrollbar-track {
            background: rgba(139, 84, 46, 0.15);
            border-radius: 10px;
          }

          .ranking-scroll::-webkit-scrollbar-thumb {
            background: #a77a42;
            border-radius: 10px;
          }

          .ranking-scroll {
            scrollbar-width: thin;
            scrollbar-color: #a77a42 transparent;
          }

          /* ANIMAÇÃO DO PAINEL */
          @keyframes rankingAppear {
            from {
              opacity: 0;
              transform: scale(0.8) translateY(15px);
            }

            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .ranking-appear {
            animation: rankingAppear 0.3s steps(6) forwards;
          }

          /* PAINEL */
          .ranking-panel {
            position: relative;
            width: 100%;
            max-width: 370px;
            height: 100%;
            max-height: 390px;
            background: #fff0b8;
            border: 5px solid #593324;
            border-radius: 9px;
            padding: 48px 18px 22px;
            box-shadow:
              0 8px 0 #352018,
              inset 0 0 0 4px #f8d88d,
              inset 0 0 0 7px #d89c54;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
          }

          /* CABEÇALHO */
          .ranking-header {
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
            z-index: 2;
          }

          /* TÍTULO DA LISTA */
          .ranking-label {
            color: #482b20;
            font-family: monospace;
            font-weight: 1000;
            font-size: clamp(13px, 3.5vw, 17px);
            text-align: center;
            margin-bottom: 13px;
            text-shadow: 1px 1px #e0b875;
            flex-shrink: 0;
          }

          /* SEPARADOR */
          .ranking-divider {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 5px 0 13px;
          }

          .ranking-divider::before,
          .ranking-divider::after {
            content: '';
            flex: 1;
            height: 5px;
            background: #dca95f;
          }

          /* RECORD */
          .ranking-record {
            color: #80502c;
            font-family: monospace;
            font-weight: 1000;
            font-size: 13px;
            text-align: center;
            margin-top: 12px;
            flex-shrink: 0;
          }

          /* BOTÃO VOLTAR */
          .ranking-back {
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

          .ranking-back:hover:not(:disabled) {
            filter: brightness(1.08);
          }

          .ranking-back:active:not(:disabled) {
            transform: translateY(4px);
            box-shadow: 0 1px 0 #a18a83;
          }

          @media (max-height: 600px) {
            .ranking-panel {
              max-height: 340px;
              padding-top: 40px;
              padding-bottom: 15px;
            }

            .ranking-divider {
              margin-top: 3px;
              margin-bottom: 8px;
            }

            .ranking-record {
              margin-top: 7px;
            }
          }
        `}
      </style>

      {/* CONTAINER PRINCIPAL */}
      <div
        className="relative flex flex-col overflow-hidden shadow-2xl box-border"
        style={{
          width: 'min(100vw, 60dvh)',
          height: 'min(100dvh, 166.6667vw)',
          aspectRatio: '3 / 5',
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >

        {/* ÁREA CENTRAL */}
        <div className="flex-1 min-h-0 flex flex-col items-center relative z-10 w-full">


          {/* PAINEL DE RANKING */}
          <div className="absolute top-[25%] w-[85%] h-[48%] ranking-appear">

            <div className="ranking-panel">

              {/* CABEÇALHO */}
              <div className="ranking-header">
                RANKING
              </div>

              {/* TÍTULO DA LISTA */}
              <div className="ranking-divider">

                <h2 className="ranking-label mb-0">
                  MELHORES PONTUAÇÕES
                </h2>

              </div>

              {/* LISTA DE PONTUAÇÕES */}
              <div className="flex-1 min-h-0 overflow-y-auto ranking-scroll">

                {scores.length > 0 ? (

                  scores.map((item, index) => (

                    <div
                      key={item.id || index}
                      className="flex justify-between items-center px-2 py-2 border-b border-[#b9a76a]/40"
                    >

                      {/* POSIÇÃO E NOME */}
                      <span className="text-[#70401f] font-bold text-xs sm:text-sm truncate">
                        {index + 1}　{item.name || 'Você'}
                      </span>

                      {/* PONTUAÇÃO E NEW */}
                      <div className="flex items-center justify-end gap-1 shrink-0 ml-2">

                        <span className="text-[#70401f] font-bold text-xs sm:text-sm">
                          {item.score}
                        </span>

                        {item.isNew && (
                          <img
                            src={newImg}
                            alt="Nova pontuação"
                            className="w-[30px] h-auto object-contain"
                          />
                        )}

                      </div>

                    </div>

                  ))

                ) : (

                  <div className="flex justify-center items-center h-full">
                    <p className="text-[#70401f] font-bold text-center text-xs sm:text-sm">
                      Nenhuma pontuação ainda!
                    </p>
                  </div>

                )}

              </div>

              {/* RECORDE PESSOAL */}
              <div className="ranking-record">
                SEU RECORDE: {bestScore}
              </div>

            </div>

          </div>

          {/* BOTÃO PLAY - VOLTAR PARA HOME */}
          <div className="absolute bottom-[7%] flex justify-center w-full px-4">

            <button
              onClick={handlePlayClick}
              disabled={isFading}
              className="w-[125px] sm:w-[135px] hover:scale-105 active:scale-95 transition-transform outline-none flex justify-center bg-transparent border-none cursor-pointer"
            >

              <img
                src={playBtnImg}
                alt="Voltar para o menu"
                className="w-full h-auto"
              />

            </button>

          </div>

        </div>

        {/* CHÃO ANIMADO */}
        <div className="w-full shrink-0 z-10 overflow-hidden">

          <div className="flex w-[200%] animate-scroll">

            <img
              src={baseImg}
              alt=""
              className="block w-1/2 h-auto"
            />

            <img
              src={baseImg}
              alt=""
              className="block w-1/2 h-auto"
            />

          </div>

        </div>

        {/* TRANSIÇÃO ESCURA */}
        <div
          className={`absolute inset-0 bg-black z-50 pointer-events-none transition-opacity duration-500 ${
            isFading ? 'opacity-100' : 'opacity-0'
          }`}
        />

      </div>
    </div>
  );
}
