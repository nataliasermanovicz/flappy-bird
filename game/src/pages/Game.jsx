import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionar após o Game Over

// Importações como no seu arquivo original (image_24a21b.jpg)
import bgImgSrc from '../assets/sprites/background-day.png';
import baseImgSrc from '../assets/sprites/base.png';
import pipeImgSrc from '../assets/sprites/pipe.png';
// import sfxScoreSrc from '../assets/sounds/sfx_point.wav';

export default function Game() {
  const canvasRef = useRef(null);
  const navigate = useNavigate(); // Hook do React Router

  useEffect(() => {
    const cvs = canvasRef.current;
    const ctx = cvs.getContext('2d');
    let animationFrameId;

    // Instanciando imagens
    const bgImg = new Image(); bgImg.src = bgImgSrc;
    const baseImg = new Image(); baseImg.src = baseImgSrc;
    const pipeImg = new Image(); pipeImg.src = pipeImgSrc;

    let frame = 0;
    const score = { current: 0 };
    let bird = { x: 50, y: 150, r: 12 }; // Mock temporário

    // O gameState de MENU (0) não precisa mais existir aqui, pois o Menu é a rota '/'
    const gameState = {
        getReady: 0, // Inicia direto no Get Ready ao carregar a página /game
        play: 1,
        gameOver: 2,
        current: 0 
    };

    // Objetos do jogo (bg, ground, pipes) continuam exatamente iguais à lógica que estruturamos antes.
    const bg = { /* ... lógica do bg ... */ };
    const ground = { /* ... lógica do ground ... */ };
    const pipes = { /* ... lógica dos pipes ... */ };

    // Loop do Jogo
    function loop() {
        // Atualizações
        bg.position();
        ground.position();
        pipes.position();
        // bird.update();

        // Desenho
        ctx.fillStyle = "#70c5ce"; // Cor do céu para cobrir fundos transparentes
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        
        bg.render();
        pipes.render();
        ground.render();
        // bird.render();

        frame++;
        animationFrameId = requestAnimationFrame(loop);
    }

    // Controle de cliques no Canvas
    const handleCanvasClick = () => {
        switch(gameState.current) {
            case gameState.getReady:
                gameState.current = gameState.play;
                break;
            case gameState.play:
                // bird.flap(); // O passarinho voa
                break;
            case gameState.gameOver:
                // AQUI ENTRA A INTEGRAÇÃO COM O CONTEXT API DO SUPABASE DEPOIS
                // Exemplo: saveScore(score.current);
                navigate('/ranking'); // Redireciona para o ranking após perder
                break;
        }
    };

    cvs.addEventListener('click', handleCanvasClick);

    // Inicia o jogo
    bgImg.onload = () => loop();

    // Cleanup: cancela a animação e remove eventos se o componente for desmontado (mudança de rota)
    return () => {
        cancelAnimationFrame(animationFrameId);
        cvs.removeEventListener('click', handleCanvasClick);
    };
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <canvas ref={canvasRef} id="game" width="276" height="414" className="border border-black"></canvas>
    </div>
  );
}