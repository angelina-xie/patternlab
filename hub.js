// Minimal pattern generator functions
const patternGenerators = [
  function(ctx, size) {
    // Simple circle pattern
    ctx.fillStyle = '#f9d84a';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 4, 0, Math.PI * 2);
    ctx.fill();
  },
  function(ctx, size) {
    // Simple leaf-like pattern
    ctx.fillStyle = '#4caf50';
    ctx.beginPath();
    ctx.ellipse(size / 2, size / 2, size / 4, size / 6, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
  },
  function(ctx, size) {
    // Simple flower-like pattern
    ctx.fillStyle = '#e91e63';
    for (let i = 0; i < 5; i++) {
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate((i * 2 * Math.PI) / 5);
      ctx.beginPath();
      ctx.ellipse(0, -size / 6, size / 12, size / 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
];

// Carousel elements
const track = document.getElementById('track');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let offset = 0;

// Determine pattern card sizes based on screen width
function getSlots() {
  const vw = window.innerWidth;
  const BASE = vw < 480 ? 80 : vw < 700 ? 100 : 130;

  if (vw < 480) {
    return [
      { cls: 'size-md', px: BASE * 0.65 },
      { cls: 'size-lg', px: BASE },
      { cls: 'size-lg', px: BASE },
      { cls: 'size-md', px: BASE * 0.65 }
    ];
  }

  if (vw < 700) {
    return [
      { cls: 'size-sm', px: BASE * 0.5 },
      { cls: 'size-md', px: BASE * 0.75 },
      { cls: 'size-lg', px: BASE },
      { cls: 'size-lg', px: BASE },
      { cls: 'size-md', px: BASE * 0.75 },
      { cls: 'size-sm', px: BASE * 0.5 }
    ];
  }

  return [
    { cls: 'size-sm', px: BASE * 0.45 },
    { cls: 'size-md', px: BASE * 0.8 },
    { cls: 'size-lg', px: BASE },
    { cls: 'size-lg', px: BASE },
    { cls: 'size-md', px: BASE * 0.8 },
    { cls: 'size-sm', px: BASE * 0.45 }
  ];
}

// Build the carousel
function buildCarousel() {
  track.innerHTML = '';
  const slots = getSlots();

  slots.forEach((slot, i) => {
    const patternIndex = (i + offset) % patternGenerators.length;
    const px = Math.round(slot.px);

    const card = document.createElement('div');
    card.className = `pattern-card ${slot.cls}`;

    const canvas = document.createElement('canvas');
    canvas.width = px * 2;   // HiDPI support
    canvas.height = px * 2;
    canvas.style.width = px + 'px';
    canvas.style.height = px + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);

    // Draw pattern
    patternGenerators[patternIndex](ctx, px);

    card.appendChild(canvas);
    track.appendChild(card);
  });
}

// Carousel navigation
prevBtn.addEventListener('click', () => {
  offset--;
  buildCarousel();
});

nextBtn.addEventListener('click', () => {
  offset++;
  buildCarousel();
});

// Rebuild on resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(buildCarousel, 150);
});

// Initial build
buildCarousel();
