const screen = document.querySelector('#screen');
const pages = [
  {id:'about', label:'About me'},
  {id:'work', label:'Selected work'},
  {id:'notes', label:'My notes'},
  {id:'contact', label:'Say hello'}
];
let selected = 0;
let current = 'home';
let soundEnabled = true;
let audioContext;

function playTone(kind = 'move') {
  if (!soundEnabled) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  audioContext ||= new AudioCtx();
  if (audioContext.state === 'suspended') audioContext.resume();
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const sounds = {move:[180,145,.045],select:[260,390,.085],back:[210,120,.075],start:[130,520,.14]};
  const [from, to, duration] = sounds[kind] || sounds.move;
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(from, now);
  oscillator.frequency.exponentialRampToValueAtTime(to, now + duration);
  gain.gain.setValueAtTime(.055, now);
  gain.gain.exponentialRampToValueAtTime(.001, now + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + duration);
}

function boot(){
  screen.innerHTML = `<div class="boot"><div><h2>pocket</h2><p>PORTFOLIO SYSTEM · 01</p><div class="load"><i></i></div></div></div>`;
  setTimeout(renderHome, 1150);
}
function renderHome(){
  current='home';
  screen.innerHTML=`<div class="game"><div class="status"><span>PLAYER 01</span><span>● ● ◌</span></div><div class="profile"><div class="avatar"></div><div><h2>HELLO.<br>MILO BENNETT.</h2><p>DESIGNER + DEVELOPER<br>BRISTOL, UK</p></div></div><div class="menu">${pages.map((p,i)=>`<button class="${i===selected?'active':''}" data-page="${p.id}"><span>${String(i+1).padStart(2,'0')} ${p.label}</span><span>${i===selected?'▶':'·'}</span></button>`).join('')}</div><div class="footer-screen"><span>↑↓ MOVE</span><span>A SELECT</span></div></div>`;
  screen.querySelectorAll('[data-page]').forEach((el,i)=>el.onclick=()=>{selected=i;playTone('select');openSelected()});
}
function move(delta){ playTone('move'); if(current!=='home'){renderHome();return} selected=(selected+delta+pages.length)%pages.length;renderHome() }
function openSelected(){
  const id=pages[selected].id; current=id;
  const content={
    about:`<h3>HI, I'M MILO.</h3><p>I turn fuzzy ideas into useful, characterful digital things. I care about the tiny details—the ones that make an interface feel obvious, warm and alive.</p><span class="tag">EST. 1996 · BRISTOL</span>`,
    work:`<span class="tag">SELECTED WORK 2024—26</span><h3 class="big">TINY OBJECTS,<br>BIG STORIES.</h3><p>01 — FIELD NOTES / PRODUCT<br>02 — COMMON GROUND / IDENTITY<br>03 — NIGHT BUS / DIGITAL</p>`,
    notes:`<span class="tag">RECENT NOTE · 004</span><h3>DESIGNING FOR DELIGHT</h3><p>The best interfaces leave just enough room for curiosity. Clarity gets you through the door; character makes you want to stay.</p><p class="blink">_</p>`,
    contact:`<h3>LET'S MAKE<br>SOMETHING GOOD.</h3><p>Have a small idea with big potential?</p><button id="email">▶ SEND MESSAGE</button>`
  }[id];
  screen.innerHTML=`<div class="detail ${id==='contact'?'contact':''}"><div class="status"><span>${pages[selected].label.toUpperCase()}</span><span>0${selected+1}/04</span></div>${content}<div class="footer-screen"><span>B BACK</span><span>POCKETFOLIO</span></div></div>`;
  screen.querySelector('#email')?.addEventListener('click',()=>location.href='mailto:hello@pocketfolio.dev');
}
document.querySelectorAll('[data-nav="up"],[data-nav="left"]').forEach(b=>b.onclick=()=>move(-1));
document.querySelectorAll('[data-nav="down"],[data-nav="right"]').forEach(b=>b.onclick=()=>move(1));
document.querySelector('[data-action="a"]').onclick=()=>{playTone('select');openSelected()};
document.querySelector('[data-action="b"]').onclick=()=>{playTone('back');renderHome()};
document.querySelector('[data-action="start"]').onclick=()=>{playTone('start');boot()};
document.querySelector('[data-action="select"]').onclick=()=>{playTone('move');selected=(selected+1)%pages.length;renderHome()};
document.querySelector('#soundToggle').onclick=e=>{soundEnabled=!soundEnabled;e.currentTarget.textContent=`SOUND  ${soundEnabled?'ON':'OFF'}`;e.currentTarget.setAttribute('aria-pressed',String(!soundEnabled));if(soundEnabled)playTone('select')};
addEventListener('keydown',e=>{if(['ArrowUp','ArrowLeft'].includes(e.key))move(-1);if(['ArrowDown','ArrowRight'].includes(e.key))move(1);if(['Enter','a','A'].includes(e.key)){playTone('select');openSelected()}if(['Escape','b','B'].includes(e.key)){playTone('back');renderHome()}});
boot();
