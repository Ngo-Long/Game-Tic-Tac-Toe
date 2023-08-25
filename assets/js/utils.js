import { CELL_VALUE, GAME_STATUS } from "./constants.js";

export function checkGameStatus(cellValues) {
  if (!Array.isArray(cellValues) || cellValues.length !== 9) {
    throw new Error("Valid array cell values");
  }

  const checkSetList = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6],
  ];

  const winSetIndex = checkSetList.findIndex((arrItem) => {
    const first = cellValues[arrItem[0]];
    const second = cellValues[arrItem[1]];
    const third = cellValues[arrItem[2]];

    return first !== "" && first === second && second === third;
  });

  // check x win or o win
  if (winSetIndex >= 0) {
    // get value first
    const winValueIndex = checkSetList[winSetIndex][0];
    const winValue = cellValues[winValueIndex];

    return {
      status:
        winValue === CELL_VALUE.CROSS ? GAME_STATUS.X_WIN : GAME_STATUS.O_WIN,
      winPositions: checkSetList[winSetIndex],
    };
  }

  // check end and check playing
  const isEndGame = cellValues.filter((x) => x === "").length === 0;
  return {
    status: isEndGame ? GAME_STATUS.ENDED : GAME_STATUS.PLAYING,
    winPositions: [],
  };
}
