const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');

// Admin routes (protected)
router.get('/', auth, adminAuth, getUsers);
router.get('/:id', auth, adminAuth, getUserById);
router.patch('/:id', auth, adminAuth, updateUser);
router.delete('/:id', auth, adminAuth, deleteUser);

module.exports = router; 