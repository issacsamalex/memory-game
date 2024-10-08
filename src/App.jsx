import { useEffect, useMemo, useRef, useState } from "react";
import Confetti from "react-confetti";
import "./App.css";

const gameIcons = ["🍕", "🌹", "❤️", "🎁", "🤖", "👀", "✨", "🎸", "🎊"];

function App() {
  const [pieces, setPieces] = useState([]);
  let timeOut = useRef();
  const isGameCompleted = useMemo(() => {
    if (pieces.length && pieces.every((piece) => piece.solved)) {
      return true;
    }
    return false;
  }, [pieces]);

  const startGame = () => {
    const duplicateGameIcons = gameIcons.concat(gameIcons);
    const newGameIcons = [];
    while (newGameIcons.length < gameIcons.length * 2) {
      const randomIndex = Math.floor(Math.random() * duplicateGameIcons.length);
      newGameIcons.push({
        emoji: duplicateGameIcons[randomIndex],
        flipped: false,
        solved: false,
        position: newGameIcons.length,
      });
      duplicateGameIcons.splice(randomIndex, 1);
    }
    setPieces(newGameIcons);
  };

  useEffect(() => {
    startGame();
  }, []);

  const handleActive = (data) => {
    const flippedData = pieces.filter(
      (piece) => piece.flipped && !piece.solved
    );
    if (flippedData.length === 2) return;

    const newPieces = pieces.map((piece) => {
      if (piece.position === data.position) {
        piece.flipped = !piece.flipped;
      }
      return piece;
    });
    setPieces(newPieces);
  };

  const gameLogicForFlipped = () => {
    const flippedData = pieces.filter(
      (piece) => piece.flipped && !piece.solved
    );
    if (flippedData.length === 2) {
      timeOut.current = setTimeout(() => {
        if (flippedData[0].emoji === flippedData[1].emoji) {
          // success logic
          setPieces(
            pieces.map((piece) => {
              if (
                piece.position === flippedData[0].position ||
                piece.position === flippedData[1].position
              ) {
                piece.solved = true;
              }
              return piece;
            })
          );
        } else {
          setPieces(
            pieces.map((piece) => {
              if (
                piece.position === flippedData[0].position ||
                piece.position === flippedData[1].position
              ) {
                piece.flipped = false;
              }
              return piece;
            })
          );
        }
      }, 1000);
    }
  };

  useEffect(() => {
    gameLogicForFlipped();

    return () => {
      clearTimeout(timeOut.current);
    };
  }, [pieces]);

  return (
    <>
      <main>
        <div className="title-container">
          <h1>🪁 Memory Matching Game 🪁</h1>
        </div>
        <div className="container">
          {pieces.map((data, index) => (
            <div
              key={index}
              className={`flip-card ${
                data.flipped || data.solved ? "active" : ""
              } `}
              onClick={() => handleActive(data)}
            >
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img
                    src="/assets/img_1.jpg"
                    alt="Avatar"
                  />
                </div>
                <div className="flip-card-back">{data.emoji}</div>
              </div>
            </div>
          ))}
        </div>

        {isGameCompleted && (
          <div className="game-completed">
            <div className="wrapper">
              <div className="glow"></div>
              <div className="mask">
                <div className="container-gif">
                  <div className="star">&#10022;</div>
                  <div className="main"></div>
                  <div className="stem1"></div>
                  <div className="stemCrease"></div>
                  <div className="stem2"></div>
                  <div className="base"></div>
                  <div className="arms"></div>
                </div>
              </div>
            </div>
            <h1>YOU WIN!!!</h1>
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          </div>
        )}
      </main>
    </>
  );
}

export default App;
