const express = require('express');
const jwt = require('jsonwebtoken');
const Password = require('../models/Password');

const router = express.Router();

// Middleware to verify JWT token and get user ID
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Add a new password
router.post('/', authMiddleware, async (req, res) => {
  const { name, email, password, category } = req.body;

  try {
    const newPassword = new Password({
      user: req.userId,
      name,
      email,
      password,
      category,
    });

    const savedPassword = await newPassword.save();
    res.status(201).json(savedPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all passwords for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const passwords = await Password.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(passwords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
