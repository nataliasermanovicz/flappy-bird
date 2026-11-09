import { useEffect, useRef, useState } from 'react'; // 1. Adicionado useState
import { useNavigate } from 'react-router-dom';

// Importando todos os sprites necessários da sua pasta
import bgImgSrc from '../assets/sprites/background-day.png';
import baseImgSrc from '../assets/sprites/base.png';
import pipeImgSrc from '../assets/sprites/pipe.png';
import birdMidSrc from '../assets/sprites/bird-midflap.png';
import birdUpSrc from '../assets/sprites/bird-upflap.png';
import birdDownSrc from '../assets/sprites/bird-downflap.png';
import getReadyImgSrc from '../assets/sprites/get-ready.png';
import instructionsImgSrc from '../assets/sprites/instrucoes.png';

export default function Game() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // 2. Estado para controlar o clareamento da tela
  const [isFadingIn, setIsFadingIn] = useState(true);

  // 3. Effect para iniciar o fade-in assim que a tela abre
  useEffect(() => {
    // Um pequeno atraso (50ms) garante que o navegador renderize a tela preta
    // antes de começarmos a transição para transparente.
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

    const instructionsImg = new Image();
    instructionsImg.src = instructionsImgSrc;

    // Frames de animação do pássaro
    const birdImgs = [new Image(), new Image(), new Image()];
    birdImgs[0].src = birdDownSrc;
    birdImgs[1].src = birdMidSrc;
    birdImgs[2].src = birdUpSrc;

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

      // Ângulo atual de inclinação do pássaro
      rotation: 0,

      render: function () {
        const currentBirdImg = birdImgs[this.frameIndex];

        ctx.save();

        // Posiciona o centro de rotação no centro do pássaro
        ctx.translate(this.x, this.y);

        // Inclina o pássaro conforme seu movimento vertical
        ctx.rotate(this.rotation);

        // Desenha o sprite centralizado
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
        // Impulso para cima
        this.speed = -this.jump;
      },

      update: function () {

        // Animação das asas
        if (frame % 5 === 0) {
          this.frameIndex = (this.frameIndex + 1) % birdImgs.length;
        }

        if (gameState.current === gameState.getReady) {

          // Movimento suave enquanto aguarda o início
          this.y = 180 + Math.sin(frame / 10) * 5;

          // Mantém o pássaro reto na tela inicial
          this.rotation += (0 - this.rotation) * 0.15;

        } else if (gameState.current === gameState.play) {

          // Aplicação da gravidade
          this.speed += this.gravity;
          this.y += this.speed;

          // ROTACIONAR CONFORME A VELOCIDADE

          // Velocidade negativa = olhando para cima
          // Velocidade positiva = olhando para baixo
          const targetRotation = Math.max(
            -0.45,
            Math.min(1.2, this.speed * 0.12)
          );

          // Suaviza a transição entre os ângulos
          this.rotation += (
            targetRotation - this.rotation
          ) * 0.18;

          // Colisão com o chão
          if (this.y + this.h / 2 >= ground.y) {
            this.y = ground.y - this.h / 2;
            gameState.current = gameState.gameOver;
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
        ctx.drawImage(
          bgImg,
          0,
          0,
          cvs.width,
          cvs.height
        );
      }
    };

    // Chão
    const ground = {
      x: 0,
      w: cvs.width,
      dx: 2,

      // Altura proporcional à imagem original
      get h() {
        if (!baseImg.naturalWidth) return 112;

        return this.w * (
          baseImg.naturalHeight / baseImg.naturalWidth
        );
      },

      // Mantém o chão na parte inferior do Canvas
      get y() {
        return cvs.height - this.h;
      },

      render: function () {

        // Primeiro chão
        ctx.drawImage(
          baseImg,
          this.x,
          this.y,
          this.w,
          this.h
        );

        // Segundo chão para movimento contínuo
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

          // Cano inferior
          ctx.drawImage(
            pipeImg,
            p.x,
            bottomPipeY,
            this.w,
            this.h
          );

          // Cano superior invertido
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

        if (frame % 100 === 0) {
          this.pipeGenerator.push({
            x: cvs.width,
            y: Math.floor(
              Math.random() * (-100 - -260 + 1)
            ) + -260
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
            gameState.current = gameState.gameOver;
          }

          // Pontuação
          if (
            p.x + this.w < bird.x - bird.radius &&
            !p.passed
          ) {
            p.passed = true;
            score.current++;
          }

          // Remover canos que saíram da tela
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
          ctx.drawImage(
            getReadyImg,
            cvs.width / 2 - 90,
            100,
            180,
            50
          );

          ctx.drawImage(
            instructionsImg,
            cvs.width / 2 - 57,
            200,
            114,
            98
          );
        }
      }
    };

    // Renderização da pontuação
    const scoreDisplay = {
      render: function () {
        if (gameState.current === gameState.play) {
          ctx.save();

          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 3;
          ctx.font = 'bold 36px sans-serif';
          ctx.textAlign = 'center';

          ctx.strokeText(
            score.current,
            cvs.width / 2,
            50
          );

          ctx.fillText(
            score.current,
            cvs.width / 2,
            50
          );

          ctx.restore();
        }
      }
    };

    // Loop do Canvas
    function loop() {
      bird.update();
      ground.position();
      pipes.position();

      ctx.clearRect(
        0,
        0,
        cvs.width,
        cvs.height
      );

      bg.render();
      pipes.render();
      ground.render();
      bird.render();
      getReadyScreen.render();
      scoreDisplay.render();

      frame++;

      animationFrameId = requestAnimationFrame(loop);
    }

    // Clique na tela
    const handleCanvasClick = () => {
      switch (gameState.current) {

        case gameState.getReady:
          gameState.current = gameState.play;
          bird.flap();
          break;

        case gameState.play:
          bird.flap();
          break;

        case gameState.gameOver:
          navigate('/ranking');
          break;
      }
    };

    cvs.addEventListener('click', handleCanvasClick);

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      cvs.removeEventListener('click', handleCanvasClick);
    };

  }, [navigate]);

  return (
    // 4. Adicionado o flex center para alinhar e classe 'relative' para prender a camada absoluta preta a este container.
    <div className="game-container relative flex justify-center items-center w-screen h-dvh bg-black">
      <canvas
        ref={canvasRef}
        id="game"
        width="300"
        height="500"
        className="shadow-2xl"
      ></canvas>

      {/* 5. CAMADA DE TRANSIÇÃO (OVERLAY ESCURO REVERSO) */}
      <div 
        className={`absolute inset-0 bg-black z-50 pointer-events-none transition-opacity duration-500 ${
          isFadingIn ? 'opacity-100' : 'opacity-0'
        }`}
      ></div>
    </div>
  );
}