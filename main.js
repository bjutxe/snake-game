const isSP = navigator.userAgent.match(/iPhone|Android.+Mobile/);

const BLOCK_SIZE = isSP ? 30 : window.screen.availHeight > 912 ? 80 : 70;
const [FIELD_X, FIELD_Y] = isSP ? [11, 20] : [20, 11];
const [START_HEAD_X, START_HEAD_Y] = isSP ? [0, 4] : [4, 10];
const MARGIN = isSP ? 3 : 10;

const SPEED = 1000 / 1.6;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = BLOCK_SIZE * FIELD_X;
canvas.height = BLOCK_SIZE * FIELD_Y;
document.body.appendChild(canvas);

const operation = [],
  nextHead = [];
var pickStar = [];
const regexWasd = /Key(W|A|S|D)/;
const regexArrow = /Arrow(Left|Right|Up|Down)/;
const regexOther = /Key(P|R)/;

var loopCounter = 0;
var isPaused = false;

const snake = {
  x: null,
  y: null,
  dx: 1,
  dy: 0,
  len: null,

  move: function () {
    this.body.push({ x: this.x, y: this.y });
    const nextQueue = nextHead.shift();
    if (typeof nextQueue != "undefined") {
      this.x = nextQueue[0];
      this.y = nextQueue[1];
    } else {
      this.x += this.dx;
      this.y += this.dy;
    }
  },
};

const star = { x: null, y: null };

const init = () => {
  snake.x = START_HEAD_X;
  snake.y = START_HEAD_Y;
  snake.len = 5;
  operation.length = 0;
  nextHead.length = 0;
  isSP ? initSP() : initPC();
  paint();
  loopCounter = 0;
};

const initPC = () => {
  snake.body = [
    { x: snake.x - 4, y: snake.y },
    { x: snake.x - 3, y: snake.y },
    { x: snake.x - 2, y: snake.y },
    { x: snake.x - 1, y: snake.y },
  ];
  snake.dx = 1;
  snake.dy = 0;
  star.x = 10;
  star.y = 5;
};

const initSP = () => {
  snake.body = [
    { x: snake.x, y: snake.y - 4 },
    { x: snake.x, y: snake.y - 3 },
    { x: snake.x, y: snake.y - 2 },
    { x: snake.x, y: snake.y - 1 },
  ];
  snake.dx = 0;
  snake.dy = 1;
  star.x = 5;
  star.y = 10;
};

const loop = () => {
  loopCounter++;
  snake.move();
  const eaten = snake.x === star.x && snake.y === star.y;
  if (eaten) snake.len++;
  if (snake.body.length >= snake.len) snake.body.shift();
  if (eaten) {
    pickStar.length = 0;
    for (let row = 0; row < FIELD_Y; row++) {
      for (let col = 0; col < FIELD_X; col++) {
        pickStar.push(row * FIELD_X + col);
      }
    }
    let address = snake.y * FIELD_X + snake.x;
    let dead = pickStar.findIndex((item) => item == address);
    pickStar.splice(dead, 1);
    snake.body.forEach((it) => {
      address = it.y * FIELD_X + it.x;
      dead = pickStar.findIndex((item) => item == address);
      pickStar.splice(dead, 1);
    });
    var nowPickStar = pickStar[Math.floor(Math.random() * pickStar.length)];
    const nextStar = nowPickStar;
    star.x = nextStar % FIELD_X;
    star.y = Math.floor(nextStar / FIELD_X);
  }
  snake.body.forEach((it) => {
    if (snake.x === it.x && snake.y === it.y) {
      console.log("head hit body!!!");
      init();
    }
    if (star.x === it.x && star.y === it.y) {
      console.log("star hit body!!!");
      init();
    }
  });
  if (snake.x < 0 || snake.y < 0 || snake.x >= FIELD_X || snake.y >= FIELD_Y) {
    console.log("hit wall!!!");
    init();
  }
  paint();
  if (pickStar.length == 1) isPaused = true;
};

const direction = () => {
  const q = operation.shift();
  if (typeof q == "undefined") return;
  const [prevdx, prevdy] = [snake.dx, snake.dy];
  if (prevdx + q[0] != 0 && prevdy + q[1] != 0) {
    snake.dx = q[0];
    snake.dy = q[1];
  }
  if (Math.abs(prevdx + q[0]) != 2 && Math.abs(prevdy + q[1]) != 2) {
    const [x, y] =
      nextHead.length == 0 ? [snake.x, snake.y] : nextHead.slice(-1)[0];
    nextHead.push([x + snake.dx, y + snake.dy]);
  }
};

const paint = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snakePaint(snake.body, snake.x, snake.y);
  starPaint(star.x, star.y);
};

