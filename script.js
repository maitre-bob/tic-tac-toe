// Factory joueur
const Player = (name, mark) => ({name, mark, score: 0});

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
  let players = [];
  let current = 0;
  let gameOver = false;

  const boardEl = document.getElementById("board");
  const msg = document.getElementById("message");
  const info = document.getElementById("info");
  const scoreboard = document.getElementById("scoreboard");
  const scoreX = document.getElementById("scoreX");
  const scoreO = document.getElementById("scoreO");

  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  const updateScore = () => {
    scoreX.textContent = `${players[0].name}: ${players[0].score}`;
    scoreO.textContent = `${players[1].name}: ${players[1].score}`;
  };

  const checkWinner = () => {
    const b = GameBoard.getBoard();
    for(const combo of winCombos){
      const [a,b1,c] = combo;
      if(b[a] && b[a]===b[b1] && b[a]===b[c]){
        players[current].score++;
        updateScore();
        return players[current].name;
      }
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
    msg.textContent = `Au tour de ${players[current].name}`;
    render();
  };

  // Lancer le jeu après que les noms soient entrés
  const startGame = () => {
    const nameX = document.getElementById("playerX").value.trim() || "X";
    const nameO = document.getElementById("playerO").value.trim() || "O";
    players = [Player(nameX,"X"), Player(nameO,"O")];
    document.getElementById("playerForm").style.display="none";
    boardEl.style.display="grid";
    info.style.display="flex";
    scoreboard.style.display="flex";
    updateScore();
    msg.textContent = `Au tour de ${players[current].name}`;
    render();
  };

  document.getElementById("start").addEventListener("click", startGame);
  document.getElementById("reset").addEventListener("click", reset);

  return {render};
})();
