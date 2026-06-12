// middleware/auth.js

import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token from the 'Authorization' header

    if (!token) {
        return res.status(403).json({ error: "No token provided" });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET || 'secret23', (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid token" });
        }

        // Attach the decoded token data to the request object for use in other routes
        req.user = decoded;
        next(); // Pass control to the next middleware or route handler
    });
};

export default authenticateJWT;