const starPaint = (x, y) => {
  ctx.fillStyle = "red";
  const cubeSize = BLOCK_SIZE / 3;
  ctx.fillRect(x * BLOCK_SIZE + cubeSize, y * BLOCK_SIZE, cubeSize, cubeSize);
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE + cubeSize, cubeSize, cubeSize);
  ctx.fillRect(
    x * BLOCK_SIZE + cubeSize * 2,
    y * BLOCK_SIZE + cubeSize,
    cubeSize,
    cubeSize
  );
  ctx.fillRect(
    x * BLOCK_SIZE + cubeSize,
    y * BLOCK_SIZE + cubeSize * 2,
    cubeSize,
    cubeSize
  );
};

const snakePaint = (body, headX, headY) => {
  ctx.fillStyle = "green";
  ctx.fillRect(
    headX * BLOCK_SIZE + MARGIN,
    headY * BLOCK_SIZE + MARGIN,
    BLOCK_SIZE - MARGIN,
    BLOCK_SIZE - MARGIN
  );
  snakePaintJoint(body.slice(-1)[0], headX, headY);
  body.forEach((it, idx) => {
    ctx.fillRect(
      it.x * BLOCK_SIZE + MARGIN,
      it.y * BLOCK_SIZE + MARGIN,
      BLOCK_SIZE - MARGIN,
      BLOCK_SIZE - MARGIN
    );
    const nextIt = body[idx + 1];
    if (typeof nextIt == "undefined") return;
    snakePaintJoint(nextIt, it.x, it.y);
  });
};

const snakePaintJoint = (nextIt, itx, ity) => {
  const [diffx, diffy] = [itx - nextIt.x, ity - nextIt.y];
  if (diffx == 1) {
    ctx.fillRect(
      itx * BLOCK_SIZE,
      ity * BLOCK_SIZE + MARGIN,
      MARGIN,
      BLOCK_SIZE - MARGIN
    );
  } else if (diffx == -1) {
    ctx.fillRect(
      (itx + 1) * BLOCK_SIZE,
      ity * BLOCK_SIZE + MARGIN,
      MARGIN,
      BLOCK_SIZE - MARGIN
    );
  } else if (diffy == 1) {
    ctx.fillRect(
      itx * BLOCK_SIZE + MARGIN,
      ity * BLOCK_SIZE,
      BLOCK_SIZE - MARGIN,
      MARGIN
    );
  } else {
    ctx.fillRect(
      itx * BLOCK_SIZE + MARGIN,
      (ity + 1) * BLOCK_SIZE,
      BLOCK_SIZE - MARGIN,
      MARGIN
    );
  }
};

init();
var timerId = setInterval(function () {
  if (!isPaused) loop();
}, SPEED);

document.addEventListener("keydown", (e) => {
  const resultWasd = regexWasd.exec(e.code);
  const resultArrow = regexArrow.exec(e.key);
  const resultOther = regexOther.exec(e.code);
  if (!resultWasd && !resultArrow && !resultOther) return;
  if (resultWasd) {
    const k = e.key;
    operation.push(
      k == "a" ? [-1, 0] : k == "d" ? [1, 0] : k == "w" ? [0, -1] : [0, 1]
    );
  } else if (resultArrow) {
    const k = resultArrow[1];
    operation.push(
      k == "Left"
        ? [-1, 0]
        : k == "Right"
        ? [1, 0]
        : k == "Up"
        ? [0, -1]
        : [0, 1]
    );
  } else if (resultOther) {
    isPaused = !isPaused;
    if (e.code == "KeyR") {
      init();
    }
  }
  direction();
});

let swipeStartX, swipeStartY, swipeMoveX, swipeMoveY;
const swipeDist = 30;

document.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    swipeStartX = e.touches[0].pageX;
    swipeStartY = e.touches[0].pageY;
  },
  { passive: false }
);

document.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    swipeMoveX = e.changedTouches[0].pageX;
    swipeMoveY = e.changedTouches[0].pageY;
  },
  { passive: false }
);

document.addEventListener(
  "touchend",
  (e) => {
    e.preventDefault();
    let [opeX, opeY] = [0, 0];
    const [deltaX, deltaY] = [
      swipeMoveX - swipeStartX,
      swipeMoveY - swipeStartY,
    ];
    const [absX, absY] = [Math.abs(deltaX), Math.abs(deltaY)];
    if (absX < swipeDist && absY < swipeDist) {
      return;
    } else if (absX > swipeDist && absY < swipeDist) {
      [opeX, opeY] = deltaX > 0 ? [1, 0] : [-1, 0];
    } else if (absX < swipeDist && absY > swipeDist) {
      [opeX, opeY] = deltaY > 0 ? [0, 1] : [0, -1];
    } else {
      [opeX, opeY] =
        absX > absY && deltaX > 0
          ? [1, 0]
          : absX > absY && deltaX < 0
          ? [-1, 0]
          : absX < absY && deltaY > 0
          ? [0, 1]
          : [0, -1];
    }
    operation.push([opeX, opeY]);
    direction();
  },
  { passive: false }
);
