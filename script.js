/* =========================================================
   CONVITE — JOÃO MIGUEL · 12 ANOS
   Script principal
   ========================================================= */

(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================================================
     1) CURSOR COM BRILHO
     ========================================================= */
  const cursor = document.getElementById("ninjaCursor");
  if (cursor && !reducedMotion) {
    window.addEventListener("pointermove", (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
      cursor.classList.add("active");
    });
    document.addEventListener("pointerleave", () => cursor.classList.remove("active"));

    const hoverTargets = "a, button, .polaroid, .scroll-wrap";
    document.addEventListener("pointerover", (e) => {
      if (e.target.closest(hoverTargets)) cursor.classList.add("hover");
    });
    document.addEventListener("pointerout", (e) => {
      if (e.target.closest(hoverTargets)) cursor.classList.remove("hover");
    });
  }

  /* =========================================================
     2) CANVAS DE FUNDO — folhas, fumaça e partículas
     ========================================================= */
  const fxCanvas = document.getElementById("fxCanvas");
  const fxCtx = fxCanvas.getContext("2d");
  let W, H;

  function resizeCanvas() {
    W = fxCanvas.width = window.innerWidth;
    H = fxCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // folhas
  const LEAF_COUNT = window.innerWidth < 600 ? 14 : 24;
  const leaves = Array.from({ length: LEAF_COUNT }, () => makeLeaf());

  function makeLeaf() {
    return {
      x: Math.random() * W,
      y: Math.random() * -H,
      size: 8 + Math.random() * 10,
      speedY: 0.4 + Math.random() * 0.8,
      speedX: (Math.random() - 0.5) * 0.6,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      sway: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.5 ? "#c9a15a" : "#8b2635",
      opacity: 0.25 + Math.random() * 0.35,
    };
  }

  function drawLeaf(l) {
    fxCtx.save();
    fxCtx.translate(l.x, l.y);
    fxCtx.rotate(l.rot);
    fxCtx.globalAlpha = l.opacity;
    fxCtx.fillStyle = l.hue;
    fxCtx.beginPath();
    fxCtx.moveTo(0, -l.size);
    fxCtx.quadraticCurveTo(l.size * 0.7, 0, 0, l.size);
    fxCtx.quadraticCurveTo(-l.size * 0.7, 0, 0, -l.size);
    fxCtx.fill();
    fxCtx.restore();
  }

  // partículas (poeira/chakra)
  const PARTICLE_COUNT = window.innerWidth < 600 ? 30 : 55;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => makeParticle());

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.6 + Math.random() * 1.6,
      speedY: -(0.15 + Math.random() * 0.35),
      drift: (Math.random() - 0.5) * 0.3,
      opacity: 0.15 + Math.random() * 0.35,
    };
  }

  // fumaça (blobs suaves)
  const smokeBlobs = Array.from({ length: 4 }, (_, i) => ({
    x: (W / 4) * i + Math.random() * 100,
    y: H * (0.3 + Math.random() * 0.5),
    r: 140 + Math.random() * 120,
    speed: 0.06 + Math.random() * 0.08,
    phase: Math.random() * Math.PI * 2,
  }));

  let fxRunning = true;
  document.addEventListener("visibilitychange", () => {
    fxRunning = !document.hidden;
  });

  function animateFX() {
    requestAnimationFrame(animateFX);
    if (!fxRunning) return;
    fxCtx.clearRect(0, 0, W, H);

    // fumaça
    smokeBlobs.forEach((b) => {
      b.phase += b.speed * 0.01;
      const x = b.x + Math.sin(b.phase) * 40;
      const y = b.y + Math.cos(b.phase * 0.7) * 20;
      const grad = fxCtx.createRadialGradient(x, y, 0, x, y, b.r);
      grad.addColorStop(0, "rgba(60,60,50,0.05)");
      grad.addColorStop(1, "rgba(10,12,9,0)");
      fxCtx.fillStyle = grad;
      fxCtx.beginPath();
      fxCtx.arc(x, y, b.r, 0, Math.PI * 2);
      fxCtx.fill();
    });

    // partículas
    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.drift;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      fxCtx.globalAlpha = p.opacity;
      fxCtx.fillStyle = "#e6c98a";
      fxCtx.beginPath();
      fxCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      fxCtx.fill();
      fxCtx.globalAlpha = 1;
    });

    // folhas
    leaves.forEach((l) => {
      l.sway += 0.02;
      l.y += l.speedY;
      l.x += l.speedX + Math.sin(l.sway) * 0.6;
      l.rot += l.rotSpeed;
      if (l.y > H + 20) {
        l.y = -20;
        l.x = Math.random() * W;
      }
      drawLeaf(l);
    });
  }
  animateFX();

  /* =========================================================
     3) INTRO — efeito de digitação + abertura do pergaminho
     ========================================================= */
  const introEl = document.getElementById("intro");
  const line1 = document.getElementById("introLine1");
  const line2 = document.getElementById("introLine2");
  const scrollButton = document.getElementById("scrollButton");
  const mainEl = document.getElementById("main");

  function typeText(el, text, speed = 55) {
    return new Promise((resolve) => {
      el.hidden = false;
      el.classList.add("typing-cursor");
      let i = 0;
      const timer = setInterval(() => {
        el.textContent = text.slice(0, i + 1);
        i++;
        if (i >= text.length) {
          clearInterval(timer);
          el.classList.remove("typing-cursor");
          resolve();
        }
      }, speed);
    });
  }

  async function runIntroSequence() {
    if (reducedMotion) {
      line1.textContent = "Uma missão especial foi enviada...";
      line2.hidden = false;
      line2.textContent = "Você recebeu um convite especial...";
      scrollButton.hidden = false;
      return;
    }
    await typeText(line1, "Uma missão especial foi enviada...");
    await wait(900);
    await typeText(line2, "Você recebeu um convite especial...");
    await wait(500);
    scrollButton.hidden = false;
  }

  function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

  runIntroSequence();

  scrollButton.addEventListener("click", () => {
    scrollButton.classList.add("opening");
    burstConfetti(window.innerWidth / 2, window.innerHeight / 2, 90);
    burstSmoke(window.innerWidth / 2, window.innerHeight / 2);
    setTimeout(() => {
      introEl.classList.add("hide");
      mainEl.hidden = false;
      document.body.style.cursor = "default";
      setTimeout(() => introEl.remove(), 1200);
      initRevealObserver();
      buildGallery();
      startCountdown();
    }, 550);
  }, { once: true });

  /* efeito de "fumaça de invocação" no momento da abertura do pergaminho */
  function burstSmoke(x, y, count = 18) {
    const puffs = Array.from({ length: count }, () => ({
      x: x + (Math.random() - 0.5) * 40,
      y: y + (Math.random() - 0.5) * 40,
      r: 10,
      maxR: 60 + Math.random() * 70,
      vx: (Math.random() - 0.5) * 1.4,
      vy: (Math.random() - 0.5) * 1.4,
      life: 0,
    }));

    function step() {
      puffs.forEach((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.r += (p.maxR - p.r) * 0.04;
        const alpha = Math.max(0, 0.3 - p.life / 200);
        const grad = fxCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, `rgba(230,224,210,${alpha})`);
        grad.addColorStop(1, "rgba(230,224,210,0)");
        fxCtx.fillStyle = grad;
        fxCtx.beginPath();
        fxCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        fxCtx.fill();
      });
      if (puffs[0].life < 70) requestAnimationFrame(step);
    }
    step();
  }

  /* =========================================================
     4) CONFETES (canvas simples reaproveitando fxCanvas)
     ========================================================= */
  function burstConfetti(x, y, count = 60) {
    const colors = ["#c9a15a", "#8b2635", "#e6c98a", "#f3ecd8"];
    const bits = Array.from({ length: count }, () => ({
      x, y,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * -10 - 4,
      size: 4 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.3,
      life: 0,
    }));

    function step() {
      fxCtx.save();
      bits.forEach((b) => {
        b.life++;
        b.vy += 0.28; // gravidade
        b.x += b.vx;
        b.y += b.vy;
        b.rot += b.rotSpeed;
        fxCtx.save();
        fxCtx.translate(b.x, b.y);
        fxCtx.rotate(b.rot);
        fxCtx.globalAlpha = Math.max(0, 1 - b.life / 90);
        fxCtx.fillStyle = b.color;
        fxCtx.fillRect(-b.size / 2, -b.size / 2, b.size, b.size);
        fxCtx.restore();
      });
      fxCtx.restore();
      if (bits[0].life < 90) requestAnimationFrame(step);
    }
    step();
  }

  /* =========================================================
     5) REVEAL ON SCROLL
     ========================================================= */
  function initRevealObserver() {
    const items = document.querySelectorAll(".reveal, .polaroid");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    items.forEach((el) => io.observe(el));

    // dispara fogos quando a seção final entra em cena
    const finalSection = document.getElementById("finalSection");
    const finalIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startFireworks();
          finalIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    finalIO.observe(finalSection);
  }

  /* =========================================================
     6) GALERIA — preparado para adicionar mais fotos depois
     Basta acrescentar itens neste array.
     ========================================================= */
  const galleryPhotos = [
    { src: "assets/fotos/foto1.jpg", caption: "João Miguel", tilt: "-3deg" },
    { src: "assets/fotos/foto2.jpg", caption: "João Miguel", tilt: "2deg" },
    { src: "assets/fotos/foto3.jpg", caption: "João Miguel", tilt: "-1deg" },
  ];

  function buildGallery() {
    const grid = document.getElementById("galleryGrid");
    if (!grid || grid.dataset.built) return;
    grid.dataset.built = "true";

    galleryPhotos.forEach((photo) => {
      const fig = document.createElement("figure");
      fig.className = "polaroid";
      fig.style.setProperty("--tilt", photo.tilt || "-2deg");

      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.caption || "Foto do João Miguel";
      img.loading = "lazy";
      img.onerror = () => {
        fig.classList.add("placeholder-card");
        fig.innerHTML = `<p>Adicione uma foto em<br><strong>${photo.src}</strong></p>`;
      };

      const caption = document.createElement("figcaption");
      caption.textContent = photo.caption || "";

      fig.appendChild(img);
      fig.appendChild(caption);
      grid.appendChild(fig);
    });

    initGalleryObserverFallback();
  }

  function initGalleryObserverFallback() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll(".polaroid").forEach((el) => io.observe(el));
  }

  /* =========================================================
     7) CONTAGEM REGRESSIVA
     ========================================================= */
  function startCountdown() {
    const target = new Date(2026, 7, 27, 16, 0, 0); // 27/ago/2026 16:00 (mês 7 = agosto)
    const note = document.getElementById("countdownNote");

    function update() {
      const now = new Date();
      let diff = target - now;

      if (diff <= 0) {
        document.getElementById("cdDays").textContent = "00";
        document.getElementById("cdHours").textContent = "00";
        document.getElementById("cdMinutes").textContent = "00";
        document.getElementById("cdSeconds").textContent = "00";
        note.textContent = "A missão começou! 🎉";
        clearInterval(timer);
        return;
      }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      document.getElementById("cdDays").textContent = String(d).padStart(2, "0");
      document.getElementById("cdHours").textContent = String(h).padStart(2, "0");
      document.getElementById("cdMinutes").textContent = String(m).padStart(2, "0");
      document.getElementById("cdSeconds").textContent = String(s).padStart(2, "0");
      note.textContent = "até o início da celebração";
    }

    update();
    const timer = setInterval(update, 1000);
  }

  /* =========================================================
     8) RSVP — abrir WhatsApp com mensagem pronta
     ========================================================= */
  const rsvpButton = document.getElementById("rsvpButton");
  const WHATSAPP_NUMBER = "5527998847045";
  const WHATSAPP_MESSAGE =
    "Olá! Confirmo minha presença no aniversário de 12 anos do João Miguel no dia 27 de agosto às 16h. 🎉";

  rsvpButton.addEventListener("click", () => {
    burstConfetti(window.innerWidth / 2, window.innerHeight * 0.6, 70);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    setTimeout(() => window.open(url, "_blank", "noopener"), 300);
  });

  /* =========================================================
     9) FOGOS — seção final
     ========================================================= */
  const finalCanvas = document.getElementById("finalCanvas");
  const finalCtx = finalCanvas.getContext("2d");
  let fireworksStarted = false;

  function resizeFinalCanvas() {
    const rect = finalCanvas.parentElement.getBoundingClientRect();
    finalCanvas.width = rect.width;
    finalCanvas.height = rect.height;
  }

  function startFireworks() {
    if (fireworksStarted) return;
    fireworksStarted = true;
    resizeFinalCanvas();
    window.addEventListener("resize", resizeFinalCanvas);

    const rockets = [];
    const colors = ["#c9a15a", "#8b2635", "#e6c98a", "#f3ecd8", "#d4622b"];

    function spawnRocket() {
      const fw = finalCanvas.width;
      const fh = finalCanvas.height;
      rockets.push({
        x: fw * (0.15 + Math.random() * 0.7),
        y: fh,
        targetY: fh * (0.2 + Math.random() * 0.35),
        speed: 5 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        exploded: false,
        particles: [],
      });
    }

    let spawnTimer = setInterval(spawnRocket, 900);
    spawnRocket();

    let frames = 0;
    const maxFrames = 60 * 14; // ~14s de fogos

    function loop() {
      frames++;
      finalCtx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);

      rockets.forEach((r) => {
        if (!r.exploded) {
          r.y -= r.speed;
          finalCtx.fillStyle = r.color;
          finalCtx.beginPath();
          finalCtx.arc(r.x, r.y, 2.4, 0, Math.PI * 2);
          finalCtx.fill();

          if (r.y <= r.targetY) {
            r.exploded = true;
            const pCount = 40;
            for (let i = 0; i < pCount; i++) {
              const angle = (Math.PI * 2 * i) / pCount;
              const speed = 1.5 + Math.random() * 2.5;
              r.particles.push({
                x: r.x, y: r.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0,
              });
            }
          }
        } else {
          r.particles.forEach((p) => {
            p.life++;
            p.vy += 0.05;
            p.x += p.vx;
            p.y += p.vy;
            finalCtx.globalAlpha = Math.max(0, 1 - p.life / 60);
            finalCtx.fillStyle = r.color;
            finalCtx.beginPath();
            finalCtx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            finalCtx.fill();
            finalCtx.globalAlpha = 1;
          });
        }
      });

      if (frames < maxFrames) {
        requestAnimationFrame(loop);
      } else {
        clearInterval(spawnTimer);
        finalCtx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
      }
    }
    if (!reducedMotion) loop();
  }

  /* =========================================================
     10) MÚSICA (opcional, off por padrão)
     ========================================================= */
  const musicToggle = document.getElementById("musicToggle");
  const bgMusic = document.getElementById("bgMusic");
  let musicOn = false;

  musicToggle.addEventListener("click", () => {
    musicOn = !musicOn;
    if (musicOn) {
      bgMusic.volume = 0.4;
      bgMusic.play().catch(() => {
        musicToggle.textContent = "🔇";
        musicOn = false;
      });
      musicToggle.textContent = "🔊";
    } else {
      bgMusic.pause();
      musicToggle.textContent = "🔇";
    }
  });

  /* =========================================================
     11) PWA — registro do service worker (opcional)
     ========================================================= */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {
        /* ambiente sem suporte a service worker — segue normalmente */
      });
    });
  }
})();
