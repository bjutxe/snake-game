const BLOCK_SIZE = 80;
const FIELD_X = 20;
const FIELD_Y = 11;
const SPEED = 1000 / 2.483; // 0.300 : 2.483
const START_HEAD_X = 4;     // 8     : 4
const START_HEAD_Y = 10;    // 5     : 10

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = BLOCK_SIZE * FIELD_X;
canvas.height = BLOCK_SIZE * FIELD_Y;
document.body.appendChild(canvas);

const operation = [];
const nextHead = [];

const regexKeytype = /Arrow(Left|Right|Up|Down)/

const snake = {
  x: null, y: null, dx: 1, dy: 0, len: null,

  update: function() {
    this.body.push({x: this.x, y: this.y});
    const nextQueue = nextHead.shift();
    if (typeof nextQueue != "undefined") {
      this.x = nextQueue[0]; this.y = nextQueue[1];
    } else {
      this.x += this.dx; this.y += this.dy;
    }

    if (this.body.length >= this.len) this.body.shift();
    snakePaint(this.body, this.x, this.y);
    this.body.forEach(it => {
      if (this.x === it.x && this.y === it.y) init();
    })
    if (this.x < 0 || this.y < 0 || this.x >= FIELD_X || this.y >= FIELD_Y) init();
  },
}

const star = {
  x: null, y: null,
  update() {starPaint(this.x, this.y)},
}

const init = () => {
  snake.x = START_HEAD_X; snake.y = START_HEAD_Y; snake.len = 5;
  snake.body = [
    {x: snake.x - 4, y: snake.y},
    {x: snake.x - 3, y: snake.y},
    {x: snake.x - 2, y: snake.y},
    {x: snake.x - 1, y: snake.y},
  ];
  snake.dx = 1; snake.dy = 0;
  star.x = 10; star.y = 5;
  operation.length = 0; nextHead.length = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  starPaint(star.x, star.y);
  snakePaint(snake.body, snake.x, snake.y);
}

const loop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (snake.x === star.x && snake.y === star.y) {
    snake.len++;
    star.x = Math.floor(Math.random() * FIELD_X);
    star.y = Math.floor(Math.random() * FIELD_Y);
  }
  snake.update(); star.update();
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
    ctx.fillStyle = 'green';
    ctx.fillRect(it.x * BLOCK_SIZE + 10, it.y * BLOCK_SIZE + 10, BLOCK_SIZE - 10, BLOCK_SIZE - 10);
    const nextIt = body[idx + 1];
    if (typeof nextIt == "undefined") return;
    snakePaintJoint(nextIt, it.x, it.y);
  })
}

const snakePaintJoint = (nextIt, itx, ity) => {
  ctx.fillStyle = 'black';
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
setInterval(loop, SPEED);

document.addEventListener('keydown', e => {
  const regexResult = regexKeytype.exec(e.key);
  if (!regexResult) return;
  const k = regexResult[1];
  operation.push(k == 'Left' ? [-1, 0] : k == 'Right' ? [1, 0] : k == 'Up' ? [0, -1] : [0, 1]);
  direction();
});
