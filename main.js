// const isSP = navigator.userAgent.match(/iPhone|Android.+Mobile/);
const isSP = true;

const BLOCK_SIZE = isSP ? 30 : window.screen.availHeight > 912 ? 80 : 70;
const [FIELD_X, FIELD_Y] = isSP ? [11, 20] : [20, 11];
const [START_HEAD_X, START_HEAD_Y] = isSP ? [0, 4] : [4, 10];
const MARGIN = isSP ? 3 : 10;

const SPEED = 1000 / 1.6; //1.6OK 1.7NG

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
const regexOther = /Key(P|R|B)/;

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
    const address = this.y * FIELD_X + this.x;
    console.log(
      String(address) + " : " + String(this.x) + ", " + String(this.y)
    );
    const dead = pickStar.findIndex((item) => item == address);
    console.log("dead: ", dead);
    console.log("pickStar[dead]: ", pickStar[dead]);
    if (dead >= 0) pickStar.splice(dead, 1);
  },
};

const star = { x: null, y: null };

const init = () => {
  snake.x = START_HEAD_X;
  snake.y = START_HEAD_Y;
  snake.len = 5;
  operation.length = 0;
  nextHead.length = 0;
  pickStar.length = 0;
  for (let row = 0; row < FIELD_Y; row++) {
    for (let col = 0; col < FIELD_X; col++) {
      pickStar.push(row * FIELD_X + col);
    }
  }
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
  pickStar.splice(snake.body[0].y * FIELD_X + snake.body[0].x, 5);
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
  pickStar.splice(snake.y * FIELD_X + snake.x, 1);
  snake.body.forEach((it) => {
    const address = it.y * FIELD_X + it.x;
    const dead = pickStar.findIndex((item) => item == address);
    pickStar.splice(dead, 1);
  });
};

