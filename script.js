const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

// create and draw ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

// create and draw paddle
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

// create bricks
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let z = 0; z < brickColumnCount; z++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = z * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][z] = { x, y, ...brickInfo };
  }
}

// draw bricks on canvas
function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

// draw score
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// move paddle on canvs
function movePaddle() {
  paddle.x += paddle.dx;

  // wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

// move ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // wall collision (check right and left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; // the same as: ball.dx = ball.dx * -1
  }
  // wall collision (check top and bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // bricks collision
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // check left side of a brick
          ball.x + ball.size < brick.x + brick.w && // check right side of a brick
          ball.y + ball.size > brick.y && // check top side of a brick
          ball.y - ball.size < brick.y + brick.h // check bottom side of a brick
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });

  //   Check loss - hit bottom wall
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

// increase score
function increaseScore() {
  score++;

  if (score % (brickRowCount * brickColumnCount) === 0) {
    showAllBricks();
  }
}
// make all bricks appear
function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

// draw everything
function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// Update canvas drawings and animation
function update() {
  movePaddle();
  moveBall();

  // call draw()
  draw();

  requestAnimationFrame(update);
}
update();

// keyDown function (press and hold)
function keyDown(event) {
  if (event.key === "Right" || event.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (event.key === "Left" || event.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}
// keyUp function (release pressed key)
function keyUp(event) {
  if (
    event.key === "Right" ||
    event.key === "ArrowRight" ||
    event.key === "Left" ||
    event.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

// Keyboard event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Rules and close event handlers
rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));
