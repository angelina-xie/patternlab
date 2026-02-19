
const patternImages = [
  'pattern1.jpg',
  'pattern2.jpg',
  'pattern3.jpg',
];

const track = document.getElementById('track');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let offset = 0;

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

prevBtn.addEventListener('click', () => { offset--; buildCarousel(); });
nextBtn.addEventListener('click', () => { offset++; buildCarousel(); });

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(buildCarousel, 150);
});

buildCarousel();
