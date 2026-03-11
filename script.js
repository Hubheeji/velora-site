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

  /* =========================
     7. 장바구니 기능
  ========================= */
  const cartTrigger = document.getElementById("cartTrigger");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartClose = document.getElementById("cartClose");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartClear = document.getElementById("cartClear");
  const cartOrderBtn = document.querySelector(".cart-order-btn");
  const toast = document.getElementById("toast");

  const productPrices = {
    "Ruby Nocturne": 6500,
    "Azure Pulse": 6500,
    "Emerald Spark": 6800,
    "Blush Serenade": 6900,
    "Midnight Bloom": 7200,
    "VELORA Gift Set": 29000
  };

  let cart = JSON.parse(localStorage.getItem("veloraCart")) || [];
  let toastTimer;

  function formatPrice(price) {
    return `${price.toLocaleString("ko-KR")}원`;
  }

  function showToast(message, subMessage = "") {
    if (!toast) return;

    clearTimeout(toastTimer);
    toast.innerHTML = `
      <span class="toast-check">✔</span>
      <div class="toast-content">
        <strong>${message}</strong>
        ${subMessage ? `<span>${subMessage}</span>` : ""}
      </div>
    `;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
  }

  function saveCart() {
    localStorage.setItem("veloraCart", JSON.stringify(cart));
  }

  function updateCartCount() {
    if (!cartCount) return;

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalQty;
  }

  function getTotalPrice() {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  function renderCart() {
    if (!cartItems) return;

    if (cart.length === 0) {
      cartItems.innerHTML = `<p class="cart-empty">아직 담긴 상품이 없습니다.</p>`;
      updateCartCount();
      saveCart();
      return;
    }

    const itemsHtml = cart.map((item, index) => `
      <div class="cart-item">
        <div class="cart-item-top">
          <h4>${item.name}</h4>
          <span class="cart-item-qty">× ${item.qty}</span>
        </div>
        <p>${item.desc}</p>
        <div class="cart-item-bottom">
          <span class="cart-item-price">${formatPrice(item.price * item.qty)}</span>
          <button type="button" class="remove-cart-item" data-index="${index}">삭제</button>
        </div>
      </div>
    `).join("");

    const totalHtml = `
      <div class="cart-total">
        <span>총 합계</span>
        <strong>${formatPrice(getTotalPrice())}</strong>
      </div>
    `;

    cartItems.innerHTML = itemsHtml + totalHtml;

    updateCartCount();
    saveCart();
  }

  function addToCart(name, desc) {
    const price = productPrices[name] || 6500;
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
      existingItem.qty += 1;
      showToast(`${name} 수량이 추가되었습니다.`, `현재 ${existingItem.qty}개 담겨 있습니다.`);
    } else {
      cart.push({
        name,
        desc,
        price,
        qty: 1
      });
      showToast(`${name}을 장바구니에 담았습니다.`, `${formatPrice(price)} / VELORA 라인업`);
    }

    renderCart();
  }

  function openCart() {
    if (cartDrawer) {
      cartDrawer.classList.add("show");
      cartDrawer.setAttribute("aria-hidden", "false");
    }

    if (cartOverlay) {
      cartOverlay.classList.add("show");
    }
  }

  function closeCart() {
    if (cartDrawer) {
      cartDrawer.classList.remove("show");
      cartDrawer.setAttribute("aria-hidden", "true");
    }

    if (cartOverlay) {
      cartOverlay.classList.remove("show");
    }
  }

  if (cartTrigger) {
    cartTrigger.addEventListener("click", openCart);
  }

  if (cartClose) {
    cartClose.addEventListener("click", closeCart);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCart);
  }

  if (cartClear) {
    cartClear.addEventListener("click", () => {
      cart = [];
      renderCart();
      showToast("장바구니를 비웠습니다.");
    });
  }

  if (cartOrderBtn) {
    cartOrderBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("장바구니가 비어 있습니다.");
      } else {
        alert("VELORA 데모 스토어입니다.\n현재는 실제 결제 기능 없이 장바구니 체험만 가능합니다.");
      }
    });
  }

  document.addEventListener("click", (e) => {
    const cartBtn = e.target.closest(".cart-btn, .gift-cart-btn");
    const buyBtn = e.target.closest(".buy-now-btn");
    const removeBtn = e.target.closest(".remove-cart-item");

    if (cartBtn) {
      const name = cartBtn.dataset.name;
      const desc = cartBtn.dataset.desc;

      addToCart(name, desc);
      openCart();
    }

    if (buyBtn) {
      const name = buyBtn.dataset.name;
      showToast(`${name} 구매는 현재 데모 체험용입니다.`, "실제 결제 기능은 준비 중입니다.");
    }

    if (removeBtn) {
      const index = Number(removeBtn.dataset.index);

      if (cart[index].qty > 1) {
        cart[index].qty -= 1;
        showToast(`${cart[index].name} 수량을 1개 줄였습니다.`);
      } else {
        showToast(`${cart[index].name}을 장바구니에서 삭제했습니다.`);
        cart.splice(index, 1);
      }

      renderCart();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCart();
    }
  });

  renderCart();
});