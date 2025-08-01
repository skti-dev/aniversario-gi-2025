class HeartAnimation {
  constructor() {
    this.canvas = document.getElementById("heartCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.fireworkHearts = [];
    this.sparkles = [];
    this.rotationAngle = 0;
    this.time = 0;

    this.setupCanvas();
    this.animate();
    this.createFireworkHearts();
  }

  setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  }

  // Função para desenhar um coração matemático realista
  drawRealisticHeart(x, y, size, rotation = 0, color = "#ff1744") {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    this.ctx.scale(size, size);

    // Gradiente para dar profundidade
    const gradient = this.ctx.createRadialGradient(0, -10, 5, 0, -10, 30);
    gradient.addColorStop(0, "#ff4569");
    gradient.addColorStop(0.3, color);
    gradient.addColorStop(0.7, "#d01040");
    gradient.addColorStop(1, "#8b0000");

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();

    // Equação matemática do coração
    for (let t = 0; t <= 2 * Math.PI; t += 0.01) {
      const heartX = 16 * Math.pow(Math.sin(t), 3);
      const heartY = -(
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      );

      if (t === 0) {
        this.ctx.moveTo(heartX, heartY);
      } else {
        this.ctx.lineTo(heartX, heartY);
      }
    }

    this.ctx.closePath();
    this.ctx.fill();

    // Adicionar brilho interno
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    this.ctx.beginPath();
    for (let t = 0; t <= Math.PI; t += 0.01) {
      const heartX = 16 * Math.pow(Math.sin(t), 3) * 0.6;
      const heartY =
        -(
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)
        ) * 0.6;

      if (t === 0) {
        this.ctx.moveTo(heartX, heartY);
      } else {
        this.ctx.lineTo(heartX, heartY);
      }
    }
    this.ctx.fill();

    this.ctx.restore();
  }

  // Coração principal no centro
  drawMainHeart() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2 - 50;
    const size = 3 + Math.sin(this.time * 0.002) * 0.3; // Pulsação suave

    this.ctx.save();
    this.ctx.shadowColor = "rgba(255, 23, 68, 0.5)";
    this.ctx.shadowBlur = 30;
    this.ctx.shadowOffsetX = 5;
    this.ctx.shadowOffsetY = 5;

    this.drawRealisticHeart(
      centerX,
      centerY,
      size,
      this.rotationAngle,
      "#ff1744"
    );
    this.ctx.restore();
  }

  // Classe para corações de fogo de artifício
  createFireworkHeart() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2 - 50;

    return {
      x: centerX + (Math.random() - 0.5) * 100,
      y: centerY + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      size: Math.random() * 0.8 + 0.2,
      life: 1,
      decay: Math.random() * 0.02 + 0.005,
      color: `hsl(${Math.random() * 60 + 320}, 100%, ${
        Math.random() * 30 + 50
      }%)`,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
    };
  }

  // Gerenciar corações de fogo de artifício
  createFireworkHearts() {
    setInterval(() => {
      for (let i = 0; i < 3; i++) {
        this.fireworkHearts.push(this.createFireworkHeart());
      }
    }, 800);
  }

  updateFireworkHearts() {
    for (let i = this.fireworkHearts.length - 1; i >= 0; i--) {
      const heart = this.fireworkHearts[i];

      heart.x += heart.vx;
      heart.y += heart.vy;
      heart.vy += 0.1; // Gravidade
      heart.vx *= 0.98; // Resistência do ar
      heart.life -= heart.decay;
      heart.rotation += heart.rotationSpeed;

      if (heart.life <= 0) {
        this.fireworkHearts.splice(i, 1);
      }
    }
  }

  drawFireworkHearts() {
    this.fireworkHearts.forEach((heart) => {
      this.ctx.save();
      this.ctx.globalAlpha = heart.life;
      this.drawRealisticHeart(
        heart.x,
        heart.y,
        heart.size,
        heart.rotation,
        heart.color
      );
      this.ctx.restore();
    });
  }

  // Partículas brilhantes
  createSparkle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 3 + 1,
      life: Math.random() * 100 + 50,
      maxLife: 150,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    };
  }

  updateSparkles() {
    // Adicionar novas partículas
    if (Math.random() < 0.3) {
      this.sparkles.push(this.createSparkle());
    }

    // Atualizar partículas existentes
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const sparkle = this.sparkles[i];
      sparkle.x += sparkle.vx;
      sparkle.y += sparkle.vy;
      sparkle.life--;

      if (sparkle.life <= 0) {
        this.sparkles.splice(i, 1);
      }
    }
  }

  drawSparkles() {
    this.sparkles.forEach((sparkle) => {
      const alpha = sparkle.life / sparkle.maxLife;
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = "#ffffff";
      this.ctx.shadowColor = "#ffffff";
      this.ctx.shadowBlur = 10;

      this.ctx.beginPath();
      this.ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Efeito de estrela
      this.ctx.strokeStyle = "#ffffff";
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(sparkle.x - sparkle.size * 2, sparkle.y);
      this.ctx.lineTo(sparkle.x + sparkle.size * 2, sparkle.y);
      this.ctx.moveTo(sparkle.x, sparkle.y - sparkle.size * 2);
      this.ctx.lineTo(sparkle.x, sparkle.y + sparkle.size * 2);
      this.ctx.stroke();

      this.ctx.restore();
    });
  }

  animate() {
    this.time++;
    this.rotationAngle += 0.005; // Rotação lenta do coração principal

    // Limpar canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Desenhar elementos
    this.updateSparkles();
    this.drawSparkles();

    this.updateFireworkHearts();
    this.drawFireworkHearts();

    this.drawMainHeart();

    requestAnimationFrame(() => this.animate());
  }
}

// Inicializar quando a página carregar
window.addEventListener("load", () => {
  new HeartAnimation();
});

// Adicionar efeito de clique para criar mais corações
document.addEventListener("click", (e) => {
  const heartAnimation = new HeartAnimation();
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      heartAnimation.fireworkHearts.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        size: Math.random() * 1.2 + 0.3,
        life: 1,
        decay: Math.random() * 0.015 + 0.008,
        color: `hsl(${Math.random() * 60 + 320}, 100%, ${
          Math.random() * 30 + 60
        }%)`,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
      });
    }, i * 100);
  }
});
