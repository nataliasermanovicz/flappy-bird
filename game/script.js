const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

let frames = 0;

// --- 1. CARREGAMENTO DAS IMAGENS ---
const imgBackground = new Image();
imgBackground.src = '../assets/sprites/background-day.png';

const imgBase = new Image();
imgBase.src = '../assets/sprites/base.png';

const imgLogo = new Image();
imgLogo.src = '../assets/sprites/flappy-bird.png';

const imgPlay = new Image();
imgPlay.src = '../assets/sprites/play-game.png';

const imgRank = new Image();
imgRank.src = '../assets/sprites/rank.png';

// --- 2. ELEMENTOS DO JOGO ---

// [Plano de Fundo]
const planoDeFundo = {
  x: 0,
  y: canvas.height - 512,
  largura: 288,
  desenha() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0, 0, canvas.width, canvas.height);

    // Repete o background preenchendo toda a largura do canvas sem deixar buracos
    for (let x = planoDeFundo.x; x < canvas.width; x += planoDeFundo.largura) {
      contexto.drawImage(imgBackground, x, planoDeFundo.y);
    }
  }
};

// [Chão]
function criaChao() {
  const chao = {
    x: 0,
    y: canvas.height - 112,
    largura: 288, // Ajuste para a largura do seu base.png se for diferente
    atualiza() {
      const movimentoDoChao = 1;
      const repeteEm = 14; // Tamanho do padrão de repetição da textura
      const movimentacao = chao.x - movimentoDoChao;

      chao.x = movimentacao % repeteEm;
    },
    desenha() {
      // Repete o chão cobrindo toda a largura + margem de segurança
      for (let x = chao.x; x < canvas.width + chao.largura; x += chao.largura) {
        contexto.drawImage(imgBase, x, chao.y);
      }
    }
  };
  return chao;
}

// [Botões da Tela Inicial]
const botaoPlay = {
  x: (canvas.width / 2) - 60, // Centralizado na esquerda/meio
  y: 280,
  largura: 52,
  altura: 29,
  desenha() {
    contexto.drawImage(imgPlay, botaoPlay.x, botaoPlay.y);
  }
};

const botaoRank = {
  x: (canvas.width / 2) + 10, // Ao lado do botão Play
  y: 280,
  largura: 52,
  altura: 29,
  desenha() {
    contexto.drawImage(imgRank, botaoRank.x, botaoRank.y);
  }
};

// [Logo do Jogo]
const logoFlappyBird = {
  x: (canvas.width / 2) - 96,
  y: 120,
  desenha() {
    contexto.drawImage(imgLogo, logoFlappyBird.x, logoFlappyBird.y);
  }
};

// --- 3. GERENCIADOR DE TELAS ---
const globais = {};
let telaAtiva = {};

function mudaParaTela(novaTela) {
  telaAtiva = novaTela;
  if (telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

const Telas = {
  INICIO: {
    inicializa() {
      globais.chao = criaChao();
    },
    desenha() {
      planoDeFundo.desenha();
      globais.chao.desenha();
      logoFlappyBird.desenha();
      botaoPlay.desenha();
      botaoRank.desenha();
    },
    atualiza() {
      globais.chao.atualiza();
    },
    click(clickX, clickY) {
      // Verifica se o clique foi DENTRO da área do Botão Play
      const clicouNoPlay = (
        clickX >= botaoPlay.x &&
        clickX <= botaoPlay.x + botaoPlay.largura &&
        clickY >= botaoPlay.y &&
        clickY <= botaoPlay.y + botaoPlay.altura
      );

      if (clicouNoPlay) {
        mudaParaTela(Telas.JOGO);
      }
    }
  },

  JOGO: {
    inicializa() {
      // Aqui iremos inicializar o Passarinho, Canos e Placar
    },
    desenha() {
      planoDeFundo.desenha();
      globais.chao.desenha();
    },
    atualiza() {
      globais.chao.atualiza();
    },
    click(clickX, clickY) {
      // Faz o passarinho pular durante o jogo
    }
  }
};

// --- 4. TRATAMENTO DE CLIQUE COM CORREÇÃO DE ESCALA ---
window.addEventListener('click', function (evento) {
  if (telaAtiva.click) {
    // Converte a posição do clique na tela real para a escala interna do Canvas (320x480)
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (evento.clientX - rect.left) * scaleX;
    const clickY = (evento.clientY - rect.top) * scaleY;

    telaAtiva.click(clickX, clickY);
  }
});

// --- 5. LOOP DE ANIMAÇÃO ---
function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();

  frames = frames + 1;
  requestAnimationFrame(loop);
}

// Inicia na Tela de Início
mudaParaTela(Telas.INICIO);
loop();