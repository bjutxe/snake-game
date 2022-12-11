const BLOCK_SIZE = 80;
const FIELD_X = 20;
const FIELD_Y = 11;
const SPEED = 1000 / 2.483;

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = BLOCK_SIZE * FIELD_X;
canvas.height = BLOCK_SIZE * FIELD_Y;
document.body.appendChild(canvas);

const operation = [];
const nextHead = [];

const regexKeytype = /Arrow(Left|Right|Up|Down)/

const snake = {
  x: null, y: null, dx: 1, dy: 0, tail: null,

  update: function() {
    this.body.push({x: this.x, y: this.y});
    const nextQueue = nextHead.shift();
    if (typeof nextQueue != "undefined") {
      this.x = nextQueue[0]; this.y = nextQueue[1];
    } else {
      this.x += this.dx; this.y += this.dy;
    }

    snakePaint(this.body, this.tail);
    this.body.forEach(it => {
      if (this.x === it.x && this.y === it.y) init();
    })
    if (this.body.length > this.tail) this.body.shift();
    if (this.x < 0 || this.y < 0 || this.x >= FIELD_X || this.y >= FIELD_Y) init();
  },
}

const star = {
  x: null, y: null,
  update() {starPaint(this.x, this.y)},
}

const init = () => {
  snake.x = 4; snake.y = FIELD_Y - 1; snake.tail = 4;
  snake.body = [
    {x: snake.x - 4, y: snake.y},
    {x: snake.x - 3, y: snake.y},
    {x: snake.x - 2, y: snake.y},
    {x: snake.x - 1, y: snake.y},
  ];
  snake.dx = 1; snake.dy = 0;
  star.x = 10; star.y = 5;
  operation.length = 0; nextHead.length = 0;
}

const loop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.update(); star.update();
  
  if (snake.x === star.x && snake.y === star.y) {
    snake.tail++;
    star.x = Math.floor(Math.random() * FIELD_X);
    star.y = Math.floor(Math.random() * FIELD_Y);
    star.update();
  }
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

const snakePaint = (body, tail) => {
  ctx.fillStyle = 'green';
  body.forEach((it, idx) => {
    ctx.fillRect(it.x * BLOCK_SIZE + 10, it.y * BLOCK_SIZE + 10, BLOCK_SIZE - 10, BLOCK_SIZE - 10);
    if (idx != tail) {
      const [diffx, diffy] = [it.x - body[idx + 1].x, it.y - body[idx + 1].y];
      if (diffx == 1) {
        ctx.fillRect(it.x * BLOCK_SIZE, it.y * BLOCK_SIZE + 10, 10, BLOCK_SIZE - 10);
      } else if (diffx == -1) {
        ctx.fillRect((it.x + 1) * BLOCK_SIZE, it.y * BLOCK_SIZE + 10, 10, BLOCK_SIZE - 10);
      } else if (diffy == 1) {
        ctx.fillRect(it.x * BLOCK_SIZE + 10, it.y * BLOCK_SIZE, BLOCK_SIZE - 10, 10);
      } else {
        ctx.fillRect(it.x * BLOCK_SIZE + 10, (it.y + 1) * BLOCK_SIZE, BLOCK_SIZE - 10, 10);
      }
    }
  })
}

init();
setInterval(loop, SPEED);
setInterval(direction, 1000 / 240);

document.addEventListener('keydown', e => {
  const regexResult = regexKeytype.exec(e.key);
  if (!regexResult) return;
  const k = regexResult[1];
  operation.push(k == 'Left' ? [-1, 0] : k == 'Right' ? [1, 0] : k == 'Up' ? [0, -1] : [0, 1]);
});
