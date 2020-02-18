let canvas = document.getElementById("game");
let context = canvas.getContext("2d");
let scoreEl = document.getElementById("score");
let score = 0;
let grid = 16;
let count = 0;

let snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};
let apple = {
  x: 320,
  y: 320
};

function pauseClick() {
  pause = !pause;
}
let pause = false;
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function loop() {
  requestAnimationFrame(loop);

  if (pause === true) {
    return;
  }
  if (++count < 6) {
    return;
  }
  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);
  // snake>  move speed
  snake.x += snake.dx;
  snake.y += snake.dy;

  //snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
  // where snake has been. front of the array is always the head
  snake.cells.unshift({ x: snake.x, y: snake.y });
  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
  // draw apple
  context.fillStyle = "green";
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);
  // draw snake one cell at a time
  context.fillStyle = "red";
  snake.cells.forEach(function(cell, index) {
    // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
      snake.maxCells++;
      score++;
      scoreEl.textContent = "Score: " + score;
    }
    // snake eat itself-> reset game
    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        pause = true;
        scoreEl.textContent = "Game over, " + "your score is: " + score;
        document.getElementById("reset").style.display = "block";
        // location.reload();
      }
    }
  });
}
function startAgain() {
  location.reload();
}

document.addEventListener("keydown", function(e) {
  console.log(e.which);
  /* prevent snake from backtracking on itself (pressing left while moving
   left won't do anything, and pressing right while moving left
   shouldn't let you collide with your own body)
   left arrow key*/
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // up arrow key
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // right arrow key
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // down arrow key
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

requestAnimationFrame(loop);