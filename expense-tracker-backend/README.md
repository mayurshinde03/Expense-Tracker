### Prerequisites

1. **Node.js**: Make sure you have Node.js installed on your machine.
2. **MongoDB**: You can use a local MongoDB instance or a cloud service like MongoDB Atlas.
3. **Postman**: For testing the API endpoints.

### Step 1: Set Up Your Project

1. Create a new directory for your project and navigate into it:

   ```bash
   mkdir expense-tracker-backend
   cd expense-tracker-backend
   ```

2. Initialize a new Node.js project:

   ```bash
   npm init -y
   ```

3. Install the required packages:

   ```bash
   npm install express mongoose bcryptjs jsonwebtoken dotenv
   ```

### Step 2: Create the Project Structure

Create the following folder structure:

```
expense-tracker-backend/
│
├── .env
├── server.js
├── models/
│   └── User.js
└── routes/
    └── auth.js
```

### Step 3: Create the User Model

Create a file named `User.js` in the `models` folder:

```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('User', userSchema);
```

### Step 4: Create Authentication Routes

Create a file named `auth.js` in the `routes` folder:

```javascript
// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

module.exports = router;
```

### Step 5: Set Up the Server

Create the `server.js` file:

```javascript
// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

### Step 6: Create the `.env` File

Create a `.env` file in the root of your project:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Step 7: Run the Application

1. Start your MongoDB server (if using a local instance).
2. Run your Node.js application:

   ```bash
   node server.js
   ```

### Step 8: Test the API

You can use Postman to test the API:

1. **Register a new user**:
   - POST `http://localhost:5000/api/auth/register`
   - Body (JSON):
     ```json
     {
       "username": "testuser",
       "password": "password123"
     }
     ```

2. **Login**:
   - POST `http://localhost:5000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "username": "testuser",
       "password": "password123"
     }
     ```

If successful, you should receive a JWT token in response.

### Conclusion

This is a basic implementation of a backend for a login page in an Expense Tracker application. You can expand this by adding more features such as password reset, email verification, and user roles. Always remember to handle errors and validate user input in a production environment.