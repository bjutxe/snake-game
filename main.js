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

    ctx.fillStyle = 'green';
    this.body.forEach(obj => {
      ctx.fillRect(obj.x * BLOCK_SIZE + 1, obj.y * BLOCK_SIZE + 1, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
      const flg1 = this.x === obj.x && this.y === obj.y;
      const flg2 = this.x < 0 || this.y < 0 || this.x >= FIELD_X || this.y >= FIELD_Y;
      if (flg1 || flg2) init();
    })
    if (this.body.length > this.tail) this.body.shift();
  },
}

const star = {
  x: null, y: null,

  update: function() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x * BLOCK_SIZE + 1, this.y * BLOCK_SIZE + 1, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
  },
}

const init = () => {
  snake.x = 0; snake.y = FIELD_Y - 1;
  snake.tail = 4; snake.body = [];
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
  }
}

const direction = () => {
  const q = operation.shift();
  const flg1 = typeof q != "undefined";

  const [prevdx, prevdy] = [snake.dx, snake.dy];

  const flg2 = prevdx + q[0] != 0 && prevdy + q[1] != 0;
  if (flg1 && flg2) {
    snake.dx = q[0]; snake.dy = q[1];
  }

  const flg3 = Math.abs(prevdx + q[0]) != 2 && Math.abs(prevdy + q[1]) != 2;
  if (flg1 && flg3) {
    const [x, y] = nextHead.length == 0 ? [snake.x, snake.y] : nextHead.slice(-1)[0];
    nextHead.push([x + snake.dx, y + snake.dy]);
  }
}

init();
setInterval(loop, SPEED);
setInterval(direction, 1000 / 240);

document.addEventListener('keydown', e => {
  const regexResult = regexKeytype.exec(e.key);
  if (!regexResult) return;
  const k = regexResult[1];
  operation.push(
    k == 'Left' ? [-1, 0] :
    k == 'Right' ? [1, 0] :
    k == 'Up' ? [0, -1] :
    [0, 1]);
});
