import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

export default function GameBoard({ onUpdateHistory, onGameOver }) {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState("");

  function onSquareClick(square) {
    if (moveFrom === square) {
      setMoveFrom("");
      return;
    }
    
    if (!moveFrom) {
      setMoveFrom(square);
      return;
    }

    try {
      const gameCopy = new Chess();
      gameCopy.loadPgn(game.pgn());
      const move = gameCopy.move({ from: moveFrom, to: square, promotion: 'q' });

      if (move === null) {
        setMoveFrom(square);
        return;
      }

      setGame(gameCopy);
      
      if (onUpdateHistory) {
        onUpdateHistory(gameCopy.history({ verbose: true }));
      }
      
      // KIỂM TRA HẾT CỜ VÀ BÁO CÁO KẾT QUẢ CHO APP CHA
      if (gameCopy.isGameOver()) {
        let winner = '';
        if (gameCopy.isCheckmate()) {
          winner = gameCopy.turn(); // 'w' if black won by mate, 'b' if white won by mate
          // chess.js 'turn()' gives the turn of the next player to move. 
          // So if 'turn()' is 'b', it means the white just made the mate move.
          // winner is the winner of the checkmate, who made the last move.
          // winner = gameCopy.turn() === 'w' ? 'b' : 'w'; 
          winner = gameCopy.turn(); 
          if (winner === 'w') {
            onGameOver('w', 'checkmate'); // white won
          } else {
            onGameOver('b', 'checkmate'); // black won
          }
        } else if (gameCopy.isDraw()) {
          onGameOver(null, 'draw');
        } else if (gameCopy.isStalemate()) {
          onGameOver(null, 'stalemate');
        } else {
          onGameOver(null, 'gameover');
        }
      }

      setMoveFrom("");
    } catch (e) {
      console.log("Nước đi không hợp lệ:", e.message);
      setMoveFrom(square);
    }
  }

  return (
    <div style={{ width: '500px', backgroundColor: 'rgba(255, 255, 0, 0)', padding: '10px' }}>
      <Chessboard 
        position={game.fen()} 
        onSquareClick={onSquareClick}
        boardOrientation="white"
        animationDuration={200}
        customSquareStyles={
          moveFrom ? { [moveFrom]: { backgroundColor: "rgba(255, 255, 0, 0.6)" } } : {}
        }
      />
      
      <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
        Lượt đi: {game.turn() === 'w' ? '⚪ Trắng' : '⚫ Đen'}
      </div>
    </div>
  );
}