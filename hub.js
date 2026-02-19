const patternImages = [
  'pattern1.jpg',
  'pattern2.jpg',
  'pattern3.jpg',
];

const track = document.getElementById('track');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const total = patternImages.length;
let current = 1;
let isAnimating = false;

function buildSlide(src, index) {
  const slide = document.createElement('div');
  slide.style.flexShrink = '0';
  slide.style.width = '100%';
  slide.style.display = 'flex';
  slide.style.alignItems = 'center';
  slide.style.justifyContent = 'center';

  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Pattern ' + (index + 1);
  img.style.width = '130px';
  img.style.height = '130px';
  img.style.objectFit = 'cover';
  img.style.borderRadius = '8px';
  img.style.display = 'block';

  slide.appendChild(img);
  return slide;
}

function buildCarousel() {
  track.innerHTML = '';

  const wrapper = track.parentElement;
  wrapper.style.overflow = 'hidden';

  track.style.display = 'flex';
  track.style.width = ((total + 2) * 100) + '%';
  track.style.transition = 'none';

  // Clone of last slide at the front
  track.appendChild(buildSlide(patternImages[total - 1], total - 1));

  // All real slides
  patternImages.forEach((src, i) => {
    track.appendChild(buildSlide(src, i));
  });

  // Clone of first slide at the end
  track.appendChild(buildSlide(patternImages[0], 0));

  goTo(current, false);
}

function goTo(index, animate) {
  current = index;
  const offset = -(current * (100 / (total + 2)));

  track.style.transition = animate
    ? 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    : 'none';

  track.style.transform = `translateX(${offset}%)`;
}

function next() {
  if (isAnimating) return;
  isAnimating = true;
  goTo(current + 1, true);

  setTimeout(() => {
    if (current === total + 1) goTo(1, false);
    isAnimating = false;
  }, 400);
}

function prev() {
  if (isAnimating) return;
  isAnimating = true;
  goTo(current - 1, true);

  setTimeout(() => {
    if (current === 0) goTo(total, false);
    isAnimating = false;
  }, 400);
}

nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(buildCarousel, 150);
});

buildCarousel();
