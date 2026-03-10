document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     1. 메뉴 클릭 부드러운 스크롤
  ========================= */
  const navLinks = document.querySelectorAll(".nav a");

  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      if (targetId.startsWith("#")) {
        e.preventDefault();

        const target = document.querySelector(targetId);

        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    });
  });

  /* =========================
     2. 무한 슬라이더
  ========================= */
  const track = document.querySelector(".slider-track");
  const nextBtn = document.querySelector(".slider-btn.next");
  const prevBtn = document.querySelector(".slider-btn.prev");
  const sliderWindow = document.querySelector(".slider-window");
  const dotsContainer = document.querySelector(".slider-dots");

  if (track && nextBtn && prevBtn) {
    const originalCards = Array.from(track.children);
    const gap = 20;

    function getVisibleCount() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    let visibleCount = getVisibleCount();
    let currentIndex = visibleCount;
    let autoSlide;
    const autoDelay = 3000;

    function setupInfiniteSlider() {
      track.innerHTML = "";
      visibleCount = getVisibleCount();

      const originals = [...originalCards];

      const headClones = originals
        .slice(-visibleCount)
        .map(card => card.cloneNode(true));

      const tailClones = originals
        .slice(0, visibleCount)
        .map(card => card.cloneNode(true));

      [...headClones, ...originals, ...tailClones].forEach(card => {
        track.appendChild(card);
      });

      createDots(originals.length);
    }

    function createDots(count) {
      if (!dotsContainer) return;

      dotsContainer.innerHTML = "";

      for (let i = 0; i < count; i++) {
        const dot = document.createElement("div");
        dot.classList.add("slider-dot");

        dot.addEventListener("click", () => {
          currentIndex = i + visibleCount;
          moveToIndex(true);
          startAutoSlide();
        });

        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsContainer) return;

      const dots = dotsContainer.querySelectorAll(".slider-dot");
      const realIndex =
        (currentIndex - visibleCount + originalCards.length) % originalCards.length;

      dots.forEach(dot => dot.classList.remove("active"));

      if (dots[realIndex]) {
        dots[realIndex].classList.add("active");
      }
    }

    function getCardWidth() {
      const card = track.querySelector(".product-card");
      return card.offsetWidth + gap;
    }

    function moveToIndex(withAnimation = true) {
      const cardWidth = getCardWidth();

      track.style.transition = withAnimation
        ? "transform 0.4s ease"
        : "none";

      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      updateDots();
    }

    function startAutoSlide() {
      stopAutoSlide();
      autoSlide = setInterval(() => {
        currentIndex++;
        moveToIndex(true);
      }, autoDelay);
    }

    function stopAutoSlide() {
      clearInterval(autoSlide);
    }

    setupInfiniteSlider();
    moveToIndex(false);
    startAutoSlide();

    nextBtn.addEventListener("click", () => {
      currentIndex++;
      moveToIndex(true);
      startAutoSlide();
    });

    prevBtn.addEventListener("click", () => {
      currentIndex--;
      moveToIndex(true);
      startAutoSlide();
    });

    track.addEventListener("transitionend", () => {
      const originalsLength = originalCards.length;

      if (currentIndex >= originalsLength + visibleCount) {
        currentIndex = visibleCount;
        moveToIndex(false);
      }

      if (currentIndex < visibleCount) {
        currentIndex = originalsLength + visibleCount - 1;
        moveToIndex(false);
      }
    });

    if (sliderWindow) {
      sliderWindow.addEventListener("mouseenter", stopAutoSlide);
      sliderWindow.addEventListener("mouseleave", startAutoSlide);
    }

    window.addEventListener("resize", () => {
      setupInfiniteSlider();
      currentIndex = getVisibleCount();
      moveToIndex(false);
    });
  }

  /* =========================
     3. 스크롤 등장 애니메이션
  ========================= */
  const revealTargets = document.querySelectorAll(
    ".section, .product-card, .process-item, .concept-box, .preview-item"
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, {
    threshold: 0.15
  });

  revealTargets.forEach(item => {
    item.classList.add("hidden");
    observer.observe(item);
  });

  /* =========================
     4. Scroll Spy
  ========================= */
  const sections = document.querySelectorAll("section");
  const menuLinks = document.querySelectorAll(".nav a");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    menuLinks.forEach(link => {
      link.classList.remove("active");

      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  });

  /* =========================
     5. 이미지 확대 모달
  ========================= */
  const zoomableImages = document.querySelectorAll(".zoomable");
  const imageModal = document.getElementById("imageModal");
  const imageModalImg = document.getElementById("imageModalImg");
  const imageModalClose = document.getElementById("imageModalClose");

  if (zoomableImages.length && imageModal && imageModalImg && imageModalClose) {
    zoomableImages.forEach(img => {
      img.addEventListener("click", () => {
        imageModal.classList.add("show");
        imageModalImg.src = img.src;
        imageModalImg.alt = img.alt;
      });
    });

    imageModalClose.addEventListener("click", () => {
      imageModal.classList.remove("show");
    });

    imageModal.addEventListener("click", (e) => {
      if (e.target === imageModal) {
        imageModal.classList.remove("show");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        imageModal.classList.remove("show");
      }
    });
  }

  /* =========================
     6. 맨 위로 이동 버튼
  ========================= */
  const topBtn = document.getElementById("topBtn");

  if (topBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        topBtn.style.display = "block";
      } else {
        topBtn.style.display = "none";
      }
    });

    topBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

});