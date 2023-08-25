import {
  getCellElementList,
  getUlCellList,
  getCurrentTurnElement,
  getCellElementAtIdx,
  getGameStatusElement,
  getReplayGameElement,
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";
import { TURN, CELL_VALUE, GAME_STATUS } from "./constants.js";

// Global variables
let currentTurn = "cross";
let isGameEnded = false;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");

/** TODO:
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 */

(() => {
  // init game
  initCellElementList();

  // replay game
  initReplayGame();
})();

// init game
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
  const isEndGame = gameStatus !== GAME_STATUS.PLAYING;

  if (isCellContains || isEndGame) return;

  // add class
  liElement.classList.add(currentTurn);

  // value cell x or o
  let cellValue =
    currentTurn === TURN.CROSS ? CELL_VALUE.CROSS : CELL_VALUE.CIRCLE;
  cellValues[index] = cellValue;

  // check game
  const game = checkGameStatus(cellValues);

  switch (game.status) {
    case GAME_STATUS.X_WIN:
    case GAME_STATUS.O_WIN:
      displayReplayGame();
      changeStatus(game.status);
      highlightWinCell(game.winPositions);
      isGameEnded = true;
      break;

    case GAME_STATUS.ENDED:
      displayReplayGame();
      changeStatus(game.status);
      isGameEnded = true;
      break;

    default:
  }

  // toggle
  if (!isGameEnded) toggleCurrentTurn();
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

function displayReplayGame() {
  const replayGame = getReplayGameElement();
  if (replayGame) replayGame.classList.add("show");
}

function changeStatus(newGameStatus) {
  gameStatus = newGameStatus;

  const statusElement = getGameStatusElement();
  if (newGameStatus) statusElement.textContent = newGameStatus;
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

// replay game
function initReplayGame() {
  const replayGame = getReplayGameElement();
  if (replayGame) {
    replayGame.addEventListener("click", resetGame);
  }
}

function resetGame() {
  // Global variables
  currentTurn = "cross";
  isGameEnded = false;
  gameStatus = GAME_STATUS.PLAYING;
  cellValues = new Array(9).fill("");

  // hidden button replay
  const replayGame = getReplayGameElement();
  replayGame.addEventListener("click", replayGame.classList.remove("show"));

  resetClassCellList();
  resetCurrentTurn();
  resetGameStatus();
}

function resetClassCellList() {
  const cellElementList = getCellElementList();
  for (const cellElement of cellElementList) {
    cellElement.className = "";
  }
}

function resetCurrentTurn() {
  const currentTurnElement = getCurrentTurnElement();
  if (!currentTurnElement) return;

  currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
  currentTurnElement.classList.add(TURN.CROSS);
}

function resetGameStatus() {
  const gameStatusElement = getGameStatusElement();
  if (!gameStatusElement) return;

  gameStatusElement.textContent = GAME_STATUS.PLAYING;
}
