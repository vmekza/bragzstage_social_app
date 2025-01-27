import express from 'express';
import User from '../models/User.js';

const router = express.Router();

//Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).send({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).send({ error: error.message });
    console.error(error);
  }
});

export default router;
