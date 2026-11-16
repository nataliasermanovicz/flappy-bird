
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../context/AudioContext';

// Sprites
import bgImg from '../assets/sprites/background-day.png';
import baseImg from '../assets/sprites/base.png';
import panelRankingImg from '../assets/sprites/panel-ranking.png';
import rankingImg from '../assets/sprites/ranking.png';
import playBtnImg from '../assets/sprites/play-game.png';
import newImg from '../assets/sprites/new.png';

// Som
import swooshSound from '../assets/sounds/swoosh.ogg';

export default function Ranking() {
  const navigate = useNavigate();
  const { isMuted } = useAudio();

  const [isFading, setIsFading] = useState(false);

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

  // Iniciar jogo
  const handlePlayClick = () => {
    if (isFading) return;

    if (!isMuted) {
      const audio = new Audio(swooshSound);
      audio.play();
    }

    setIsFading(true);

    setTimeout(() => {
      navigate('/game');
    }, 500);
  };

  return (
    <div className="flex justify-center items-center w-screen h-dvh bg-black overflow-hidden select-none">

      {/* ESTILOS DAS ANIMAÇÕES */}
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

          /* PERSONALIZAÇÃO DA BARRA DE ROLAGEM */
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
        `}
      </style>

      {/* CONTAINER PRINCIPAL */}
      <div
        className="relative flex flex-col overflow-hidden shadow-2xl box-border"
        style={{
          width: 'min(100vw, 60dvh)',
          height: 'min(100dvh, 166.6667vw)',
          aspectRatio: '3 / 5',
          backgroundImage: `url(${bgImg})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >

        {/* ÁREA CENTRAL */}
        <div className="flex-1 min-h-0 flex flex-col items-center relative z-10 w-full">

          {/* TÍTULO RANKING */}
          <div className="absolute top-[12%] flex justify-center items-center w-full px-4">

            <img
              src={rankingImg}
              alt="Ranking"
              className="w-[230px] sm:w-[260px] h-auto object-contain drop-shadow-md"
            />

          </div>

          {/* PAINEL DE RANKING */}
          <div
            className="absolute top-[27%] w-[85%]"
            style={{
              aspectRatio: '230 / 200',
              backgroundImage: `url(${panelRankingImg})`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >

            {/* CONTEÚDO DO PAINEL */}
            <div className="absolute inset-0 flex flex-col px-[9%] pt-[16%] pb-[9%]">

              {/* TÍTULO DA LISTA */}
              <h2 className="text-center text-[#70401f] font-bold text-xs sm:text-sm mb-2 shrink-0">
                MELHORES PONTUAÇÕES
              </h2>

              {/* LISTA DE PONTUAÇÕES */}
              <div className="flex-1 min-h-0 overflow-y-auto ranking-scroll">

                {scores.length > 0 ? (

                  scores.map((item, index) => (

                    <div
                      key={item.id || index}
                      className="flex justify-between items-center px-2 py-1 border-b border-[#b9a76a]/40"
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

                        {/* INDICADOR DE NOVA PONTUAÇÃO */}
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
              <div className="text-center text-[#80502c] font-bold text-xs mt-2 shrink-0">
                Seu recorde: {bestScore}
              </div>

            </div>

          </div>

          {/* BOTÃO PLAY */}
          <div className="absolute bottom-[7%] flex justify-center w-full px-4">

            <button
              onClick={handlePlayClick}
              disabled={isFading}
              className="w-[125px] sm:w-[135px] hover:scale-105 active:scale-95 transition-transform outline-none flex justify-center bg-transparent border-none cursor-pointer"
            >

              <img
                src={playBtnImg}
                alt="Jogar novamente"
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
