const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const speedEl = document.getElementById('speed');
const statusEl = document.getElementById('status');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let velocity = { x: 0, y: 0 };
let nextMove = { x: 0, y: 0 };
let apple = randomPosition();
let score = 0;
let speed = 6;
let gameOver = false;

window.addEventListener('keydown', (event) => {
  const directionMap = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };

  if (event.key === 'Enter' && gameOver) {
    restartGame();
    return;
  }

  if (!directionMap[event.key]) {
    return;
  }

  const direction = directionMap[event.key];
  if (snake.length > 1 && direction.x === -velocity.x && direction.y === -velocity.y) {
    return;
  }

  nextMove = direction;
});

function randomPosition() {
  let position;

  do {
    position = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (snake.some((segment) => segment.x === position.x && segment.y === position.y));

  return position;
}

function restartGame() {
  snake = [{ x: 10, y: 10 }];
  velocity = { x: 0, y: 0 };
  nextMove = { x: 0, y: 0 };
  apple = randomPosition();
  score = 0;
  speed = 6;
  gameOver = false;
  statusEl.textContent = 'Use arrow keys to move';
  draw();
  requestAnimationFrame(update);
}

function update() {
  if (gameOver) {
    return;
  }

  if (nextMove.x !== 0 || nextMove.y !== 0) {
    velocity = nextMove;
  }

  if (velocity.x === 0 && velocity.y === 0) {
    requestAnimationFrame(update);
    return;
  }

  const head = {
    x: snake[0].x + velocity.x,
    y: snake[0].y + velocity.y,
  };

  const hitWall = head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;
  const hitSelf = snake.some((segment) => segment.x === head.x && segment.y === head.y);

  if (hitWall || hitSelf) {
    gameOver = true;
    statusEl.textContent = 'Game Over — Press Enter to restart';
    draw();
    return;
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    score += 1;
    speed = Math.min(15, speed + 0.3);
    apple = randomPosition();
  } else {
    snake.pop();
  }

  draw();
  setTimeout(() => requestAnimationFrame(update), 1000 / speed);
}

function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * gridSize, y * gridSize, gridSize - 1, gridSize - 1);
}

function draw() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawRect(apple.x, apple.y, '#e74c3c');
  snake.forEach((segment, index) => {
    drawRect(segment.x, segment.y, index === 0 ? '#2ecc71' : '#27ae60');
  });
  scoreEl.textContent = `Score: ${score}`;
  speedEl.textContent = `Speed: ${Math.round(speed * 10) / 10}`;
}

draw();
requestAnimationFrame(update);