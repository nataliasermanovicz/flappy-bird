
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../context/AudioContext';

// Sprites do jogo
import bgDayImgSrc from '../assets/sprites/background-day.png';
import bgNightImgSrc from '../assets/sprites/background-night.png';
import baseImgSrc from '../assets/sprites/base.png';
import pipeImgSrc from '../assets/sprites/pipe.png';
import birdMidSrc from '../assets/sprites/bird-midflap.png';
import birdUpSrc from '../assets/sprites/bird-upflap.png';
import birdDownSrc from '../assets/sprites/bird-downflap.png';
import getReadyImgSrc from '../assets/sprites/get-ready.png';
import messageImgSrc from '../assets/sprites/message.png';
import gameOverImgSrc from '../assets/sprites/game-over.png';
import panelImgSrc from '../assets/sprites/panel.png';

// Sprites dos botões
import playGameImgSrc from '../assets/sprites/play-game.png';
import rankImgSrc from '../assets/sprites/rank.png';

// Sprites dos números
import number0Src from '../assets/sprites/numbers/0.png';
import number1Src from '../assets/sprites/numbers/1.png';
import number2Src from '../assets/sprites/numbers/2.png';
import number3Src from '../assets/sprites/numbers/3.png';
import number4Src from '../assets/sprites/numbers/4.png';
import number5Src from '../assets/sprites/numbers/5.png';
import number6Src from '../assets/sprites/numbers/6.png';
import number7Src from '../assets/sprites/numbers/7.png';
import number8Src from '../assets/sprites/numbers/8.png';
import number9Src from '../assets/sprites/numbers/9.png';

// Sprites das medalhas
import bronzeMedal from '../assets/sprites/medals/bronze-medal.png';
import silverMedal from '../assets/sprites/medals/silver-medal.png';
import goldMedal from '../assets/sprites/medals/gold-medal.png';
import hundredPointsMedal from '../assets/sprites/medals/100-points-medal.png';

// Lista dos sprites dos números
const numberSprites = [
  number0Src,
  number1Src,
  number2Src,
  number3Src,
  number4Src,
  number5Src,
  number6Src,
  number7Src,
  number8Src,
  number9Src
];

// Ícones de controle
import pauseBtnImg from '../assets/sprites/icons/pause.png';
import playBtnImg from '../assets/sprites/icons/play.png';

// Áudios
import wingSoundSrc from '../assets/sounds/wing.ogg';
import pointSoundSrc from '../assets/sounds/point.ogg';
import hitSoundSrc from '../assets/sounds/hit.ogg';
import dieSoundSrc from '../assets/sounds/die.ogg';

// CONFIGURAÇÕES DE DIFICULDADE
// Mantidas fora do componente para evitar recriação do objeto
const difficultySettings = {
  facil: {
    gravity: 0.22,
    jump: 4.4,
    pipeGap: 125,
    pipeSpeed: 1.6,
    groundSpeed: 1.6,
    spawnInterval: 110
  },

  medio: {
    gravity: 0.25,
    jump: 4.6,
    pipeGap: 100,
    pipeSpeed: 2,
    groundSpeed: 2,
    spawnInterval: 100
  },

  dificil: {
    gravity: 0.29,
    jump: 4.9,
    pipeGap: 80,
    pipeSpeed: 2.6,
    groundSpeed: 2.6,
    spawnInterval: 85
  }
};

