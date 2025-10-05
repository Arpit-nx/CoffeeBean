export const showEntranceAnimation = (): void => {
  const overlay = document.querySelector('.entrance-overlay') as HTMLElement;
  if (overlay) {
    setTimeout(() => {
      overlay.classList.add('fade-out');
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 1000);
    }, 2000);
  }
};

export const showTransactionModal = (
  success: boolean,
  title: string,
  message: string
): void => {
  const modal = document.getElementById('transactionModal') as HTMLElement;
  const modalIcon = document.getElementById('modalIcon') as HTMLElement;
  const modalTitle = document.getElementById('modalTitle') as HTMLElement;
  const modalMessage = document.getElementById('modalMessage') as HTMLElement;

  if (success) {
    modalIcon.innerHTML = '<div class="success-animation">✓</div>';
    modal.classList.add('modal-success');
    modal.classList.remove('modal-error');
  } else {
    modalIcon.innerHTML = '<div class="error-animation">✕</div>';
    modal.classList.add('modal-error');
    modal.classList.remove('modal-success');
  }

  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modal.classList.add('show');

  const particles = createParticles(success);
  modal.appendChild(particles);
};

export const hideTransactionModal = (): void => {
  const modal = document.getElementById('transactionModal') as HTMLElement;
  modal.classList.remove('show');

  setTimeout(() => {
    const particles = modal.querySelector('.particles');
    if (particles) {
      particles.remove();
    }
  }, 300);
};

const createParticles = (success: boolean): HTMLElement => {
  const container = document.createElement('div');
  container.className = 'particles';

  const particleCount = 30;
  const emoji = success ? '✨' : '💥';

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.textContent = emoji;
    particle.style.setProperty('--tx', `${Math.random() * 200 - 100}px`);
    particle.style.setProperty('--ty', `${Math.random() * 200 - 100}px`);
    particle.style.animationDelay = `${Math.random() * 0.5}s`;
    container.appendChild(particle);
  }

  return container;
};

export const pulseElement = (element: HTMLElement): void => {
  element.classList.add('pulse');
  setTimeout(() => {
    element.classList.remove('pulse');
  }, 600);
};

export const shakeElement = (element: HTMLElement): void => {
  element.classList.add('shake');
  setTimeout(() => {
    element.classList.remove('shake');
  }, 600);
};
