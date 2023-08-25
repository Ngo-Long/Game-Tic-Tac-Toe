import {
  getCellElementList,
  getUlCellList,
  getCurrentTurnElement,
  getCellElementAtIdx,
  getGameStatusElement,
  getreplayGameElement,
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";
import { TURN, CELL_VALUE, GAME_STATUS } from "./constants.js";

// Global variables
let currentTurn = "cross";
let isGameEnded = false;
let cellValues = new Array(9).fill("");

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
  // init game
  initCellElementList();
})();

function initCellElementList() {
  const cellElementList = getCellElementList();
  if (cellElementList) {
    cellElementList.forEach((liElement, index) => {
      liElement.dataset.idx = index;
    });
  }

  const ulElement = getUlCellList();
  if (ulElement) {
    ulElement.addEventListener("click", (e) => {
      let liElement = e.target;
      if (liElement.tagName != "LI") return;

      const index = Number.parseInt(liElement.dataset.idx);
      handleCellListElement(liElement, index);
    });
  }
}

function handleCellListElement(liElement, index) {
  const isCellContains =
    liElement.classList.contains(TURN.CROSS) ||
    liElement.classList.contains(TURN.CIRCLE);

  if (isCellContains) return;

  // add class
  liElement.classList.add(currentTurn);

  // value cell x or o
  let cellValue =
    currentTurn === TURN.CROSS ? CELL_VALUE.CROSS : CELL_VALUE.CIRCLE;
  cellValues[index] = cellValue;

  const game = checkGameStatus(cellValues);

  console.log(game);
  console.log(game.status);

  switch (game.status) {
    case GAME_STATUS.X_WIN:
    case GAME_STATUS.O_WIN:
      displayReplayGame();
      changeStatus(game.status);
      highlightWinCell(game.winPositions);
      break;

    case GAME_STATUS.ENDED:
      displayReplayGame();
      changeStatus(game.status);
      break;

    default:
  }

  // toggle
  toggleCurrentTurn();
}

function toggleCurrentTurn() {
  currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

  // DOM turn
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
    currentTurnElement.classList.add(currentTurn);
  }
}

function changeStatus(gameStatus) {
  const statusElement = getGameStatusElement();
  if (gameStatus) statusElement.textContent = gameStatus;
}

function displayReplayGame() {
  const replayGame = getreplayGameElement();
  if (replayGame) replayGame.classList.add("show");
}

function highlightWinCell(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) {
    throw new Error("Invalid win position");
  }

  for (const position of winPositions) {
    const liElement = getCellElementAtIdx(position);
    liElement.classList.add("win");
  }
}
