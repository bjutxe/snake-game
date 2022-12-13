const BLOCK_SIZE = 80, SPEED = 1000 / 2.483;
const FIELD_X = 20, FIELD_Y = 11;
const START_HEAD_X = 4, START_HEAD_Y = 10;

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = BLOCK_SIZE * FIELD_X;
canvas.height = BLOCK_SIZE * FIELD_Y;
document.body.appendChild(canvas);

const operation = [], nextHead = [], pickStar = [];
const regexKeytype = /Arrow(Left|Right|Up|Down)/

const snake = {
  x: null, y: null, dx: 1, dy: 0, len: null,

  move: function() {
    this.body.push({x: this.x, y: this.y});
    const nextQueue = nextHead.shift();
    if (typeof nextQueue != "undefined") {
      this.x = nextQueue[0]; this.y = nextQueue[1];
    } else {
      this.x += this.dx; this.y += this.dy;
    }
    this.body.forEach(it => {
      if (this.x === it.x && this.y === it.y) init();
    })
    if (this.x < 0 || this.y < 0 || this.x >= FIELD_X || this.y >= FIELD_Y) init();
    const address = this.y * FIELD_X + this.x;
    const dead = pickStar.findIndex(item => item == address);
    pickStar.splice(dead, 1);
  },
}

const star = {x: null, y: null}

const init = () => {
  snake.x = START_HEAD_X; snake.y = START_HEAD_Y; snake.len = 5;
  snake.body = [
    {x: snake.x - 4, y: snake.y}, {x: snake.x - 3, y: snake.y},
    {x: snake.x - 2, y: snake.y}, {x: snake.x - 1, y: snake.y},
  ];
  snake.dx = 1; snake.dy = 0;
  star.x = 10; star.y = 5;
  operation.length = 0; nextHead.length = 0;
  pickStar.length = 0;
  for (let row = 0; row < FIELD_Y; row++) {
    for (let col = 0; col < FIELD_X; col++) {
      pickStar.push(row * FIELD_X + col);
    }
  }
  pickStar.splice(snake.body[0].y * FIELD_X + snake.body[0].x, 5);
  paint();
}

const loop = () => {
  snake.move();
  const eaten = snake.x === star.x && snake.y === star.y;
  if (eaten) snake.len++;
  if (snake.body.length >= snake.len) {
    const useful = snake.body.shift();
    pickStar.push(useful.y * FIELD_X + useful.x);
  }
  if (eaten) {
    const nextStar = pickStar[Math.floor(Math.random() * pickStar.length)];
    star.x = nextStar % FIELD_X;
    star.y = Math.floor(nextStar / FIELD_X);
  }
  paint();
  if (pickStar.length == 1) clearInterval(timerId);
}

const direction = () => {
  const q = operation.shift();
  if (typeof q == "undefined") return;
  const [prevdx, prevdy] = [snake.dx, snake.dy];
  if (prevdx + q[0] != 0 && prevdy + q[1] != 0) {
    snake.dx = q[0]; snake.dy = q[1];
  }
  if (Math.abs(prevdx + q[0]) != 2 && Math.abs(prevdy + q[1]) != 2) {
    const [x, y] = nextHead.length == 0 ? [snake.x, snake.y] : nextHead.slice(-1)[0];
    nextHead.push([x + snake.dx, y + snake.dy]);
  }
}

const paint = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snakePaint(snake.body, snake.x, snake.y);
  starPaint(star.x, star.y);
}

const starPaint = (x, y) => {
  ctx.fillStyle = 'red';
  const cubeSize = BLOCK_SIZE / 3;
  ctx.fillRect(x * BLOCK_SIZE + cubeSize, y * BLOCK_SIZE, cubeSize, cubeSize);
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE + cubeSize, cubeSize, cubeSize);
  ctx.fillRect(x * BLOCK_SIZE + cubeSize * 2, y * BLOCK_SIZE + cubeSize, cubeSize, cubeSize);
  ctx.fillRect(x * BLOCK_SIZE + cubeSize, y * BLOCK_SIZE + cubeSize * 2, cubeSize, cubeSize);
}

const snakePaint = (body, headX, headY) => {
  ctx.fillStyle = 'green';
  ctx.fillRect(headX * BLOCK_SIZE + 10, headY * BLOCK_SIZE + 10, BLOCK_SIZE - 10, BLOCK_SIZE - 10);
  snakePaintJoint(body.slice(-1)[0], headX, headY);
  body.forEach((it, idx) => {
    ctx.fillRect(it.x * BLOCK_SIZE + 10, it.y * BLOCK_SIZE + 10, BLOCK_SIZE - 10, BLOCK_SIZE - 10);
    const nextIt = body[idx + 1];
    if (typeof nextIt == "undefined") return;
    snakePaintJoint(nextIt, it.x, it.y);
  })
}

const snakePaintJoint = (nextIt, itx, ity) => {
  const [diffx, diffy] = [itx - nextIt.x, ity - nextIt.y];
  if (diffx == 1) {
    ctx.fillRect(itx * BLOCK_SIZE, ity * BLOCK_SIZE + 10, 10, BLOCK_SIZE - 10);
  } else if (diffx == -1) {
    ctx.fillRect((itx + 1) * BLOCK_SIZE, ity * BLOCK_SIZE + 10, 10, BLOCK_SIZE - 10);
  } else if (diffy == 1) {
    ctx.fillRect(itx * BLOCK_SIZE + 10, ity * BLOCK_SIZE, BLOCK_SIZE - 10, 10);
  } else {
    ctx.fillRect(itx * BLOCK_SIZE + 10, (ity + 1) * BLOCK_SIZE, BLOCK_SIZE - 10, 10);
  }
}

init();
const timerId = setInterval(loop, SPEED);

document.addEventListener('keydown', e => {
  const regexResult = regexKeytype.exec(e.key);
  if (!regexResult) return;
  const k = regexResult[1];
  operation.push(k == 'Left' ? [-1, 0] : k == 'Right' ? [1, 0] : k == 'Up' ? [0, -1] : [0, 1]);
  direction();
});
