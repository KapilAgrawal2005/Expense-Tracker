const db = require("../database/db");
const bcrypt = require('bcrypt');
const getUserSettings = async (req, res) => {
  try {
    const [user] = await db.promise().query(
      'SELECT id, username, email FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (!user[0]) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, user: user[0] });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
};

const updateProfile = async (req, res) => {
  const { username, email } = req.body;
  
  try {
    await db.promise().query(
      'UPDATE users SET username = ?, email = ? WHERE id = ?',
      [username, email, req.user.id]
    );
    
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  try {
    // Verify current password
    const [user] = await db.promise().query(
      'SELECT password FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (!user[0] || !(await bcrypt.compare(currentPassword, user[0].password))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);
    
    // Update password
    await db.promise().query(
      'UPDATE users SET password = ? WHERE id = ?',
      [newHash, req.user.id]
    );
    
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ success: false, message: 'Failed to update password' });
  }
};

// const updatePreferences = async (req, res) => {
//   const { dark_mode, email_notifications, weekly_reports, currency, language } = req.body;
  
//   try {
//     await db.promise().query(
//       `UPDATE users SET 
//        dark_mode = ?, 
//        email_notifications = ?, 
//        weekly_reports = ?,
//        currency = ?,
//        language = ?
//        WHERE id = ?`,
//       [dark_mode, email_notifications, weekly_reports, currency, language, req.user.id]
//     );
    
//     res.json({ success: true, message: 'Preferences updated successfully' });
//   } catch (error) {
//     console.error('Error updating preferences:', error);
//     res.status(500).json({ success: false, message: 'Failed to update preferences' });
//   }
// };

module.exports = {
  getUserSettings,
  updateProfile,
  updatePassword,
//   updatePreferences
};