export default function Game() {
  const canvasRef = useRef(null);
  const audioInstancesRef = useRef([]);
  const isPausedRef = useRef(false);
  const gameMethodsRef = useRef({});

  const navigate = useNavigate();
  const { isMuted } = useAudio();

  const [isFadingIn, setIsFadingIn] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const [isGameOver, setIsGameOver] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [showGameOverUI, setShowGameOverUI] = useState(false);

  const [finalScore, setFinalScore] = useState(0);

  // Recuperar configurações selecionadas no Home.jsx
  const selectedTheme = localStorage.getItem('flappyTheme') || 'dia';

  const selectedDifficulty =
    localStorage.getItem('flappyDifficulty') || 'medio';

  const currentDifficulty =
    difficultySettings[selectedDifficulty] || difficultySettings.medio;

  // Selecionar medalha de acordo com a pontuação
  const getMedal = () => {
    if (finalScore >= 100) {
      return hundredPointsMedal;
    }

    if (finalScore >= 50) {
      return goldMedal;
    }

    if (finalScore >= 20) {
      return silverMedal;
    }

    return bronzeMedal;
  };

  // Transição de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingIn(false);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // NÚCLEO DO JOGO
  useEffect(() => {
    const cvs = canvasRef.current;

    if (!cvs) return;

    const ctx = cvs.getContext('2d');

    let animationFrameId;

    let gameOverTriggered = false;
    let groundHitTriggered = false;
    let scoreSaved = false;

    // Carregamento do background conforme o tema
    const bgImg = new Image();

    bgImg.src = selectedTheme === 'noite'
      ? bgNightImgSrc
      : bgDayImgSrc;

    // Carregamento dos sprites
    const baseImg = new Image();
    baseImg.src = baseImgSrc;

    const pipeImg = new Image();
    pipeImg.src = pipeImgSrc;

    const getReadyImg = new Image();
    getReadyImg.src = getReadyImgSrc;

    const messageImg = new Image();
    messageImg.src = messageImgSrc;

    const gameOverImg = new Image();
    gameOverImg.src = gameOverImgSrc;

    // Sprites dos números
    const numberSpritesSrc = [
      number0Src,
      number1Src,
      number2Src,
      number3Src,
      number4Src,
      number5Src,
      number6Src,
      number7Src,
      number8Src,
      number9Src
    ];

    const numberImgs = numberSpritesSrc.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    // Sprites do pássaro
    const birdImgs = [
      new Image(),
      new Image(),
      new Image()
    ];

    birdImgs[0].src = birdDownSrc;
    birdImgs[1].src = birdMidSrc;
    birdImgs[2].src = birdUpSrc;

    // Áudios
    const wingSound = new Audio(wingSoundSrc);
    const pointSound = new Audio(pointSoundSrc);
    const hitSound = new Audio(hitSoundSrc);
    const dieSound = new Audio(dieSoundSrc);

    audioInstancesRef.current = [
      wingSound,
      pointSound,
      hitSound,
      dieSound
    ];

    audioInstancesRef.current.forEach((audio) => {
      audio.muted = isMuted;
    });

    let frame = 0;

    const score = { current: 0 };

    // SALVAR PONTUAÇÃO NO RANKING
    const saveScore = () => {
      if (scoreSaved) return;

      scoreSaved = true;

      try {
        const savedScores = JSON.parse(
          localStorage.getItem('ranking') || '[]'
        );

        const newScore = {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          name: 'Você',
          score: score.current,
          isNew: true
        };

        savedScores.push(newScore);

        localStorage.setItem(
          'ranking',
          JSON.stringify(savedScores)
        );

      } catch (error) {
        console.error('Erro ao salvar pontuação:', error);
      }
    };

    const gameState = {
      current: 0,
      getReady: 0,
      play: 1,
      gameOver: 2
    };

    // PÁSSARO
    const bird = {
      x: 60,
      y: 180,
      w: 34,
      h: 24,
      radius: 12,
      frameIndex: 0,
      speed: 0,
      gravity: currentDifficulty.gravity,
      jump: currentDifficulty.jump,
      rotation: 0,

      render: function () {
        const currentBirdImg = birdImgs[this.frameIndex];

        if (!currentBirdImg.complete || !currentBirdImg.naturalWidth) return;

        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.drawImage(
          currentBirdImg,
          -this.w / 2,
          -this.h / 2,
          this.w,
          this.h
        );

        ctx.restore();
      },

      flap: function () {
        this.speed = -this.jump;

        wingSound.currentTime = 0;
        wingSound.play().catch(err => console.log(err));
      },

      update: function () {
        if (
          gameState.current !== gameState.gameOver &&
          frame % 5 === 0
        ) {
          this.frameIndex = (this.frameIndex + 1) % birdImgs.length;
        }

        if (gameState.current === gameState.getReady) {
          this.y = 180 + Math.sin(frame / 10) * 5;
          this.rotation += (0 - this.rotation) * 0.15;

        } else if (gameState.current === gameState.play) {
          this.speed += this.gravity;
          this.y += this.speed;

          const targetRotation = Math.max(
            -0.45,
            Math.min(1.2, this.speed * 0.12)
          );

          this.rotation += (targetRotation - this.rotation) * 0.18;

          // Colisão com o chão
          if (this.y + this.h / 2 >= ground.y) {
            this.y = ground.y - this.h / 2;

            hitSound.currentTime = 0;
            hitSound.play().catch(err => console.log(err));

            gameState.current = gameState.gameOver;

            if (!gameOverTriggered) {
              gameOverTriggered = true;
              setIsGameOver(true);
            }

            if (!groundHitTriggered) {
              groundHitTriggered = true;

              saveScore();

              setShowPanel(true);

              setTimeout(() => {
                setShowGameOverUI(true);
              }, 500);
            }
          }

        } else if (gameState.current === gameState.gameOver) {

          // Queda do pássaro após colisão
          if (this.y + this.h / 2 < ground.y) {
            this.speed += this.gravity;
            this.y += this.speed;

            if (this.rotation < Math.PI / 2) {
              this.rotation += 0.1;
            } else {
              this.rotation = Math.PI / 2;
            }

          } else {
            this.y = ground.y - this.h / 2;

            if (!groundHitTriggered) {
              groundHitTriggered = true;

              saveScore();

              setShowPanel(true);

              setTimeout(() => {
                setShowGameOverUI(true);
              }, 500);
            }
          }
        }
      }
    };

    // FUNDO
    const bg = {
      render: function () {
        if (bgImg.complete && bgImg.naturalWidth) {
          ctx.drawImage(bgImg, 0, 0, cvs.width, cvs.height);
        }
      }
    };

    // CHÃO
    const ground = {
      x: 0,
      w: cvs.width,
      dx: currentDifficulty.groundSpeed,

      get h() {
        return !baseImg.naturalWidth
          ? 112
          : this.w * (baseImg.naturalHeight / baseImg.naturalWidth);
      },

      get y() {
        return cvs.height - this.h;
      },

      render: function () {
        if (!baseImg.complete || !baseImg.naturalWidth) return;

        ctx.drawImage(
          baseImg,
          this.x,
          this.y,
          this.w,
          this.h
        );

        ctx.drawImage(
          baseImg,
          this.x + this.w,
          this.y,
          this.w,
          this.h
        );
      },

      position: function () {
        if (
          gameState.current === gameState.play ||
          gameState.current === gameState.getReady
        ) {
          this.x = (this.x - this.dx) % this.w;
        }
      }
    };

    // CANOS
    const pipes = {
      w: 52,
      h: 320,
      gap: currentDifficulty.pipeGap,
      dx: currentDifficulty.pipeSpeed,
      pipeGenerator: [],

      render: function () {
        if (!pipeImg.complete || !pipeImg.naturalWidth) return;

        for (let i = 0; i < this.pipeGenerator.length; i++) {
          let p = this.pipeGenerator[i];

          let topPipeY = p.y;
          let bottomPipeY = p.y + this.h + this.gap;

          // Cano inferior
          ctx.drawImage(
            pipeImg,
            p.x,
            bottomPipeY,
            this.w,
            this.h
          );

          // Cano superior
          ctx.save();

          ctx.translate(
            p.x + this.w / 2,
            topPipeY + this.h / 2
          );

          ctx.scale(1, -1);

          ctx.drawImage(
            pipeImg,
            -this.w / 2,
            -this.h / 2,
            this.w,
            this.h
          );

          ctx.restore();
        }
      },

      position: function () {
        if (gameState.current !== gameState.play) return;

        // Gerar novos canos
        if (frame % currentDifficulty.spawnInterval === 0) {
          this.pipeGenerator.push({
            x: cvs.width,
            y: Math.floor(Math.random() * (-100 - -260 + 1)) + -260
          });
        }

        for (let i = 0; i < this.pipeGenerator.length; i++) {
          let p = this.pipeGenerator[i];

          p.x -= this.dx;

          // COLISÃO COM OS CANOS
          if (
            bird.x + bird.radius > p.x &&
            bird.x - bird.radius < p.x + this.w &&
            (
              bird.y - bird.radius < p.y + this.h ||
              bird.y + bird.radius > p.y + this.h + this.gap
            )
          ) {
            hitSound.currentTime = 0;
            hitSound.play().catch(err => console.log(err));

            dieSound.currentTime = 0;
            dieSound.play().catch(err => console.log(err));

            gameState.current = gameState.gameOver;

            if (!gameOverTriggered) {
              gameOverTriggered = true;
              setIsGameOver(true);
            }

            saveScore();
          }

          // CONTABILIZAR CANOS ULTRAPASSADOS
          if (
            p.x + this.w < bird.x - bird.radius &&
            !p.passed
          ) {
            p.passed = true;

            score.current++;

            setFinalScore(score.current);

            pointSound.currentTime = 0;
            pointSound.play().catch(err => console.log(err));

            // Vitória ao atingir 100 pontos
            if (score.current >= 100) {
              gameState.current = gameState.gameOver;

              if (!gameOverTriggered) {
                gameOverTriggered = true;
                setIsGameOver(true);
              }

              saveScore();
            }
          }

          if (p.x < -this.w) {
            this.pipeGenerator.shift();
            i--;
          }
        }
      }
    };

    // TELA GET READY
    const getReadyScreen = {
      render: function () {
        if (gameState.current === gameState.getReady) {

          if (getReadyImg.complete && getReadyImg.naturalWidth) {
            ctx.drawImage(
              getReadyImg,
              cvs.width / 2 - 90,
              100,
              180,
              50
            );
          }

          if (messageImg.complete && messageImg.naturalWidth) {
            ctx.drawImage(
              messageImg,
              105,
              165,
              100,
              120
            );
          }
        }
      }
    };

    // TELA GAME OVER
    const gameOverScreen = {
      alpha: 0,
      y: 120,

      render: function () {
        if (gameState.current === gameState.gameOver) {
          if (this.alpha < 1) {
            this.alpha += 0.05;
          }

          if (gameOverImg.complete && gameOverImg.naturalWidth) {
            ctx.save();

            ctx.globalAlpha = Math.min(this.alpha, 1);

            ctx.drawImage(
              gameOverImg,
              cvs.width / 2 - 96,
              this.y,
              192,
              42
            );

            ctx.restore();
          }
        }
      }
    };

    // PONTUAÇÃO DURANTE O JOGO
    const scoreDisplay = {
      render: function () {
        if (
          gameState.current !== gameState.getReady &&
          gameState.current !== gameState.play
        ) {
          return;
        }

        const scoreText = score.current.toString();

        const digitWidth = 24;
        const digitHeight = 36;
        const spacing = 2;

        const totalWidth =
          scoreText.length * digitWidth +
          (scoreText.length - 1) * spacing;

        const startX = (cvs.width - totalWidth) / 2;

        for (let i = 0; i < scoreText.length; i++) {
          const numberImg = numberImgs[Number(scoreText[i])];

          if (numberImg.complete && numberImg.naturalWidth > 0) {
            ctx.drawImage(
              numberImg,
              startX + i * (digitWidth + spacing),
              17,
              digitWidth,
              digitHeight
            );
          }
        }
      }
    };

    // RESET DO JOGO
    const resetGame = () => {
      if (bird.y + bird.h / 2 < ground.y) return;

      pipes.pipeGenerator = [];

      score.current = 0;
      scoreSaved = false;

      setFinalScore(0);

      bird.speed = 0;
      bird.y = 180;
      bird.rotation = 0;
      bird.frameIndex = 0;

      gameState.current = gameState.getReady;

      gameOverScreen.alpha = 0;

      gameOverTriggered = false;
      groundHitTriggered = false;

      setIsGameOver(false);
      setShowPanel(false);
      setShowGameOverUI(false);
    };

    gameMethodsRef.current.resetGame = resetGame;

    gameMethodsRef.current.canProceed = () => (
      bird.y + bird.h / 2 >= ground.y
    );

    // LOOP DO JOGO
    function loop() {
      if (!isPausedRef.current) {
        bird.update();
        ground.position();
        pipes.position();

        frame++;
      }

      ctx.clearRect(0, 0, cvs.width, cvs.height);

      bg.render();
      pipes.render();
      ground.render();
      bird.render();

      getReadyScreen.render();
      scoreDisplay.render();
      gameOverScreen.render();

      animationFrameId = requestAnimationFrame(loop);
    }

    // CLIQUE NO CANVAS
    const handleCanvasClick = () => {
      if (isPausedRef.current) return;

      if (
        gameState.current === gameState.getReady ||
        gameState.current === gameState.play
      ) {
        gameState.current = gameState.play;
        bird.flap();
      }
    };

    // TECLA ESPAÇO
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();

        if (isPausedRef.current) return;

        if (
          gameState.current === gameState.getReady ||
          gameState.current === gameState.play
        ) {
          gameState.current = gameState.play;
          bird.flap();

        } else if (gameState.current === gameState.gameOver) {
          resetGame();
        }
      }
    };

    cvs.addEventListener('click', handleCanvasClick);
    window.addEventListener('keydown', handleKeyDown);

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);

      cvs.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('keydown', handleKeyDown);

      audioInstancesRef.current.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });

      audioInstancesRef.current = [];
    };
  }, [navigate, currentDifficulty, selectedTheme]);

  // ATUALIZAÇÃO DO ÁUDIO
  // Alterar o volume não reinicia o núcleo do jogo
  useEffect(() => {
    audioInstancesRef.current.forEach(audio => {
      audio.muted = isMuted;
    });
  }, [isMuted]);

  // PAUSAR E RETOMAR
  const handlePause = () => {
    const nextPausedState = !isPausedRef.current;

    isPausedRef.current = nextPausedState;

    setIsPaused(nextPausedState);

    if (nextPausedState) {
      audioInstancesRef.current.forEach(audio => audio.pause());
    }
  };

  return (
    <div className="game-container relative flex justify-center items-center w-screen h-dvh bg-black overflow-hidden">

      <div
        className="relative overflow-hidden"
        style={{
          width: 'min(100vw, 60dvh)',
          height: 'min(100dvh, 166.6667vw)',
          aspectRatio: '3 / 5'
        }}
      >

        <canvas
          ref={canvasRef}
          id="game"
          width="300"
          height="500"
          className="shadow-2xl block w-full h-full"
        />

        {/* BOTÃO DE PAUSA/PLAY */}
        <button
          onClick={handlePause}
          className={`absolute top-[6px] left-[6px] z-40 w-12 h-12 bg-transparent border-none cursor-pointer p-0 hover:scale-110 active:scale-90 transition-all duration-200 ${
            isGameOver ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          aria-label={isPaused ? "Retomar jogo" : "Pausar jogo"}
        >
          <img
            src={isPaused ? playBtnImg : pauseBtnImg}
            alt={isPaused ? "Retomar" : "Pausar"}
            className="w-full h-full object-contain"
          />
        </button>

        {/* PAINEL DE GAME OVER */}
        <div
          className={`absolute left-0 top-1/2 w-full flex justify-center z-30 transition-transform duration-500 ease-out ${
            showPanel ? '-translate-y-1/2' : '-translate-y-[700px]'
          }`}
        >
          <div className="relative w-[min(400px,95%)]">

            <img
              src={panelImgSrc}
              alt="Painel de Score"
              className="w-full h-auto block drop-shadow-md"
            />

            {/* MEDALHA */}
            <img
              src={getMedal()}
              alt="Medalha conquistada"
              className="absolute left-[12%] top-[38%] w-[20%] h-auto object-contain"
            />

            {/* PONTUAÇÃO */}
            <div className="absolute top-[31%] right-[12%] flex items-center justify-end gap-0">

              {finalScore.toString().split('').map((digit, index) => (
                <img
                  key={index}
                  src={numberSprites[Number(digit)]}
                  alt={digit}
                  className="w-[18px] h-[27px] object-contain"
                />
              ))}

            </div>

          </div>
        </div>

        {/* BOTÕES DE GAME OVER */}
        <div
          className={`absolute bottom-[23%] left-0 flex gap-5 w-full justify-center px-4 z-40 transition-opacity duration-300 ${
            showGameOverUI
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={() => gameMethodsRef.current.resetGame?.()}
            className="w-[125px] sm:w-[135px] hover:scale-105 active:scale-95 transition-transform outline-none flex justify-center bg-transparent border-none p-0 cursor-pointer"
          >
            <img
              src={playGameImgSrc}
              alt="Iniciar Jogo"
              className="w-full h-auto cursor-pointer"
            />
          </button>

          <button
            onClick={() => {
              if (gameMethodsRef.current.canProceed?.()) {
                navigate('/ranking');
              }
            }}
            className="w-[125px] sm:w-[135px] hover:scale-105 active:scale-95 transition-transform outline-none flex justify-center bg-transparent border-none p-0 cursor-pointer"
          >
            <img
              src={rankImgSrc}
              alt="Ver Ranking"
              className="w-full h-auto cursor-pointer"
            />
          </button>
        </div>

      </div>

      {/* TRANSIÇÃO DE ENTRADA */}
      <div
        className={`absolute inset-0 bg-black z-50 pointer-events-none transition-opacity duration-500 ${
          isFadingIn ? 'opacity-100' : 'opacity-0'
        }`}
      />

    </div>
  );
}
