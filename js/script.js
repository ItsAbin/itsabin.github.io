const msPerChar = 30;
const linePause = 120;

const lines = document.querySelectorAll('.terminal-line');

let cursor = 0;

lines.forEach((line) => {

  const chars = line.dataset.text.length;
  const duration = (chars * msPerChar) / 1000;

  line.style.setProperty('--delay', (cursor / 1000) + 's');
  line.style.setProperty('--duration', duration + 's');
  line.style.setProperty('--chars', chars);

  setTimeout(() => {
    line.classList.add('typed');
  }, cursor);

  cursor += chars * msPerChar + linePause;
});

const msgEl = document.getElementById('message');
const typedSpan = document.getElementById('typed-msg');
const blinkCur = document.getElementById('blink-cursor');

const segments = [
  {
    text: 'Will Return ',
    open: '<span class="highlight">',
    close: '</span>'
  },
  {
    text: 'in ',
    open: '',
    close: ''
  },
  {
    text: 'Avengers Doomsday :)',
    open: '<span class="highlight">',
    close: '</span>'
  }
];

const fullText = segments.map(s => s.text).join('');

function startMsgType() {

  msgEl.style.visibility = 'visible';
  msgEl.style.opacity = '1';

  blinkCur.style.display = 'inline';

  let charIndex = 0;

  const iv = setInterval(() => {

    charIndex++;

    let built = '';
    let counted = 0;

    for (const seg of segments) {

      if (counted >= charIndex) break;

      const take = Math.min(seg.text.length, charIndex - counted);

      built += take === seg.text.length
        ? seg.open + seg.text + seg.close
        : seg.text.slice(0, take);

      counted += seg.text.length;
    }

    typedSpan.innerHTML = built;

    if (charIndex >= fullText.length) {
      clearInterval(iv);
      startCountdown();
    }

  }, msPerChar);
}

const targetTime = new Date('2026-12-18T00:00:00Z').getTime();

const textEl = document.getElementById('progress-text');
const wrap = document.getElementById('countdown-wrap');

function updateCountdown() {

  const now = Date.now();
  const remaining = targetTime - now;

  if (remaining <= 0) {
    textEl.textContent = 'DOOMSDAY HAS ARRIVED';
    return;
  }

  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining / 3600000) % 24);
  const minutes = Math.floor((remaining / 60000) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  textEl.textContent =
    `${days}D ${String(hours).padStart(2,'0')}H ` +
    `${String(minutes).padStart(2,'0')}M ` +
    `${String(seconds).padStart(2,'0')}S LEFT`;
}

function startCountdown() {

  wrap.classList.add('visible');

  updateCountdown();

  if (!window.countdownStarted) {

    window.countdownStarted = true;

    setInterval(updateCountdown, 1000);
  }
}

let activated = false;

function playLion() {

  if (activated) return;

  activated = true;

  const audio = document.getElementById("lion-audio");

  audio.currentTime = 0;
  audio.play();

  startMsgType();
}