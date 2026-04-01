import React from 'react';

export default function UserInfo({ user }) {
  // Trích xuất thông tin an toàn
  const metadata = user?.user_metadata || {};
  const name = metadata.username || 'Người chơi ẩn danh';
  const elo = metadata.elo || 1200;
  const email = user?.email || 'Chưa cập nhật email';
  const avatarUrl = metadata.avatar || ''; // Lấy link ảnh từ Supabase

  return (
    <div style={{ 
      maxWidth: '450px', 
      margin: '50px auto', 
      padding: '40px 30px', 
      backgroundColor: 'rgba(255,255,255,0.95)', 
      borderRadius: '16px', 
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
      textAlign: 'center' 
    }}>
      
      {/* 1. KHU VỰC AVATAR NỔI BẬT */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
        {avatarUrl ? (
          // Nếu có link ảnh thì hiển thị thẻ <img>
          <img 
            src={avatarUrl} 
            alt="User Avatar" 
            style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              objectFit: 'cover', 
              border: '4px solid #3b82f6', // Viền xanh dương
              boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)'
            }} 
            onError={(e) => {
              // BẮT LỖI: Nếu link ảnh hỏng, giấu thẻ img đi và hiện cái div chữ cái lên
              e.target.onerror = null; 
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Nếu không có link ảnh HOẶC ảnh bị lỗi thì hiển thị vòng tròn chứa chữ cái */}
        <div style={{ 
          display: avatarUrl ? 'none' : 'flex', 
          width: '120px', 
          height: '120px', 
          borderRadius: '50%', 
          backgroundColor: '#3b82f6', 
          color: 'white', 
          justifyContent: 'center', 
          alignItems: 'center', 
          fontSize: '48px', 
          fontWeight: 'bold', 
          textTransform: 'uppercase', 
          border: '4px solid #bfdbfe',
          boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)'
        }}>
          {name.charAt(0)}
        </div>
      </div>

      {/* 2. KHU VỰC THÔNG TIN TEXT */}
      <h2 style={{ margin: '0 0 5px 0', color: '#1e293b', fontSize: '24px' }}>
        {name}
      </h2>
      <p style={{ margin: '0 0 25px 0', color: '#64748b', fontSize: '15px' }}>
        {email}
      </p>
      
      <div style={{ 
        display: 'inline-block',
        padding: '10px 25px', 
        backgroundColor: '#f8fafc', 
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <span style={{ color: '#475569', fontSize: '16px', marginRight: '10px' }}>Điểm Elo:</span>
        <span style={{ color: '#dc2626', fontWeight: '900', fontSize: '22px' }}>{elo}</span>
      </div>

    </div>
  );
}