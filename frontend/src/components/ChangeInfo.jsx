import React, { useState } from 'react';

export default function ChangeInfo({ user, onUpdateSuccess }) {
  const [name, setName] = useState(user?.user_metadata?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  
  // Xử lý file ảnh
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.user_metadata?.avatar || ''); // Để hiển thị ảnh cũ hoặc xem trước ảnh mới

  const [message, setMessage] = useState({ text: '', type: '' });

  // Hàm chạy khi người dùng chọn file từ máy
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Tạo một URL tạm thời trên trình duyệt để preview ảnh ngay lập tức
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: 'Đang tải lên, vui lòng chờ...', type: 'info' });

    // Khi gửi File, bắt buộc phải dùng FormData thay vì JSON
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (password) formData.append('password', password);
    if (avatarFile) formData.append('avatarFile', avatarFile); // Gắn file vật lý vào

    try {
      const token = localStorage.getItem('chess_token');
      const response = await fetch('http://localhost:5000/api/user/update', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}` 
          // LƯU Ý KỸ THUẬT: Khi dùng FormData, tuyệt đối KHÔNG set Content-Type
          // Trình duyệt sẽ tự động thêm multipart/form-data và cái boundary cần thiết.
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Cập nhật thất bại');

      setMessage({ text: 'Cập nhật thành công! Giao diện sẽ tự làm mới.', type: 'success' });
      setPassword(''); 
      onUpdateSuccess(data.user);

    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '50px auto', padding: '30px', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Cập Nhật Thông Tin</h2>
      
      {message.text && (
        <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold', backgroundColor: message.type === 'error' ? '#fee2e2' : (message.type === 'info' ? '#fef08a' : '#dcfce3'), color: message.type === 'error' ? '#dc2626' : (message.type === 'info' ? '#a16207' : '#16a34a') }}>
          {message.text}
        </div>
      )}

      <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} onSubmit={handleSubmit}>
        
        {/* KHU VỰC CHỌN ẢNH VÀ PREVIEW */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #1d4ed8', marginBottom: '10px' }} />
          ) : (
             <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>Ảnh</div>
          )}
          <input 
            type="file" 
            accept="image/*" // Chỉ cho phép chọn file ảnh
            onChange={handleFileChange} 
            style={{ fontSize: '14px' }}
          />
        </div>

        <label style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '-10px' }}>Tên hiển thị:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} required />

        <label style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '-10px' }}>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} required />

        <label style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '-10px' }}>Mật khẩu mới (Bỏ trống nếu không đổi):</label>
        <input type="password" placeholder="Nhập mật khẩu mới..." value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />

        <button type="submit" style={{ marginTop: '10px', padding: '12px', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
}