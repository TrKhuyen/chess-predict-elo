const supabase = require('../config/supabaseClient');

const authController = {
  register: async (req, res) => {
    const { email, password, username } = req.body;

    try {
      // Gọi API Supabase để tạo user mới
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: { 
            username: username,
            elo: 1200 // Elo mặc định cho người mới
          }
        }
      });

      if (error) throw error;
      res.status(200).json({ message: "Đăng ký thành công!", user: data.user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Gọi API Supabase để xác thực
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;
      
      // Trả về token và thông tin user cho Frontend
      res.status(200).json({ 
        message: "Đăng nhập thành công!", 
        token: data.session.access_token,
        user: data.user 
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = authController;