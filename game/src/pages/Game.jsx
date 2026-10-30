import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Importando todos os sprites necessários da sua pasta
import bgImgSrc from '../assets/sprites/background-day.png';
import baseImgSrc from '../assets/sprites/base.png';
import pipeImgSrc from '../assets/sprites/pipe.png';
import birdMidSrc from '../assets/sprites/bird-midflap.png';
import birdUpSrc from '../assets/sprites/bird-upflap.png';
import birdDownSrc from '../assets/sprites/bird-downflap.png';
import getReadyImgSrc from '../assets/sprites/get-ready.png';
import instructionsImgSrc from '../assets/sprites/instrucoes.png'; // ou message.png

export default function Game() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cvs = canvasRef.current;
    const ctx = cvs.getContext('2d');
    let animationFrameId;

    // Carregamento de Sprites
    const bgImg = new Image(); bgImg.src = bgImgSrc;
    const baseImg = new Image(); baseImg.src = baseImgSrc;
    const pipeImg = new Image(); pipeImg.src = pipeImgSrc;
    const getReadyImg = new Image(); getReadyImg.src = getReadyImgSrc;
    const instructionsImg = new Image(); instructionsImg.src = instructionsImgSrc;

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
      
      render: function () {
        const currentBirdImg = birdImgs[this.frameIndex];
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(currentBirdImg, -this.w / 2, -this.h / 2, this.w, this.h);
        ctx.restore();
      },

      flap: function () {
        this.speed = -this.jump;
      },

      update: function () {
        // Animação de bater asas
        if (frame % 5 === 0) {
          this.frameIndex = (this.frameIndex + 1) % birdImgs.length;
        }

        if (gameState.current === gameState.getReady) {
          // Flutuação suave na tela de Get Ready
          this.y = 180 + Math.sin(frame / 10) * 5;
        } else if (gameState.current === gameState.play) {
          this.speed += this.gravity;
          this.y += this.speed;

          // Colisão com o chão
          if (this.y + this.h / 2 >= cvs.height - 112) {
            this.y = cvs.height - 112 - this.h / 2;
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
      h: cvs.height - 112,
      render: function () {
        ctx.drawImage(bgImg, 0, 0, cvs.width, cvs.height);
      }
    };

    // Chão
    const ground = {
      x: 0,
      y: cvs.height - 112,
      w: 224,
      h: 112,
      dx: 2,
      render: function () {
        ctx.drawImage(baseImg, this.x, this.y, cvs.width, this.h);
        ctx.drawImage(baseImg, this.x + cvs.width, this.y, cvs.width, this.h);
      },
      position: function () {
        if (gameState.current === gameState.play || gameState.current === gameState.getReady) {
          this.x = (this.x - this.dx) % (cvs.width / 2);
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
          ctx.drawImage(pipeImg, p.x, bottomPipeY, this.w, this.h);

          // Cano superior invertido
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
            (bird.y - bird.radius < p.y + this.h || bird.y + bird.radius > p.y + this.h + this.gap)
          ) {
            gameState.current = gameState.gameOver;
          }

          // Pontuação
          if (p.x + this.w < bird.x - bird.radius && !p.passed) {
            p.passed = true;
            score.current++;
          }

          // Limpeza de canos antigos
          if (p.x < -this.w) {
            this.pipeGenerator.shift();
          }
        }
      }
    };

    // Tela de Get Ready (Mensagem + Instruções)
    const getReadyScreen = {
      render: function () {
        if (gameState.current === gameState.getReady) {
          // Imagem "Get Ready!"
          ctx.drawImage(getReadyImg, cvs.width / 2 - 90, 100, 180, 50);
          // Imagem de instruções do toque (TAP / Hand)
          ctx.drawImage(instructionsImg, cvs.width / 2 - 57, 200, 114, 98);
        }
      }
    };

    // Renderização da pontuação na tela
    const scoreDisplay = {
      render: function () {
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.font = "35px Teko, sans-serif";
        ctx.textAlign = "center";

        if (gameState.current === gameState.play) {
          ctx.fillText(score.current, cvs.width / 2, 50);
          ctx.strokeText(score.current, cvs.width / 2, 50);
        }
      }
    };

    // Loop do Canvas
    function loop() {
      // Updates
      bird.update();
      ground.position();
      pipes.position();

      // Desenho
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
    <div className="game-container">
      <canvas ref={canvasRef} id="game" width="300" height="500"></canvas>
    </div>
  );
}