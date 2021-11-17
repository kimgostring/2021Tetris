class Block {
  constructor(ctx) {
    this.ctx = ctx;

    // 랜덤 색 지정
    this.color = COLOR.BLOCK[Math.floor(Math.random() * COLOR.BLOCK.length)];
    // 랜덤 모양 지정
    this.shape = SHAPE[Math.floor(Math.random() * SHAPE.length)];

    // 첫 시작 좌표
    this.x = Math.floor(SIZE.ROW / 2);
    this.y = SIZE.EXTRA_COL - this.shape.length; // 블럭이 사용자에게 보이는 보드 바로 위에 등장하도록
  }

  copy() {
    const newPiece = new Block();

    newPiece.ctx = this.ctx;
    newPiece.color = this.color;
    newPiece.shape = this.shape;
    newPiece.x = this.x;
    newPiece.y = this.y;

    return newPiece;
  }

  rotate() {
    const length = this.shape.length,
      newShape = [];

    // 아래 과정을 통해 this.shape의 중심부분을 기준으로 시계 방향 45도 회전 시의 인덱스 계산
    // 인덱스 -> 좌표평면 (this.shape의 중심부를 (0, 0)으로 설정) -> 회전행렬 적용 -> 인덱스
    let i, j;
    for (i = 0; i < length; i++) newShape.push(Array(length).fill(0));
    for (j = 0; j < length; j++)
      for (i = 0; i < length; i++)
        newShape[j][i] = this.shape[i][-j + length - 1];

    this.shape = newShape;
  }

  draw() {
    ctx.fillStyle = this.color;

    this.shape.forEach((row, j) => {
      row.forEach((px, i) => {
        if (px !== 0)
          ctx.fillRect(
            // 블럭의 한 점 사이에 SIZE.LINE_CONST 두께의 흰 선 존재하는 것처럼 연출
            (i + block.x) * SIZE.CONST + SIZE.LINE_CONST / 2,
            (j + block.y) * SIZE.CONST + SIZE.LINE_CONST / 2,
            SIZE.CONST - SIZE.LINE_CONST,
            SIZE.CONST - SIZE.LINE_CONST
          );
      });
    });
  }

  erase() {
    this.shape.forEach((row, j) => {
      row.forEach((px, i) => {
        if (px !== 0)
          ctx.clearRect(
            (i + block.x) * SIZE.CONST,
            (j + block.y) * SIZE.CONST,
            SIZE.CONST,
            SIZE.CONST
          );
      });
    });
  }
}
