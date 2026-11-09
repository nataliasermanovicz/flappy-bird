import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importando todos os sprites necessários
import bgImgSrc from '../assets/sprites/background-day.png';
import baseImgSrc from '../assets/sprites/base.png';
import pipeImgSrc from '../assets/sprites/pipe.png';
import birdMidSrc from '../assets/sprites/bird-midflap.png';
import birdUpSrc from '../assets/sprites/bird-upflap.png';
import birdDownSrc from '../assets/sprites/bird-downflap.png';
import getReadyImgSrc from '../assets/sprites/get-ready.png';
import instructionsImgSrc from '../assets/sprites/instrucoes.png';

// Importando os arquivos de áudio
import wingSoundSrc from '../assets/sounds/wing.ogg'; 
import pointSoundSrc from '../assets/sounds/point.ogg';
import hitSoundSrc from '../assets/sounds/hit.ogg'; 
import dieSoundSrc from '../assets/sounds/die.ogg'; // NOVO: Som de morte

export default function Game() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [isFadingIn, setIsFadingIn] = useState(true);

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

    const instructionsImg = new Image();
    instructionsImg.src = instructionsImgSrc;

    // Frames de animação do pássaro
    const birdImgs = [new Image(), new Image(), new Image()];
    birdImgs[0].src = birdDownSrc;
    birdImgs[1].src = birdMidSrc;
    birdImgs[2].src = birdUpSrc;

    // Objetos de áudio
    const wingSound = new Audio(wingSoundSrc);
    const pointSound = new Audio(pointSoundSrc);
    const hitSound = new Audio(hitSoundSrc);
    const dieSound = new Audio(dieSoundSrc); // NOVO: Instância do som

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
           console.log("Áudio bloqueado ou não carregado:", err);
        });
      },

      update: function () {
        // NOVO: O pássaro só bate as asas se não estiver no estado GameOver
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
          
          // NOVO: Lógica de queda quando bater no cano
        } else if (gameState.current === gameState.gameOver) {
          // Se o pássaro ainda não atingiu o chão, ele continua caindo
          if (this.y + this.h / 2 < ground.y) {
            this.speed += this.gravity;
            this.y += this.speed;
            
            // Controle a velocidade da rotação aqui! 
            // 0.1 é uma velocidade boa, se quiser mais devagar use 0.05, se quiser mais rápido use 0.2
            if (this.rotation < Math.PI / 2) {
              this.rotation += 0.1; 
            } else {
              this.rotation = Math.PI / 2; // Trava exatamente nos 90 graus
            }
            
          } else {
            // Quando finalmente encostar no chão
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
            
            // Toca o som de impacto
            hitSound.currentTime = 0;
            hitSound.play().catch(err => console.log(err));

            // NOVO: Toca o som de morte logo após o impacto com o cano
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
          ctx.drawImage(instructionsImg, cvs.width / 2 - 57, 200, 114, 98);
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

          ctx.strokeText(score.current, cvs.width / 2, 50);
          ctx.fillText(score.current, cvs.width / 2, 50);

          ctx.restore();
        }
      }
    };

    function loop() {
      bird.update();
      ground.position();
      pipes.position();

      ctx.clearRect(0, 0, cvs.width, cvs.height);

      bg.render();
      pipes.render();
      ground.render();
      bird.render();
      getReadyScreen.render();
      scoreDisplay.render();

      frame++;

      animationFrameId = requestAnimationFrame(loop);
    }

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
          // NOVO: Impede que o usuário clique e vá pro ranking antes do pássaro cair no chão
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
    };

  }, [navigate]);

  return (
    <div className="game-container relative flex justify-center items-center w-screen h-dvh bg-black">
      <canvas
        ref={canvasRef}
        id="game"
        width="300"
        height="500"
        className="shadow-2xl"
      ></canvas>

      <div 
        className={`absolute inset-0 bg-black z-50 pointer-events-none transition-opacity duration-500 ${
          isFadingIn ? 'opacity-100' : 'opacity-0'
        }`}
      ></div>
    </div>
  );
}