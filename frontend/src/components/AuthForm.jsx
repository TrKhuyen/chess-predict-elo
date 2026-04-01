import React, { useState } from 'react';

export default function AuthForm({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { email, password, username };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra');
      }

      if (isLogin) {
        // Lưu token vào LocalStorage để dùng cho các request sau
        localStorage.setItem('chess_token', data.token);
        localStorage.setItem('chess_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        alert("Đăng ký thành công! Hãy đăng nhập.");
        setIsLogin(true);
      }
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>
        {isLogin ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản'}
      </h2>
      
      {errorMsg && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{errorMsg}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {!isLogin && (
          <input 
            type="text" placeholder="Tên hiển thị (Username)" required
            value={username} onChange={(e) => setUsername(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        )}
        <input 
          type="email" placeholder="Email" required
          value={email} onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input 
          type="password" placeholder="Mật khẩu (ít nhất 6 ký tự)" required
          value={password} onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
          {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
        <span 
          style={{ color: '#1d4ed8', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
        </span>
      </p>
    </div>
  );
}