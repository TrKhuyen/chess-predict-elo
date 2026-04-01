const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Khởi tạo kết nối đến Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;