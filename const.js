const COLOR = {
  BLOCK: ["LightCoral", "LightSalmon", "LightGreen", "LightSkyBlue", "Pink"],
  BOARD: "Dimgray",
};

const SHAPE = [
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
  [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
  ],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ],
];

const SIZE = {
  COL: 20,
  EXTRA_COL: 4,
  ROW: 10,
  CONST: 200,
  LINE_CONST: 20,
};

const SPEED = [500, 400, 350, 300, 200, 180, 150];

const SCORE = {
  CONST: 10,
  CRITERIA: 70,
};

const KEY = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  A: 65,
  W: 87,
  S: 83,
  D: 68,
  R: 82,
  ENTER: 13,
};

const BTN_TEXT = {
  START: "pause (enter)",
  PAUSE: "start (enter)",
  RESET: "reset (r)",
};