const debugInitSP = () => {
  snake.x = 0;
  snake.y = 16;
  snake.len = 141;
  operation.length = 0;
  nextHead.length = 0;
  loopCounter = 0;
  snake.body = [
    { x: 8, y: 0 },
    { x: 9, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 1 },
    { x: 9, y: 1 },
    { x: 8, y: 1 },
    { x: 7, y: 1 },
    { x: 6, y: 1 },
    { x: 5, y: 1 },
    { x: 4, y: 1 },
    { x: 3, y: 1 },
    { x: 2, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
    { x: 3, y: 2 },
    { x: 4, y: 2 },
    { x: 5, y: 2 },
    { x: 6, y: 2 },
    { x: 7, y: 2 },
    { x: 8, y: 2 },
    { x: 9, y: 2 },
    { x: 10, y: 2 },
    { x: 10, y: 3 },
    { x: 9, y: 3 },
    { x: 8, y: 3 },
    { x: 7, y: 3 },
    { x: 6, y: 3 },
    { x: 5, y: 3 },
    { x: 4, y: 3 },
    { x: 3, y: 3 },
    { x: 2, y: 3 },
    { x: 1, y: 3 },
    { x: 1, y: 4 },
    { x: 2, y: 4 },
    { x: 3, y: 4 },
    { x: 4, y: 4 },
    { x: 5, y: 4 },
    { x: 6, y: 4 },
    { x: 7, y: 4 },
    { x: 8, y: 4 },
    { x: 9, y: 4 },
    { x: 10, y: 4 },
    { x: 10, y: 5 },
    { x: 10, y: 6 },
    { x: 10, y: 7 },
    { x: 10, y: 8 },
    { x: 10, y: 9 },
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
    { x: 10, y: 13 },
    { x: 10, y: 14 },
    { x: 10, y: 15 },
    { x: 10, y: 16 },
    { x: 10, y: 17 },
    { x: 10, y: 18 },
    { x: 10, y: 19 },
    { x: 9, y: 19 },
    { x: 8, y: 19 },
    { x: 7, y: 19 },
    { x: 6, y: 19 },
    { x: 5, y: 19 },
    { x: 4, y: 19 },
    { x: 3, y: 19 },
    { x: 2, y: 19 },
    { x: 1, y: 19 },
    { x: 0, y: 19 },
    { x: 0, y: 18 },
    { x: 1, y: 18 },
    { x: 2, y: 18 },
    { x: 3, y: 18 },
    { x: 4, y: 18 },
    { x: 5, y: 18 },
    { x: 6, y: 18 },
    { x: 7, y: 18 },
    { x: 8, y: 18 },
    { x: 9, y: 18 },
    { x: 9, y: 17 },
    { x: 9, y: 16 },
    { x: 9, y: 15 },
    { x: 9, y: 14 },
    { x: 9, y: 13 },
    { x: 9, y: 12 },
    { x: 9, y: 11 },
    { x: 9, y: 10 },
    { x: 9, y: 9 },
    { x: 9, y: 8 },
    { x: 9, y: 7 },
    { x: 9, y: 6 },
    { x: 9, y: 5 },
    { x: 8, y: 5 },
    { x: 7, y: 5 },
    { x: 6, y: 5 },
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
    { x: 2, y: 5 },
    { x: 1, y: 5 },
    { x: 1, y: 6 },
    { x: 2, y: 6 },
    { x: 3, y: 6 },
    { x: 4, y: 6 },
    { x: 5, y: 6 },
    { x: 6, y: 6 },
    { x: 7, y: 6 },
    { x: 8, y: 6 },
    { x: 8, y: 7 },
    { x: 7, y: 7 },
    { x: 6, y: 7 },
    { x: 5, y: 7 },
    { x: 4, y: 7 },
    { x: 3, y: 7 },
    { x: 2, y: 7 },
    { x: 1, y: 7 },
    { x: 1, y: 8 },
    { x: 2, y: 8 },
    { x: 3, y: 8 },
    { x: 4, y: 8 },
    { x: 5, y: 8 },
    { x: 6, y: 8 },
    { x: 7, y: 8 },
    { x: 8, y: 8 },
    { x: 8, y: 9 },
    { x: 8, y: 10 },
    { x: 8, y: 11 },
    { x: 8, y: 12 },
    { x: 8, y: 13 },
    { x: 8, y: 14 },
    { x: 8, y: 15 },
    { x: 8, y: 16 },
    { x: 8, y: 17 },
    { x: 7, y: 17 },
    { x: 6, y: 17 },
    { x: 5, y: 17 },
    { x: 4, y: 17 },
    { x: 3, y: 17 },
    { x: 2, y: 17 },
    { x: 1, y: 17 },
    { x: 0, y: 17 },
  ];
  snake.dx = 1;
  snake.dy = 0;
  star.x = 1;
  star.y = 16;
  pickStar = [
    192, 177, 178, 179, 180, 181, 182, 183, 172, 171, 170, 169, 168, 167, 166,
    165, 154, 155, 156, 157, 158, 159, 160, 161, 139, 128, 117, 106, 105, 116,
    127, 138, 149, 148, 147, 146, 145, 144, 143, 132, 133, 134, 135, 136, 137,
    126, 125, 124, 123, 122, 121, 110, 111, 112, 113, 114, 115, 104, 103, 102,
    101, 100, 99, 88, 77, 66, 55, 44, 33, 22, 11, 0, 1, 2, 3, 4, 5, 6, 7,
  ];
  paint();
};

const loop = () => {
  var newSetSnakeBody = new Set(pickStar);
  newSetSnakeBody.add(snake.y * FIELD_X + snake.x);
  snake.body.forEach((it) => {
    newSetSnakeBody.add(it.y * FIELD_X + it.x);
  });
  console.log("newSetSnakeBody.size: ", newSetSnakeBody.size);
  if (newSetSnakeBody.size != 220) {
    isPaused = true;
    for (let i = 0; i < 220; i++) {
      if (!newSetSnakeBody.has(i)) {
        console.log("miss: ", i);
      }
    }
  }
  if (snake.len + pickStar.length !== 220) {
    console.log("not 220: " + (snake.len + pickStar.length) + "!!!");
    console.log("snake.len: ", snake.len);
    console.log("pickStar.length: ", pickStar.length);
    isPaused = true;
  }
  loopCounter++;
  snake.move();
  const eaten = snake.x === star.x && snake.y === star.y;
  if (eaten) snake.len++;
  if (snake.body.length >= snake.len) {
    const useful = snake.body.shift();
    console.log("useful: ", useful);
    var pushIdx = useful.y * FIELD_X + useful.x;
    console.log("pushIdx: ", pushIdx);
    pickStar.push(pushIdx);
  }
  var newSetSnakeBody = new Set(pickStar);
  newSetSnakeBody.add(snake.y * FIELD_X + snake.x);
  snake.body.forEach((it) => {
    newSetSnakeBody.add(it.y * FIELD_X + it.x);
  });
  console.log("newSetSnakeBody.size: ", newSetSnakeBody.size);
  if (newSetSnakeBody.size != 220) {
    isPaused = true;
    for (let i = 0; i < 220; i++) {
      if (!newSetSnakeBody.has(i)) {
        console.log("miss: ", i);
      }
    }
  }
  debuglog();
  if (eaten) {
    console.log("EATEN!!!");
    var randomNum = Math.random();
    console.log("randomNum: ", randomNum);
    console.log("randomNum: ", randomNum);
    var randomStar = randomNum * pickStar.length;
    console.log("randomNum: ", randomNum);
    console.log("pickStar.length: ", pickStar.length);
    console.log("randomStar: ", randomStar);
    console.log(
      String(randomNum.toFixed(6)) +
        " * " +
        String(pickStar.length) +
        " = " +
        String(randomStar)
    );
    var floorStar = Math.floor(randomStar);
    console.log("floorStar: ", floorStar);
    var nowPickStar = pickStar[floorStar];
    console.log("nowPickStar: ", nowPickStar);
    const nextStar = nowPickStar;
    console.log("nextStar: ", nextStar);
    star.x = nextStar % FIELD_X;
    console.log("FIELD_X: ", FIELD_X);
    console.log(String(nextStar) + " % " + String(FIELD_X) + " = " + star.x);
    star.y = Math.floor(nextStar / FIELD_X);
    console.log(
      "Math.floor(" +
        String(nextStar) +
        " / " +
        String(FIELD_X) +
        ") = " +
        star.y
    );
    console.log("star.x, star.y: ", star.x, star.y);
  }
  var newSetSnakeBody = new Set(pickStar);
  newSetSnakeBody.add(snake.y * FIELD_X + snake.x);
  snake.body.forEach((it) => {
    newSetSnakeBody.add(it.y * FIELD_X + it.x);
  });
  console.log("newSetSnakeBody.size: ", newSetSnakeBody.size);
  if (newSetSnakeBody.size != 220) {
    isPaused = true;
    for (let i = 0; i < 220; i++) {
      if (!newSetSnakeBody.has(i)) {
        console.log("miss: ", i);
      }
    }
  }
  snake.body.forEach((it) => {
    if (snake.x === it.x && snake.y === it.y) {
      console.log("head hit body!!!");
      isPaused = true;
    }
    if (star.x === it.x && star.y === it.y) {
      console.log("star hit body!!!");
      isPaused = true;
    }
    var idx = it.y * FIELD_X + it.x;
    if (pickStar.includes(idx)) {
      console.log("body hit pickStar!!!");
      console.log(String(idx) + " : " + it.x + ", " + it.y);
      debuglog();
      isPaused = true;
    }
  });
  if (snake.x < 0 || snake.y < 0 || snake.x >= FIELD_X || snake.y >= FIELD_Y) {
    console.log("hit wall!!!");
    isPaused = true;
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

const debuglog = () => {
  console.log("loopCounter: ", loopCounter);

  var debugbody = "";
  var newSetSnakeBody = new Set(pickStar);
  newSetSnakeBody.add(snake.y * FIELD_X + snake.x);

  snake.body.forEach((it) => {
    debugbody += "(" + String(it.x) + "," + String(it.y) + "), ";
    newSetSnakeBody.add(it.y * FIELD_X + it.x);
  });
  console.log("snake.body: ", debugbody);
  console.log("snake.x, snake.y: ", snake.x, snake.y);
  console.log("newSetSnakeBody.size: ", newSetSnakeBody.size);

  if (newSetSnakeBody.size != 220) {
    isPaused = true;
    for (let i = 0; i < 220; i++) {
      if (!newSetSnakeBody.has(i)) {
        console.log("miss: ", i);
      }
    }
  }

  // pickStarの中身をdevide個ずつ改行付きで表示
  var devide = 100;
  var debugpickStarDevide = "";
  for (let i = 0; i < pickStar.length / devide; i++) {
    debugpickStarDevide = "";
    for (let j = 0; j < devide; j++) {
      if (pickStar[i * devide + j] == undefined) {
        break;
      }
      debugpickStarDevide += pickStar[i * 100 + j] + ", ";
    }
    console.log("pickStar: ", debugpickStarDevide);
  }

  console.log("pickStar.length: ", pickStar.length);

  console.log("star.x, star.y: ", star.x, star.y);
};

init();
// debugInitSP();

var timerId = setInterval(function () {
  if (!isPaused) loop();
}, SPEED);

// debuglog();
// loop();
// debuglog();
// loop();
// debuglog();
// loop();
// debuglog();
// loop();
// debuglog();

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
    } else if (e.code == "KeyB") {
      debugInitSP();
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
