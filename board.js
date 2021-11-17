class Board {
  constructor(ctx) {
    this.ctx = ctx;

    // 0으로 채운 배열 생성
    this.arr = [];
    let i;
    for (i = 0; i < SIZE.COL + SIZE.EXTRA_COL; i++)
      this.arr.push(Array(SIZE.ROW).fill(0));
  }

  init() {
    // 배열 초기화
    this.arr.forEach((row) => row.fill(0));
  }

  checkIsOverlapped(block, xAdder, yAdder) {
    // 블럭 좌표가 (xAdder, yAdder)만큼 이동했을 때 벽/바닥과 블럭이 겹치는 경우 true 리턴
    // 오류 원인 - forEach는 배열의 모든 요소 순회, break나 return이 통하지 않음
    return block.shape.some((row, j) => {
      return row.some((px, i) => {
        if (
          px !== 0 &&
          (j + block.y + yAdder < 0 ||
            j + block.y + yAdder >= SIZE.COL + SIZE.EXTRA_COL ||
            i + block.x + xAdder < 0 ||
            i + block.x + xAdder >= SIZE.ROW ||
            this.arr[j + block.y + yAdder][i + block.x + xAdder] !== 0)
        )
          return true;
        return false;
      });
    });
  }

  checkCanRotate(block) {
    const tempPiece = block.copy();
    tempPiece.rotate();
    return !this.checkIsOverlapped(tempPiece, 0, 0);
  }

  delFullLines() {
    // 완성된 line
    let j = SIZE.EXTRA_COL,
      delLineNum = 0;
    while (j < SIZE.COL + SIZE.EXTRA_COL) {
      if (
        this.arr[j][0] !== COLOR.BOARD && // 지워지지 않는 line인 경우
        this.arr[j].every((px) => px !== 0)
      ) {
        // 성공한 줄, 삭제
        this.arr.splice(j, 1);
        // 삭제한 줄을 대체하여 맨 앞에 새 줄 추가
        this.arr.unshift(Array(SIZE.ROW).fill(0));

        delLineNum++;
      } else j++;
    }

    return delLineNum;
  }

  addLines(num) {
    // num개의 지워지지 않는 line 추가
    let i,
      delLine,
      isLost = false;

    for (i = 0; i < num; i++) {
      this.arr.push(Array(SIZE.ROW).fill(COLOR.BOARD));
      delLine = this.arr.shift();
      isLost = isLost || !delLine.every((px) => px === 0);
    }

    return !isLost;
  }

  addWall(block) {
    // 테트로이드를 벽에 합체
    block.shape.forEach((row, j) => {
      row.forEach((px, i) => {
        if (px !== 0) this.arr[j + block.y][i + block.x] = block.color;
      });
    });
  }

  erase() {
    ctx.clearRect(
      0,
      SIZE.EXTRA_COL * SIZE.CONST,
      SIZE.ROW * SIZE.CONST,
      SIZE.COL * SIZE.CONST
    );
  }

  draw() {
    this.arr.forEach((row, j) => {
      row.forEach((px, i) => {
        if (px !== 0) {
          ctx.fillStyle = px;
          ctx.fillRect(
            i * SIZE.CONST + SIZE.LINE_CONST / 2,
            j * SIZE.CONST + SIZE.LINE_CONST / 2,
            SIZE.CONST - SIZE.LINE_CONST,
            SIZE.CONST - SIZE.LINE_CONST
          );
        }
      });
    });
  }
}
