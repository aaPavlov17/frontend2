document.addEventListener('DOMContentLoaded', () => {

  const works = document.querySelectorAll('.work img');
  const popup = document.getElementById('image-popup');
  const popupImg = document.getElementById('popup-img');
  const popupClose = document.getElementById('popup-close');
  const popupPrev = document.getElementById('popup-prev');
  const popupNext = document.getElementById('popup-next');

  let currentIndex = 0;
  const images = Array.from(works).map(img => img.src);

  function showImage() {
    popupImg.src = images[currentIndex];
    popupPrev.classList.toggle('hidden', currentIndex === 0);
    popupNext.classList.toggle('hidden', currentIndex === images.length - 1);
  }

  works.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentIndex = index;
      showImage();
      popup.classList.remove('hidden');
    });
  });

  popupClose?.addEventListener('click', () => {
    popup.classList.add('hidden');
  });

  popupPrev?.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      showImage();
    }
  });

  popupNext?.addEventListener('click', () => {
    if (currentIndex < images.length - 1) {
      currentIndex++;
      showImage();
    }
  });

  popup?.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.classList.add('hidden');
    }
  });


  const feedbackPopup = document.getElementById("feedbackPopup");
  const openBtn = document.getElementById("openPopupBtn");
  const closeBtn = document.getElementById("closePopupBtn");

  function closeFeedbackPopup() {
    feedbackPopup.classList.remove("show");
    feedbackPopup.classList.add("hide");
    setTimeout(() => {
      feedbackPopup.classList.remove("hide");
    }, 400);
  }

  if (openBtn && feedbackPopup && closeBtn) {
    openBtn.addEventListener("click", () => {
      feedbackPopup.classList.remove("hide");
      feedbackPopup.classList.add("show");
    });

    closeBtn.addEventListener("click", closeFeedbackPopup);

    feedbackPopup.addEventListener("click", (e) => {
      if (e.target === feedbackPopup) {
        closeFeedbackPopup();
      }
    });
  }

  const messagePopup = document.getElementById('messagePopup');
  const messageCloseBtn = document.querySelector('.message-close-btn');

  localStorage.removeItem('messageShown');

  if (!localStorage.getItem('messageShown')) {
    setTimeout(() => {
      messagePopup.classList.remove('hidden');
      setTimeout(() => {
        messagePopup.classList.add('show');
      }, 10);
      localStorage.setItem('messageShown', 'true');
    }, 10000);
  }

  if (messageCloseBtn) {
    messageCloseBtn.addEventListener('click', () => {
      messagePopup.classList.remove('show');
      setTimeout(() => {
        messagePopup.classList.add('hidden');
      }, 400);
    });
  }

  function updateCountdown() {
    const targetDate = new Date('2028-06-30T00:00:00');
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  const contactForm = document.getElementById('contactForm');
  const submitBtn = contactForm?.querySelector('button[type="submit"]');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      const textRegex = /^[a-zA-Zа-яА-ЯёЁ\s.,!?()'"-]+$/u;

      if (!name || !email || !message) {
        alert("Все поля обязательны для заполнения.");
        return;
      }

      if (!emailRegex.test(email)) {
        alert("Неверный формат email.");
        return;
      }

      if (!textRegex.test(message)) {
        alert("Сообщение содержит недопустимые символы.");
        return;
      }

      submitBtn.textContent = "Отправляем...";
      submitBtn.disabled = true;
      submitBtn.style.backgroundColor = "#aaa";
      submitBtn.style.cursor = "wait";

      fetch('#', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
      })
      .then(response => {
        if (response.ok || true) {
          submitBtn.textContent = "Успешно отправлено!";
          submitBtn.style.backgroundColor = "#4CAF50";
          submitBtn.style.color = "#fff";
          submitBtn.style.cursor = "default";
          contactForm.reset();
        } else {
          throw new Error("Ошибка при отправке");
        }
      })
      // .catch(error => {
      //   console.error(error);
      //   alert("Произошла ошибка при отправке формы.");
      //   submitBtn.textContent = "Send Message";
      //   submitBtn.disabled = false;
      //   submitBtn.style.backgroundColor = "";
      //   submitBtn.style.cursor = "pointer";
      // });
    });
  }

  const scrollProgress = {
    elements: {
      container: document.querySelector('.scroll-progress'),
      fill: document.querySelector('.scroll-progress__fill'),
      percentage: document.querySelector('.scroll-progress__percentage')
    },
    
    init() {
      if (!this.elements.fill || !this.elements.percentage) return;
      
      window.addEventListener('scroll', this.handleScroll.bind(this));
      this.handleScroll();
    },
    
    handleScroll() {
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      const progress = Math.min(100, Math.max(0, scrolled));
      
      this.updateProgress(progress);
    },
    
    updateProgress(progress) {
      this.elements.fill.style.width = `${progress}%`;
      this.elements.percentage.textContent = `${Math.round(progress)}%`;
      
      if (progress >= 99.9) {
        this.elements.container.classList.add('completed');
      } else {
        this.elements.container.classList.remove('completed');
      }
    }
  };

  setTimeout(() => scrollProgress.init(), 100);
});
