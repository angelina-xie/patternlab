
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, canvas.width, canvas.height);


const specCanvas = document.getElementById('spectrumBar');
const specCtx = specCanvas.getContext('2d');

(function drawSpectrum() {
  const g = specCtx.createLinearGradient(0, 0, specCanvas.width, 0);
  g.addColorStop(0,    '#0000ff');
  g.addColorStop(0.17, '#00ffff');
  g.addColorStop(0.33, '#00ff00');
  g.addColorStop(0.50, '#ffff00');
  g.addColorStop(0.67, '#ff8800');
  g.addColorStop(0.83, '#ff0000');
  g.addColorStop(1,    '#ff0000');
  specCtx.fillStyle = g;
  specCtx.fillRect(0, 0, specCanvas.width, specCanvas.height);
})();


let tool      = 'brush';
let color     = '#000000';
let brushSize = 3;
let drawing   = false;
let lastX     = 0;
let lastY     = 0;
let history   = [];

saveHistory();


specCanvas.addEventListener('click', e => {
  const rect = specCanvas.getBoundingClientRect();
  const x = Math.round((e.clientX - rect.left) * (specCanvas.width / rect.width));
  const px = specCtx.getImageData(Math.min(x, specCanvas.width - 1), 11, 1, 1).data;
  color = rgbToHex(px[0], px[1], px[2]);

  const cursor = document.getElementById('spectrumCursor');
  cursor.style.display = 'block';
  cursor.style.left = (e.clientX - rect.left) + 'px';

  if (tool === 'eraser') tool = 'brush';
});


function setTool(t) {
  tool = t;
  document.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('active'));
  canvas.style.cursor = t === 'fill' ? 'cell' : 'crosshair';
  if (t === 'fill')   document.getElementById('fillBtn').classList.add('active');
  if (t === 'eraser') document.getElementById('eraserBtn').classList.add('active');
}

document.getElementById('fillBtn').addEventListener('click', () => setTool('fill'));
document.getElementById('eraserBtn').addEventListener('click', () => setTool('eraser'));
document.getElementById('undoBtn').addEventListener('click', undo);

document.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    brushSize = +btn.dataset.size;
    if (tool === 'eraser') tool = 'brush';
  });
});

window.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') undo();
});

// ── Drawing ───────────────────────────────────────────────
function getPos(e) {
  const r = canvas.getBoundingClientRect();
  const src = e.touches ? e.touches[0] : e;
  return [
    (src.clientX - r.left) * (canvas.width  / r.width),
    (src.clientY - r.top)  * (canvas.height / r.height)
  ];
}

canvas.addEventListener('mousedown', e => {
  const [x, y] = getPos(e);

  if (tool === 'fill') {
    saveHistory();
    floodFill(Math.round(x), Math.round(y), color);
    return;
  }

  drawing = true;
  [lastX, lastY] = [x, y];
  saveHistory();

  ctx.beginPath();
  ctx.arc(x, y, effectiveSize() / 2, 0, Math.PI * 2);
  ctx.fillStyle = effectiveColor();
  ctx.fill();
});

canvas.addEventListener('mousemove', e => {
  if (!drawing) return;
  const [x, y] = getPos(e);

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.strokeStyle = effectiveColor();
  ctx.lineWidth   = effectiveSize();
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.stroke();

  [lastX, lastY] = [x, y];
});

window.addEventListener('mouseup', () => { drawing = false; });

canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  canvas.dispatchEvent(new MouseEvent('mousedown', {
    clientX: e.touches[0].clientX,
    clientY: e.touches[0].clientY
  }));
}, { passive: false });

canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  canvas.dispatchEvent(new MouseEvent('mousemove', {
    clientX: e.touches[0].clientX,
    clientY: e.touches[0].clientY
  }));
}, { passive: false });

canvas.addEventListener('touchend', () => {
  canvas.dispatchEvent(new MouseEvent('mouseup'));
});

function effectiveColor() { return tool === 'eraser' ? '#ffffff' : color; }
function effectiveSize()  { return tool === 'eraser' ? brushSize * 3 : brushSize; }

function saveHistory() {
  history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  if (history.length > 40) history.shift();
}

function undo() {
  if (history.length > 1) {
    history.pop();
    ctx.putImageData(history[history.length - 1], 0, 0);
  }
}


function floodFill(sx, sy, fillColor) {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data    = imgData.data;
  const w       = canvas.width;
  const h       = canvas.height;
  const base    = (sy * w + sx) * 4;
  const tr = data[base], tg = data[base + 1], tb = data[base + 2];
  const [fr, fg, fb] = hexToRgbArr(fillColor);

  if (tr === fr && tg === fg && tb === fb) return;

  const stack   = [sx + sy * w];
  const visited = new Uint8Array(w * h);

  while (stack.length) {
    const pos = stack.pop();
    if (visited[pos]) continue;
    visited[pos] = 1;

    const i = pos * 4;
    const x = pos % w;
    const y = Math.floor(pos / w);

    if (x < 0 || x >= w || y < 0 || y >= h) continue;
    if (data[i] !== tr || data[i + 1] !== tg || data[i + 2] !== tb) continue;

    data[i]     = fr;
    data[i + 1] = fg;
    data[i + 2] = fb;
    data[i + 3] = 255;

    if (x + 1 < w)  stack.push(pos + 1);
    if (x - 1 >= 0) stack.push(pos - 1);
    if (y + 1 < h)  stack.push(pos + w);
    if (y - 1 >= 0) stack.push(pos - w);
  }

  ctx.putImageData(imgData, 0, 0);
}


function hexToRgbArr(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r
    ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)]
    : [0, 0, 0];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}
