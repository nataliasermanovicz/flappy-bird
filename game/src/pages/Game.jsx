
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../context/AudioContext';

// Importando todos os sprites necessários
import bgImgSrc from '../assets/sprites/background-day.png';
import baseImgSrc from '../assets/sprites/base.png';
import pipeImgSrc from '../assets/sprites/pipe.png';
import birdMidSrc from '../assets/sprites/bird-midflap.png';
import birdUpSrc from '../assets/sprites/bird-upflap.png';
import birdDownSrc from '../assets/sprites/bird-downflap.png';
import getReadyImgSrc from '../assets/sprites/get-ready.png';

// Botão de pausa
import pauseBtnImg from '../assets/sprites/icons/pause.png';

// Importando os arquivos de áudio
import wingSoundSrc from '../assets/sounds/wing.ogg';
import pointSoundSrc from '../assets/sounds/point.ogg';
import hitSoundSrc from '../assets/sounds/hit.ogg';
import dieSoundSrc from '../assets/sounds/die.ogg';

export default function Game() {
  const canvasRef = useRef(null);
  const audioInstancesRef = useRef([]);
  const isPausedRef = useRef(false);

  const navigate = useNavigate();

  // Controle global do áudio
  const { isMuted } = useAudio();

  const [isFadingIn, setIsFadingIn] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingIn(false);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cvs = canvasRef.current;
    const ctx = cvs.getContext('2d');
    let animationFrameId;

    // Carregamento de Sprites
    const bgImg = new Image();
    bgImg.src = bgImgSrc;

    const baseImg = new Image();
    baseImg.src = baseImgSrc;

    const pipeImg = new Image();
    pipeImg.src = pipeImgSrc;

    const getReadyImg = new Image();
    getReadyImg.src = getReadyImgSrc;

    // Frames de animação do pássaro
    const birdImgs = [new Image(), new Image(), new Image()];
    birdImgs[0].src = birdDownSrc;
    birdImgs[1].src = birdMidSrc;
    birdImgs[2].src = birdUpSrc;

    // Objetos de áudio
    const wingSound = new Audio(wingSoundSrc);
    const pointSound = new Audio(pointSoundSrc);
    const hitSound = new Audio(hitSoundSrc);
    const dieSound = new Audio(dieSoundSrc);

    // Armazena todos os áudios para permitir o controle global
    audioInstancesRef.current = [
      wingSound,
      pointSound,
      hitSound,
      dieSound
    ];

    let frame = 0;
    const score = { current: 0 };

    const gameState = {
      current: 0,
      getReady: 0,
      play: 1,
      gameOver: 2
    };

    // Pássaro
    const bird = {
      x: 60,
      y: 180,
      w: 34,
      h: 24,
      radius: 12,

      frameIndex: 0,

      speed: 0,
      gravity: 0.25,
      jump: 4.6,

      rotation: 0,

      render: function () {
        const currentBirdImg = birdImgs[this.frameIndex];

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
        wingSound.play().catch((err) => {
          console.log('Áudio bloqueado ou não carregado:', err);
        });
      },

      update: function () {
        // O pássaro só bate as asas se não estiver no estado GameOver
        if (gameState.current !== gameState.gameOver && frame % 5 === 0) {
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

          this.rotation += (
            targetRotation - this.rotation
          ) * 0.18;

          // Colisão direto com o chão
          if (this.y + this.h / 2 >= ground.y) {
            this.y = ground.y - this.h / 2;

            if (gameState.current === gameState.play) {
              hitSound.currentTime = 0;
              hitSound.play().catch(err => console.log(err));
            }

            gameState.current = gameState.gameOver;
          }

        } else if (gameState.current === gameState.gameOver) {
          // O pássaro continua caindo após a colisão
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
          }
        }
      }
    };

    // Fundo
    const bg = {
      x: 0,
      y: 0,
      w: cvs.width,
      h: cvs.height,

      render: function () {
        ctx.drawImage(bgImg, 0, 0, cvs.width, cvs.height);
      }
    };

    // Chão
    const ground = {
      x: 0,
      w: cvs.width,
      dx: 2,

      get h() {
        if (!baseImg.naturalWidth) return 112;
        return this.w * (baseImg.naturalHeight / baseImg.naturalWidth);
      },

      get y() {
        return cvs.height - this.h;
      },

      render: function () {
        ctx.drawImage(baseImg, this.x, this.y, this.w, this.h);
        ctx.drawImage(baseImg, this.x + this.w, this.y, this.w, this.h);
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

    // Canos
    const pipes = {
      w: 52,
      h: 320,
      gap: 100,
      dx: 2,
      pipeGenerator: [],

      render: function () {
        for (let i = 0; i < this.pipeGenerator.length; i++) {
          let p = this.pipeGenerator[i];

          let topPipeY = p.y;
          let bottomPipeY = p.y + this.h + this.gap;

          ctx.drawImage(pipeImg, p.x, bottomPipeY, this.w, this.h);

          ctx.save();
          ctx.translate(p.x + this.w / 2, topPipeY + this.h / 2);
          ctx.scale(1, -1);
          ctx.drawImage(pipeImg, -this.w / 2, -this.h / 2, this.w, this.h);
          ctx.restore();
        }
      },

      position: function () {
        if (gameState.current !== gameState.play) return;

        if (frame % 100 === 0) {
          this.pipeGenerator.push({
            x: cvs.width,
            y: Math.floor(Math.random() * (-100 - -260 + 1)) + -260
          });
        }

        for (let i = 0; i < this.pipeGenerator.length; i++) {
          let p = this.pipeGenerator[i];

          p.x -= this.dx;

          // Colisão com os canos
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
          }

          // Lógica de pontuação e som de ponto
          if (p.x + this.w < bird.x - bird.radius && !p.passed) {
            p.passed = true;
            score.current++;

            pointSound.currentTime = 0;
            pointSound.play().catch(err => console.log(err));
          }

          if (p.x < -this.w) {
            this.pipeGenerator.shift();
          }
        }
      }
    };

    // Tela de Get Ready
    const getReadyScreen = {
      render: function () {
        if (gameState.current === gameState.getReady) {
          ctx.drawImage(getReadyImg, cvs.width / 2 - 90, 100, 180, 50);
        }
      }
    };

    // Renderização da pontuação
    const scoreDisplay = {
      render: function () {
        if (
          gameState.current === gameState.getReady ||
          gameState.current === gameState.play
        ) {
          ctx.save();
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 3;
          ctx.font = 'bold 36px sans-serif';
          ctx.textAlign = 'center';

          // Durante o Get Ready, o zero aparece acima do título
          const scoreY = gameState.current === gameState.getReady ? 90 : 50;

          ctx.strokeText(score.current, cvs.width / 2, scoreY);
          ctx.fillText(score.current, cvs.width / 2, scoreY);

          ctx.restore();
        }
      }
    };

    // Indicador de pausa
    const pauseDisplay = {
      render: function () {
        if (isPausedRef.current) {
          ctx.save();

          ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
          ctx.fillRect(0, 0, cvs.width, cvs.height);

          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 3;
          ctx.font = 'bold 28px sans-serif';
          ctx.textAlign = 'center';

          ctx.strokeText('PAUSADO', cvs.width / 2, cvs.height / 2);
          ctx.fillText('PAUSADO', cvs.width / 2, cvs.height / 2);

          ctx.restore();
        }
      }
    };

    // Loop principal do jogo
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
      pauseDisplay.render();

      animationFrameId = requestAnimationFrame(loop);
    }

    // Clique no canvas
    const handleCanvasClick = () => {
      if (isPausedRef.current) return;

      switch (gameState.current) {
        case gameState.getReady:
          gameState.current = gameState.play;
          bird.flap();
          break;

        case gameState.play:
          bird.flap();
          break;

        case gameState.gameOver:
          if (bird.y + bird.h / 2 >= ground.y) {
            navigate('/ranking');
          }
          break;
      }
    };

    cvs.addEventListener('click', handleCanvasClick);

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      cvs.removeEventListener('click', handleCanvasClick);

      // Limpa as instâncias de áudio ao sair do jogo
      audioInstancesRef.current.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });

      audioInstancesRef.current = [];
    };

  }, [navigate]);

  // Atualiza o estado de todos os áudios sempre que o usuário alternar o som
  useEffect(() => {
    audioInstancesRef.current.forEach((audio) => {
      audio.muted = isMuted;
    });
  }, [isMuted]);

  // Controla o botão de pausa
  const handlePause = () => {
    const nextPausedState = !isPausedRef.current;

    isPausedRef.current = nextPausedState;
    setIsPaused(nextPausedState);

    if (nextPausedState) {
      audioInstancesRef.current.forEach((audio) => {
        audio.pause();
      });
    }
  };

  return (
    <div className="game-container relative flex justify-center items-center w-screen h-dvh bg-black">

      <div className="relative">

        <canvas
          ref={canvasRef}
          id="game"
          width="300"
          height="500"
          className="shadow-2xl block"
        ></canvas>

        {/* BOTÃO DE PAUSA */}
        <button
          onClick={handlePause}
          className="absolute top-3 left-3 z-40 w-15 h-15 bg-transparent border-none cursor-pointer p-0 hover:scale-110 active:scale-90 transition-transform"
          aria-label={isPaused ? "Retomar jogo" : "Pausar jogo"}
        >
          <img
            src={pauseBtnImg}
            alt="Pausar"
            className="w-full h-full object-contain"
          />
        </button>

      </div>

      {/* TRANSIÇÃO DE ENTRADA */}
      <div
        className={`absolute inset-0 bg-black z-50 pointer-events-none transition-opacity duration-500 ${
          isFadingIn ? 'opacity-100' : 'opacity-0'
        }`}
      ></div>

    </div>
  );
}
