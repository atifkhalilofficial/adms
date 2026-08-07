const User = require('../models/User');

// @route  GET /api/users?role=warehouse_manager
const getUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) {
      filter.role = req.query.role;
    }
    const users = await User.find(filter).select('name email role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUsers };