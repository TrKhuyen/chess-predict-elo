import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import MoveHistory from './components/MoveHistory';
import AuthForm from './components/AuthForm'; // Import component mới
import Topbar from './components/Topbar';
import UserInfo from './components/UserInfo';
import ChangeInfo from './components/ChangeInfo';

function App() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [gameOverStatus, setGameOverStatus] = useState(null);
  const [gameBoardKey, setGameBoardKey] = useState(0); 
  const [activeTab, setActiveTab] = useState('home');

  // Kiểm tra xem đã đăng nhập trước đó chưa khi F5 lại trang
  useEffect(() => {
    const savedUser = localStorage.getItem('chess_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('chess_token');
    localStorage.removeItem('chess_user');
    setUser(null);
  };

  const handleUpdateHistory = (newHistory) => { setHistory(newHistory); };
  
  const handleGameOver = (winnerTurn, type) => {
    // ... (Giữ nguyên logic handleGameOver cũ của bạn) ...
    let result = '';
    if (type === 'checkmate') result = (winnerTurn === 'w' ? '⚪ Quân Trắng' : '⚫ Quân Đen') + ' Thắng!';
    else result = 'Hòa!';
    setGameOverStatus(result);
  };

  const resetGame = () => {
    setGameOverStatus(null);
    setHistory([]);
    setGameBoardKey(prevKey => prevKey + 1); 
  };

  // NẾU CHƯA ĐĂNG NHẬP -> HIỂN THỊ FORM
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AuthForm onLoginSuccess={(userData) => setUser(userData)} />
      </div>
    );
  }

  // NẾU ĐÃ ĐĂNG NHẬP -> HIỂN THỊ BÀN CỜ
  return (
    // Thẻ div bọc ngoài cùng không có padding để Topbar tràn viền
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. THANH ĐIỀU HƯỚNG TOPBAR */}
      <Topbar user={user} onLogout={handleLogout} onNavigate={setActiveTab} />
      

      {/* 2. KHU VỰC NỘI DUNG CHÍNH (Có padding) */}
      <div style={{ padding: '40px 20px', flex: 1, position: 'relative' }}>

        {activeTab === 'home' && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '40px' }}>
            <div>
              <GameBoard key={gameBoardKey} onUpdateHistory={handleUpdateHistory} onGameOver={handleGameOver} />
            </div>
            <div>
              <MoveHistory history={history} />
            </div>
          </div>
        )}

        {/* NẾU TAB LÀ INFO -> VẼ HỒ SƠ */}
        {activeTab === 'info' && <UserInfo user={user} />}

        {/* NẾU TAB LÀ EDIT -> VẼ FORM ĐỔI THÔNG TIN */}
        {activeTab === 'edit' && (
          <ChangeInfo 
            user={user} 
            onUpdateSuccess={(updatedUser) => {
              setUser(updatedUser); // Cập nhật state hiện tại
              localStorage.setItem('chess_user', JSON.stringify(updatedUser)); // Cập nhật dưới LocalStorage
            }} 
          />
        )}

        {/* Container chia 2 cột căn giữa */}

        {/* GAME OVER OVERLAY MODAL */}
        {gameOverStatus && (
          <div className="game-over-modal">
            <div className="modal-content">
              <h2>{gameOverStatus}</h2>
              <button onClick={resetGame} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
                Chơi lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;