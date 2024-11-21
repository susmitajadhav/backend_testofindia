//middleware/auth.js
const jwt = require('jsonwebtoken');

// Middleware to verify token
async function auth(req, res, next) {
    try {
        const token = req.header('auth-token');
        if (!token) return res.status(401).json({ errors: true, message: "Access denied. No token provided." });

        const verifyToken = jwt.verify(token, process.env.SEC);
        req.user = verifyToken;
        next();
    } catch (error) {
        return res.status(400).json({ errors: true, message: "Invalid token." });
    }
}

module.exports = auth;
