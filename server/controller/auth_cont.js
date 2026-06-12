import UserModel from"../models/user.js";
import bcrypt  from"bcrypt";
import jwt from"jsonwebtoken";

export const registerUser =  async (req, res)=>{

    try {
        const existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ status: "Error", message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await UserModel.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        // Generate JWT token for the newly registered user
        const token = jwt.sign({
            userId: newUser._id,
            email: newUser.email,
        }, 'secret23', { expiresIn: '2h' }); // Set token expiration to 1 hour

        res.json({ status: "OK", user: newUser, token }); // Include token in the response
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Error", message: "Internal Server Error" });
    }

}

export const loginUser = async (req, res)=>{
    try {
        console.log("Login request received:", req.body); 
        // Find user by email
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ status: "Error", message: "User not found" });
        }

        // Check password
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ status: "Error", message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
            'secret23', // Replace with a secure secret in production
            { expiresIn: '2h' }
        );

        // Determine if it's the user's first login
        const isFirstTime = !user.lastLogin; // Example: Check if lastLogin field is null

        // Update lastLogin field in the database
        user.lastLogin = new Date();
        await user.save();

        // Return user data, token, and first-time flag
        res.json({
            status: "OK",
            user: {
                email: user.email,
                name: user.name,
                isFirstTime, // Include the first-time flag
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Error", message: "Internal Server Error" });
    }
}

export const homeRoute = async (req ,res)=>{
    const token = req.headers['authorization']?.split(' ')[1]; // Get the token from the Authorization header
    if (!token) {
      return res.status(401).json({ status: 'Error', message: 'Token not provided' });
    }
  
    try {
      const decoded = jwt.verify(token, 'secret23');
      const email = decoded.email;
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ status: 'Error', message: 'User not found' });
      }
  
      // Send only the necessary data (e.g., name, email)
      res.json({ status: 'OK', user: { name: user.name, email: user.email } });
      
    } catch (error) {
      console.error(error);
      res.status(401).json({ status: 'Error', message: 'Invalid or expired token' });
    }
};

