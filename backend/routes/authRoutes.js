const express = require('express');
const router = express.Router();
const { login, signup, register, getUsers, updateUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { USER_ADMIN_ROLES } = require('../middleware/accessPolicies');

router.post('/login', login);
router.post('/signup', signup);
router.post('/register', protect, authorize(USER_ADMIN_ROLES), register);
router.get('/users', protect, authorize(USER_ADMIN_ROLES), getUsers);
router.put('/users/:id', protect, authorize(USER_ADMIN_ROLES), updateUser);

module.exports = router;
