document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cursorLight = document.getElementById("cursorLight");
  const coordinates = document.getElementById("coordinates");
  const systemStatus = document.getElementById("systemStatus");
  const typingText = document.getElementById("typingText");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalType = document.getElementById("modalType");
  const modalDesc = document.getElementById("modalDesc");
  const modalStack = document.getElementById("modalStack");
  const closeModal = document.getElementById("closeModal");

  let pointerX = 0;
  let pointerY = 0;
  let pointerFrame = 0;

  function updatePointerUi() {
    pointerFrame = 0;

    if (cursorLight) {
      cursorLight.classList.add("is-active");
      cursorLight.style.transform = `translate3d(${pointerX - 140}px, ${pointerY - 140}px, 0)`;
    }

    if (coordinates) {
      const x = String(pointerX).padStart(4, "0");
      const y = String(pointerY).padStart(4, "0");
      coordinates.textContent = `X: ${x} / Y: ${y}`;
    }
  }

  document.addEventListener(
    "pointermove",
    (event) => {
      pointerX = Math.round(event.clientX);
      pointerY = Math.round(event.clientY);

      if (!pointerFrame) {
        pointerFrame = window.requestAnimationFrame(updatePointerUi);
      }
    },
    { passive: true }
  );

  const typingWords = [
    "INITIALIZING CREATOR SYSTEM...",
    "EVIDENCE BOARD LOADED.",
    "AI VIDEO / WEB DESIGN / CREATIVE CODING",
    "点击项目卡片查看作品档案。"
  ];

  let typingIndex = 0;
  let typingChar = 0;
  let deleting = false;
  let typingTimer = 0;
  let typingRunning = false;

  function typeLoop() {
    if (!typingText) return;
    typingRunning = true;

    const current = typingWords[typingIndex];
    const nextChar = deleting ? typingChar - 1 : typingChar + 1;

    typingText.textContent = `${current.slice(0, nextChar)}_`;
    typingChar = nextChar;

    if (!deleting && typingChar === current.length) {
      deleting = true;
      typingTimer = window.setTimeout(typeLoop, 1100);
      return;
    }

    if (deleting && typingChar === 0) {
      deleting = false;
      typingIndex = (typingIndex + 1) % typingWords.length;
    }

    typingTimer = window.setTimeout(typeLoop, deleting ? 34 : 58);
  }

  function pauseTyping() {
    typingRunning = false;
    window.clearTimeout(typingTimer);
    typingTimer = 0;
  }

  function resumeTyping() {
    if (!typingRunning && !prefersReducedMotion) {
      typeLoop();
    }
  }

  if (prefersReducedMotion) {
    if (typingText) typingText.textContent = typingWords[0];
  } else {
    resumeTyping();
  }

  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("show"));
  }

  const statusTexts = [
    "SYS. DIAGNOSTIC: STABLE",
    "SIGNAL_TRACING: ACTIVE",
    "SECURE_GRID_99: ONLINE",
    "ENCRYPTED_CHANNEL: OPEN",
    "SCANNING_ARCHIVES: TRUE"
  ];

  if (systemStatus && !prefersReducedMotion) {
    window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * statusTexts.length);
      systemStatus.textContent = statusTexts[randomIndex];
    }, 2200);
  }

  const canTiltCards = window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion;

  if (canTiltCards) {
    document.querySelectorAll(".project-card").forEach((card) => {
      let tiltFrame = 0;
      let rotateX = 0;
      let rotateY = 0;

      function applyTilt() {
        tiltFrame = 0;
        card.style.setProperty("--tilt-x", `${rotateX}deg`);
        card.style.setProperty("--tilt-y", `${rotateY}deg`);
      }

      card.addEventListener(
        "pointermove",
        (event) => {
          const rect = card.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
          rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;

          if (!tiltFrame) {
            tiltFrame = window.requestAnimationFrame(applyTilt);
          }
        },
        { passive: true }
      );

      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--tilt-x");
        card.style.removeProperty("--tilt-y");
      });
    });
  }

  function openProject(card) {
    if (!modal || !modalTitle || !modalType || !modalDesc || !modalStack) return;

    modalType.textContent = card.dataset.type || "CASE FILE";
    modalTitle.textContent = card.dataset.title || "Project";
    modalDesc.textContent = card.dataset.desc || "暂无项目介绍。";
    modalStack.textContent = card.dataset.stack || "HTML / CSS / JavaScript";
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeModal?.focus();
  }

  function closeProjectModal() {
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("click", () => openProject(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProject(card);
      }
    });
  });

  closeModal?.addEventListener("click", closeProjectModal);

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeProjectModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProjectModal();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pauseTyping();
    } else {
      resumeTyping();
    }
  });
});
