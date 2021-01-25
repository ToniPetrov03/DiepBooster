let tanksInfo;

let mouseX = 0;
let mouseY = 0;
let interval = 0;
let isFire = false;

const initKeyEvent = (keyCode, ...events) => {
  const eventInitDict = {
    which: keyCode,
    keyCode: keyCode,
    key: String.fromCharCode(keyCode),
  };

  return () => events.forEach((event) => window.dispatchEvent(new KeyboardEvent(event, eventInitDict)));
};

const canvas = document.getElementById('canvas');

const target = document.getElementById('a');
const config = { attributes: true, attributeFilter: ['style'] };

const pressE = initKeyEvent(69, 'keydown', 'keyup');
const spaceDown = initKeyEvent(32, 'keydown');
const spaceUp = initKeyEvent(32, 'keyup');

const sin45 = Math.sin(Math.PI / 4);

// TODO Predator reload

const predatorStacking = () => {
  const fire = (t, w) => {
    setTimeout(spaceDown, t * 1000);
    setTimeout(spaceUp, t * 1000 + w);
  };

  fire(0, 100);
  fire(0.75, 200);
  fire(1.5, 750);

  setTimeout(pressE, 2000);
};

const octoTankStacking = () => {
  isFire = !isFire;

  pressE();

  const artificialMouseMove = () => {
    interval = setInterval(() => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const diffX = mouseX - centerX;
      const diffY = mouseY - centerY;

      const clientX = sin45 * (diffX - diffY) + centerX;
      const clientY = sin45 * (diffX + diffY) + centerY;

      canvas.dispatchEvent(new MouseEvent('mousemove', { clientX, clientY }));
    }, 300 - 20 * tanksInfo.octoTank.bulletReload);
  };

  isFire ? artificialMouseMove() : clearInterval(interval);
};

const onMouseMove = (e) => {
  //TODO Fix Bug

  mouseX = e.clientX;
  mouseY = e.clientY;
};

const onKeyUp = ({ code }) => {
  switch (code) {
    case tanksInfo.predator.keyCode: predatorStacking(); break;
    case tanksInfo.octoTank.keyCode: octoTankStacking(); break;
  }
};

const initListeners = () => {
  canvas.addEventListener('mousemove', onMouseMove);
  document.addEventListener('keyup', onKeyUp);
};

const removeListeners = () => {
  canvas.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('keyup', onKeyUp);
};

new MutationObserver(() => {
  clearInterval(interval);
  isFire = false;

  switch (target.style.display) {
    case 'none': initListeners(); break;
    case 'block': removeListeners(); break;
  }
}).observe(target, config);
