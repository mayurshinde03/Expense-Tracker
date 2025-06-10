// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure the User model is correctly imported
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    console.log('Received registration request:', req.body);
    
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        console.log('User registered successfully:', email);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login Request Body:', req.body); // Log the request body

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email); // Log if the user is not found
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for user:', email); // Log if the password is invalid
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful for user:', email); // Log successful login
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error); // Log any errors
    res.status(500).json({ message: 'Error logging in', error });
  }
});

module.exports = router;