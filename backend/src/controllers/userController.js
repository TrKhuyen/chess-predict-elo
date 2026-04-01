const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const userController = {
  updateInfo: async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Không tìm thấy token' });

    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (authError || !authData.user) return res.status(401).json({ error: 'Token không hợp lệ' });

      const uid = authData.user.id;
      const { name, email, password } = req.body || {};
      let finalAvatarUrl = req.body.avatar; // Lấy URL cũ nếu có

      //NẾU CÓ FILE ẢNH ĐƯỢC UPLOAD
      if (req.file) {
        // Tạo tên file duy nhất tránh trùng lặp: ID_ThờiGian.đuôi_file
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `${uid}_${Date.now()}.${fileExt}`;

        // 1. Upload thẳng buffer từ RAM lên Supabase Storage
        const { error: uploadError } = await supabaseAdmin.storage
          .from('avatars')
          .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

        if (uploadError) throw uploadError;

        // 2. Lấy đường link Public của ảnh vừa up
        const { data: publicUrlData } = supabaseAdmin.storage.from('avatars').getPublicUrl(fileName);
        finalAvatarUrl = publicUrlData.publicUrl;
      }

      // Gom dữ liệu để cập nhật
      const updatePayload = {};
      if (email) updatePayload.email = email;
      if (password) updatePayload.password = password;
      if (name || finalAvatarUrl) {
        updatePayload.user_metadata = {}; 
        if (name) updatePayload.user_metadata.username = name; 
        if (finalAvatarUrl) updatePayload.user_metadata.avatar = finalAvatarUrl;
      }

      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(uid, updatePayload);
      if (error) throw error;

      res.status(200).json({ message: "Cập nhật thành công!", user: data.user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = userController;