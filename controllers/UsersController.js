const { v4: uuidv4 } = require('uuid');
const sha1 = require('sha1');
const dbClient = require('../utils/db');

const UsersController = {
  postNew: async (req, res) => {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      // Check if the email already exists in the database
      const existingUser = await dbClient.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Hash the password using SHA1
      const hashedPassword = sha1(password);

      // Create a new user object
      const newUser = {
        email,
        password: hashedPassword,
        id: uuidv4() // Generate a unique ID for the user
      };

      // Save the new user to the database
      await dbClient.createUser(newUser);

      // Return the new user with email and id only
      return res.status(201).json({ email: newUser.email, id: newUser.id });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = UsersController;
