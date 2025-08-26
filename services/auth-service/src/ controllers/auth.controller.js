import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
// @desc    Register a new user
// @route   POST /api/auth/register
// in /services/auth-service/src/controllers/auth.controller.js

// in /services/auth-service/src/controllers/auth.controller.js

export const registerUser = async (req, res) => {

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email }); 
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Now, create the user with the variables
    user = new User({
      name,
      email,
      password,
    });

    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};;

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

  const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
  return res.status(400).json({ msg: 'Invalid credentials' });
       }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};