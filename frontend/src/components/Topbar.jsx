import React, { useState } from 'react';

export default function Topbar({ user, onLogout, onNavigate }) {
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Lấy dữ liệu user
  const metadata = user?.user_metadata || {};
  const username = metadata.username || 'Ẩn danh';
  const elo = metadata.elo || 1200;
  const email = user?.email || '';
  const avatarUrl = metadata.avatar || ''; // Thêm biến lấy URL Avatar

  const handleMenuClick = (tabName) => {
    onNavigate(tabName);
    setShowDropdown(false);
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 40px', backgroundColor: 'rgba(15, 23, 42, 0.95)', 
      color: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
      position: 'relative', zIndex: 100
    }}>
      {/* Góc trái: Tên Web */}
      <h2 
        onClick={() => onNavigate('home')}
        style={{ margin: 0, fontSize: '22px', cursor: 'pointer', textTransform: 'uppercase' }}
      >
        ♟️ ChessMulti
      </h2>

      {/* Góc phải: Avatar và Dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center'
          }}
        >
          {/* NẾU CÓ AVATAR -> HIỂN THỊ THẺ IMG */}
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="Avatar" 
              style={{
                width: '42px', height: '42px', borderRadius: '50%',
                objectFit: 'cover', border: '2px solid rgba(255,255,255,0.8)',
                transition: 'transform 0.2s', backgroundColor: 'white'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex'; // Hiện cái div chữ cái lên
              }}
            />
          ) : null}

          {/* NẾU KHÔNG CÓ (HOẶC ẢNH HỎNG) -> HIỂN THỊ CHỮ CÁI ĐẦU */}
          <div style={{
            display: avatarUrl ? 'none' : 'flex',
            width: '42px', height: '42px', borderRadius: '50%',
            backgroundColor: '#2563eb', color: 'white',
            justifyContent: 'center', alignItems: 'center',
            fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase',
            border: '2px solid rgba(255,255,255,0.8)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            {username.charAt(0)}
          </div>
        </button>

        {/* Menu Dropdown */}
        {showDropdown && (
          <div style={{
            position: 'absolute', top: '60px', right: '0',
            backgroundColor: 'white', color: '#333', width: '220px',
            borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }}>
            <button 
              onClick={() => handleMenuClick('info')}
              style={{ padding: '15px', textAlign: 'left', border: 'none', background: 'white', cursor: 'pointer', borderBottom: '1px solid #eee', fontSize: '15px' }}
              onMouseOver={(e) => e.target.style.background = '#f8fafc'}
              onMouseOut={(e) => e.target.style.background = 'white'}
            >
              👤 Thông tin cá nhân
            </button>
            <button 
              onClick={() => handleMenuClick('edit')}
              style={{ padding: '15px', textAlign: 'left', border: 'none', background: 'white', cursor: 'pointer', borderBottom: '1px solid #eee', fontSize: '15px' }}
              onMouseOver={(e) => e.target.style.background = '#f8fafc'}
              onMouseOut={(e) => e.target.style.background = 'white'}
            >
              ⚙️ Cập nhật thông tin
            </button>
            <button 
              onClick={onLogout}
              style={{ padding: '15px', textAlign: 'left', border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}
              onMouseOver={(e) => e.target.style.background = '#fecaca'}
              onMouseOut={(e) => e.target.style.background = '#fee2e2'}
            >
              🚪 Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
}