const patternImages = [
  'pattern1.jpg',
  'pattern2.jpg',
  'pattern3.jpg',
  
];;
    const count = Math.max(6, Math.floor(size / 12));
    for (let i = 0; i < count; i++) {
      const x = (Math.sin(i * 2.4) * 0.5 + 0.5) * size;
      const y = (Math.cos(i * 1.7) * 0.5 + 0.5) * size;
      const item = items[i % items.length];
      const s = size * 0.12;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(i * 0.9);
      ctx.fillStyle = item.color;
      if (item.type === 'leaf') {
        ctx.beginPath();
        ctx.ellipse(0, -s * 0.6, s * 0.28, s * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (item.type === 'flower') {
        for (let p = 0; p < 5; p++) {
          ctx.save();
          ctx.rotate((p * Math.PI * 2) / 5);
          ctx.beginPath();
          ctx.ellipse(0, -s * 0.45, s * 0.22, s * 0.45, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = '#f9d84a';
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.18, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  },



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
    const patternIndex = ((i + offset) % patternGenerators.length + patternGenerators.length) % patternGenerators.length;
    const px = Math.round(slot.px);

    const card = document.createElement('div');
    card.className = `pattern-card ${slot.cls}`;

    const canvas = document.createElement('canvas');
    canvas.width = px * 2;   
    canvas.height = px * 2;
    canvas.style.width = px + 'px';
    canvas.style.height = px + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    patternGenerators[patternIndex](ctx, px);

    card.appendChild(canvas);
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
