const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SIGNUP_ALLOWED_ROLES = ['viewer', 'analyst'];

/** Public self-service sign-up — role may be viewer or analyst only (admin is never allowed here). */
exports.signup = async (req, res) => {
  const { name, email, password, role: requestedRole } = req.body;
  const trimmedName = name?.trim();
  const trimmedEmail = email?.trim().toLowerCase();
  const role = SIGNUP_ALLOWED_ROLES.includes(requestedRole) ? requestedRole : 'viewer';

  if (!trimmedName || !trimmedEmail || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  if (requestedRole && !SIGNUP_ALLOWED_ROLES.includes(requestedRole)) {
    return res.status(400).json({ message: 'Invalid role. Choose viewer or analyst.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      role,
      active: true,
    });
    res.status(201).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors || {})
        .map((e) => e.message)
        .join(' ');
      return res.status(400).json({ message: msg || 'Invalid account details' });
    }
    console.error('signup error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name?.trim(),
      email: email?.trim().toLowerCase(),
      password: hashedPassword,
      role: role || 'viewer',
    });
    res.status(201).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'User already exists' });
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail =
      typeof email === 'string' ? email.trim().toLowerCase() : String(email ?? '').trim().toLowerCase();
    if (!normalizedEmail) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.active) return res.status(403).json({ message: 'Account is inactive' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const rows = await User.find().sort({ name: 1 }).lean();
    const payload = rows.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      active: u.active,
    }));
    res.json(payload);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, active } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { role, active: Boolean(active) },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user' });
  }
};
