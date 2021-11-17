const canvasDOM = document.querySelector("#js-board"),
  startBtnDOM = document.querySelector(".js-startBtn"),
  resetBtnDOM = document.querySelector(".js-resetBtn"),
  scoreDOM = document.querySelector(".js-score"),
  levelDOM = document.querySelector(".js-level");

let board, ctx, block;
let timer;
let isPaused = true,
  isAtFirst = true,
  isLost = false;
let score = 0,
  level = 1;

const movePieceLeft = () => {
  if (board.checkIsOverlapped(block, -1, 0)) return;

  block.erase();
  block.x--;
  block.draw();
};

const movePieceRight = () => {
  if (board.checkIsOverlapped(block, 1, 0)) return;

  block.erase();
  block.x++;
  block.draw();
};

const rotatePiece = () => {
  if (!board.checkCanRotate(block)) return;

  block.erase();
  block.rotate();
  block.draw();
};

const scoreUp = (scoreAdder) => {
  score = score + scoreAdder * SCORE.CONST;
  scoreDOM.innerText = score;
};

const levelUp = () => {
  // 한 번에 두 단계 이상 레벨업 할 일 없다고 가정, SCORE.CRITERIA > 4(block의 최대 col) 여야 문제 생기지 않음
  level++;
  if (level % 3 === 0) {
    // 보드가 두 줄 올라옴
    const isLost = !board.addLines(2);
    board.erase();
    board.draw();

    if (isLost) lose();
  }

  window.clearInterval(timer);
  timer = window.setInterval(movePieceDown, SPEED[level - 1]);

  if (level === SPEED.length) levelDOM.innerText = "MAX";
  else levelDOM.innerText = level;
};

const lose = () => {
  isLost = true;

  // 버튼에 비활성화됨 표시
  startBtnDOM.classList.add("soft");
  pause();
};

const movePieceDown = () => {
  if (board.checkIsOverlapped(block, 0, 1)) {
    // 테트로이드가 바닥에 닿은 경우
    // 1. 보드에 벽으로 기록
    board.addWall(block);

    // 2. 줄 제거에 따른 점수/레벨 변경
    const delLineNum = board.delFullLines();
    if (delLineNum !== 0) scoreUp(delLineNum);
    if (level < SPEED.length && score >= level * SCORE.CRITERIA) levelUp();

    board.erase();
    board.draw();

    // 3. 새 테트로이드 생성
    block = new Block();
    if (board.checkIsOverlapped(block, 0, 0)) lose();
    else block.draw();
  }
  // 바닥에 닿지 않은 경우, 테트로이드 한 칸 내려 그리기
  else {
    block.erase();
    block.y++;
    block.draw();
  }
};

const start = () => {
  // 패배한 경우 시작 불가, 초기화 필요
  if (isLost) return;

  if (isAtFirst) {
    // 최초 게임 시작
    isAtFirst = false;

    block = new Block();
    block.draw();
  }

  // 타이머 작동, 버튼 글자 변경
  isPaused = false;

  timer = window.setInterval(movePieceDown, SPEED[level - 1]);

  startBtnDOM.innerText = BTN_TEXT.START;
  resetBtnDOM.classList.add("soft");
};

const pause = () => {
  // 타이머 해지, 키 일부 동작, 버튼 글자 변경
  isPaused = true;

  window.clearInterval(timer);
  timer = null;

  startBtnDOM.innerText = BTN_TEXT.PAUSE;
  resetBtnDOM.classList.remove("soft");
};

const reset = () => {
  // 멈춘 상태에서만 초기화 가능
  if (!isPaused) return;

  isAtFirst = true;
  isLost = false;
  if (startBtnDOM.classList.contains("soft"))
    startBtnDOM.classList.remove("soft");

  score = 0;
  level = 1;

  board.init();
  board.erase();
};

const toggleStartBtn = () => {
  if (isPaused) start();
  else pause();
};

const handleKey = (event) => {
  if (isPaused) {
    switch (event.keyCode) {
      case KEY.ENTER: // start
        start();
        break;

      case KEY.R: // reset game
        reset();
        break;
    }
  } else {
    switch (event.keyCode) {
      case KEY.LEFT:
      case KEY.A:
        movePieceLeft();
        break;

      case KEY.RIGHT:
      case KEY.D:
        movePieceRight();
        break;

      case KEY.DOWN: // put down quickly
      case KEY.S:
        movePieceDown();
        break;

      case KEY.UP: // rotate
      case KEY.W:
        rotatePiece();
        break;

      case KEY.ENTER: // pause
        pause();
        break;
    }
  }
};

// 맨 처음 실행될 부분
const init = () => {
  if (!canvasDOM.getContext) {
    console.log("this browser is canvas-unsupported. ");
    return -1;
  }

  // 캔버스 크기 조정
  // 보드 크기는 SIZE.ROW x (SIZE.COL * SIZE.EXTRA_COL)
  // SIZE.EXTRA_COL만큼의 보드 맨 윗부분은 보이지 않음, 거기에 새 블록 리스폰됨
  canvasDOM.width = SIZE.ROW * SIZE.CONST;
  canvasDOM.height = SIZE.COL * SIZE.CONST;
  ctx = canvasDOM.getContext("2d");

  // 보드의 위쪽 여유분 보이지 않도록 위치 조정
  ctx.translate(0, -SIZE.EXTRA_COL * SIZE.CONST);

  board = new Board(ctx);

  // 버튼 및 키입력 리스너 연결
  startBtnDOM.addEventListener("click", toggleStartBtn);
  resetBtnDOM.addEventListener("click", reset);
  document.addEventListener("keydown", handleKey);
};

init();
