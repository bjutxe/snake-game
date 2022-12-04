const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const BLOCK_SIZE = 80;

const FIELD_X = 20;
const FIELD_Y = 11;

const SPEED = 1000 / 2.483;

let operation = [];

canvas.width = BLOCK_SIZE * FIELD_X;
canvas.height = BLOCK_SIZE * FIELD_Y;

canvas.setAttribute('style', 'display:block;margin:auto;background-color:#aaa');

document.body.appendChild(canvas);

const snake = {
  x: null,
  y: null,
  dx: 1,
  dy: 0,
  tail: null,
  
  update: function() {
    this.body.push({x: this.x, y: this.y});

    q = operation.shift();
    if ((typeof q != "undefined") && (this.dx + q[0] != 0) && (this.dy + q[1] != 0)) {
      this.dx = q[0]; this.dy = q[1];
    }
    this.x += this.dx; this.y += this.dy;
    operation = [];

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
  x: null,
  y: null,
  
  update: function() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x * BLOCK_SIZE + 1, this.y * BLOCK_SIZE + 1, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
  },
}

const init = () => {
  snake.x = 0;
  snake.y = FIELD_Y - 1;
  snake.tail = 4;
  snake.body = [];
  snake.dx = 1;
  snake.dy = 0;
  
  star.x = 10;
  star.y = 5;
}

const loop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  snake.update();
  star.update();
  
  if (snake.x === star.x && snake.y === star.y) {
    snake.tail++;
    star.x = Math.floor(Math.random() * FIELD_X);
    star.y = Math.floor(Math.random() * FIELD_Y);
  }
}

init();
setInterval(loop, SPEED);

document.addEventListener('keydown', e => {
  switch(e.key) {
    case 'ArrowLeft':
      operation.push([-1, 0]);
      break;
    case 'ArrowRight':
      operation.push([1, 0]);
      break;
    case 'ArrowUp':
      operation.push([0, -1]);
      break;
    case 'ArrowDown':
      operation.push([0, 1]);
      break;
  }
});
