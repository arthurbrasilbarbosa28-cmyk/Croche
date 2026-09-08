
const PAGE_CONFIG = Object.assign({}, DEFAULT_CONFIG, window.SITE_CONFIG || {});

function mergeCurrentTrackingParams(url) {
  if (!/^https?:\/\//i.test(url)) return url;

  const params = new URLSearchParams(window.location.search);
  const trackingKeys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'src',
    'sck',
    'fbclid',
    'gclid',
    'ttclid'
  ];

  try {
    const checkoutUrl = new URL(url);
    trackingKeys.forEach((key) => {
      const value = params.get(key);
      if (value && !checkoutUrl.searchParams.has(key)) {
        checkoutUrl.searchParams.set(key, value);
      }
    });
    return checkoutUrl.toString();
  } catch (error) {
    return url;
  }
}

function formatBrazilDate(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

function updateDates() {
  const today = formatBrazilDate(new Date());
  document.querySelectorAll('.js-today').forEach((element) => {
    element.textContent = today;
  });
}

function trackCheckoutClick(planName) {
  window.dispatchEvent(new CustomEvent('checkoutClick', {
    detail: { planName }
  }));
}

function setupCheckoutLinks() {
  document.querySelectorAll('.js-cta').forEach((link) => {
    link.setAttribute('href', PAGE_CONFIG.checkoutPrincipal);
  });

  document.querySelectorAll('.js-basic-checkout').forEach((link) => {
    link.setAttribute('href', mergeCurrentTrackingParams(PAGE_CONFIG.checkoutBasico));
    link.addEventListener('click', () => trackCheckoutClick('Plano Básico'));
  });

  document.querySelectorAll('.js-complete-checkout').forEach((link) => {
    link.setAttribute('href', mergeCurrentTrackingParams(PAGE_CONFIG.checkoutCompleto));
    link.addEventListener('click', () => trackCheckoutClick('Plano Completo'));
  });
}

function setupFaq() {
  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const currentItem = button.closest('.faq-item');

      document.querySelectorAll('.faq-item').forEach((item) => {
        if (item !== currentItem) item.classList.remove('active');
      });

      currentItem.classList.toggle('active');
    });
  });
}

function setupMissingImages() {
  document.querySelectorAll('.image-shell img').forEach((image) => {
    image.addEventListener('error', () => {
      const shell = image.closest('.image-shell');
      if (shell) shell.classList.add('is-missing');
    });

    if (image.complete && image.naturalWidth === 0) {
      const shell = image.closest('.image-shell');
      if (shell) shell.classList.add('is-missing');
    }
  });
}

function updateCountdown() {
  const now = new Date();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const diff = Math.max(0, endOfDay - now);
  const totalSeconds = Math.floor(diff / 1000);

  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  document.querySelectorAll('.js-hours').forEach((el) => el.textContent = hours);
  document.querySelectorAll('.js-minutes').forEach((el) => el.textContent = minutes);
  document.querySelectorAll('.js-seconds').forEach((el) => el.textContent = seconds);
}

updateDates();
setupCheckoutLinks();
setupFaq();
setupMissingImages();
updateCountdown();
setInterval(updateCountdown, 1000);
