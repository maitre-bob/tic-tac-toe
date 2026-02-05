// Factory joueur
const Player = (name, mark) => ({name, mark});

// Module GameBoard (singleton)
const GameBoard = (() => {
  const board = ["","","","","","","","",""];
  const getBoard = () => board;
  const setMark = (index, mark) => { if(!board[index]) board[index]=mark; };
  const reset = () => board.fill("");
  return {getBoard, setMark, reset};
})();

// Module GameController
const GameController = (() => {
  let players = [Player("Joueur X","X"),Player("Joueur O","O")];
  let current = 0;
  let gameOver = false;
  const boardEl = document.getElementById("board");
  const msg = document.getElementById("message");

  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  const checkWinner = () => {
    const b = GameBoard.getBoard();
    for(const combo of winCombos){
      const [a,b1,c] = combo;
      if(b[a] && b[a]===b[b1] && b[a]===b[c]) return players[current].name;
    }
    if(b.every(cell=>cell)) return "Égalité";
    return null;
  };

  const render = () => {
    boardEl.innerHTML = "";
    GameBoard.getBoard().forEach((cell,i)=>{
      const div = document.createElement("div");
      div.classList.add("cell");
      div.textContent = cell;
      div.addEventListener("click",()=>handleClick(i));
      boardEl.appendChild(div);
    });
  };

  const handleClick = (i) => {
    if(gameOver || GameBoard.getBoard()[i]) return;
    GameBoard.setMark(i, players[current].mark);
    const result = checkWinner();
    if(result){
      msg.textContent = result==="Égalité" ? "Égalité !" : `${result} a gagné !`;
      gameOver = true;
    } else {
      current = 1-current;
      msg.textContent = `Au tour de ${players[current].name}`;
    }
    render();
  };

  const reset = () => {
    GameBoard.reset();
    current = 0;
    gameOver = false;
    msg.textContent = `Joueur X commence`;
    render();
  };

  document.getElementById("reset").addEventListener("click", reset);

  return {render};
})();

GameController.render();
