const patternImages = [
  'pattern1.jpg',
  'pattern2.jpg',
  'pattern3.jpg',
];

const track = document.getElementById('track');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let offset = 0;
let isAnimating = false;

function getSlots() {
  const vw = window.innerWidth;
  const BASE = vw < 480 ? 80 : vw < 700 ? 100 : 130;
  if (vw < 480) {
    return [
      { cls: 'size-md', px: BASE * 0.65 },
      { cls: 'size-lg', px: BASE },
      { cls: 'size-lg', px: BASE },
      { cls: 'size-md', px: BASE * 0.65 },
    ];
  }
  if (vw < 700) {
    return [
      { cls: 'size-sm', px: BASE * 0.5 },
      { cls: 'size-md', px: BASE * 0.75 },
      { cls: 'size-lg', px: BASE },
      { cls: 'size-lg', px: BASE },
      { cls: 'size-md', px: BASE * 0.75 },
      { cls: 'size-sm', px: BASE * 0.5 },
    ];
  }
  return [
    { cls: 'size-sm', px: BASE * 0.45 },
    { cls: 'size-sm', px: BASE * 0.65 },
    { cls: 'size-md', px: BASE * 0.8 },
    { cls: 'size-lg', px: BASE },
    { cls: 'size-lg', px: BASE },
    { cls: 'size-lg', px: BASE },
    { cls: 'size-md', px: BASE * 0.8 },
    { cls: 'size-sm', px: BASE * 0.65 },
    { cls: 'size-sm', px: BASE * 0.45 },
  ];
}

function buildCarousel() {
  track.innerHTML = '';
  const slots = getSlots();
  slots.forEach((slot, i) => {
    const imageIndex = ((i + offset) % patternImages.length + patternImages.length) % patternImages.length;
    const px = Math.round(slot.px);

    const card = document.createElement('div');
    card.className = `pattern-card ${slot.cls}`;
    card.style.width = px + 'px';
    card.style.height = px + 'px';

    const img = document.createElement('img');
    img.src = patternImages[imageIndex];
    img.alt = 'Pattern ' + (imageIndex + 1);
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.display = 'block';

    card.appendChild(img);
    track.appendChild(card);
  });
}

function transitionCarousel(direction) {
  if (isAnimating) return;
  isAnimating = true;

  const oldCards = Array.from(track.children);
  const slideOut = direction * -100;

  oldCards.forEach(card => {
    card.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease';
    card.style.transform = `translateX(${slideOut}%)`;
    card.style.opacity = '0';
  });

  setTimeout(() => {
    buildCarousel();
    const newCards = Array.from(track.children);
    const slideFrom = direction * 100;

    newCards.forEach(card => {
      card.style.transition = 'none';
      card.style.transform = `translateX(${slideFrom}%)`;
      card.style.opacity = '0';
    });

    track.offsetHeight;

    newCards.forEach((card, i) => {
      card.style.transition = `transform 0.35s cubic-bezier(0.4, 0, 0.2, 1) ${i * 18}ms, opacity 0.35s ease ${i * 18}ms`;
      card.style.transform = 'translateX(0)';
      card.style.opacity = card.classList.contains('size-sm') ? '0.45' :
                           card.classList.contains('size-md') ? '0.7' : '1';
    });

    setTimeout(() => { isAnimating = false; }, 350 + newCards.length * 18);
  }, 350);
}

prevBtn.addEventListener('click', () => { offset--; transitionCarousel(-1); });
nextBtn.addEventListener('click', () => { offset++; transitionCarousel(1); });

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(buildCarousel, 150);
});

buildCarousel();
