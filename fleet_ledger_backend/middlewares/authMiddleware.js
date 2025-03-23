// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const verifyToken = (req, res, next) => {
//     const token = req.header('Authorization');
//     if (!token) return res.status(401).json({ message: 'Access Denied' });

//     try {
//         const verified = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = verified;
//         next();
//     } catch (error) {
//         res.status(400).json({ message: 'Invalid Token' });
//     }
// };

// const isAdmin = (req, res, next) => {
//     if (req.user.role !== 'admin') {
//         return res.status(403).json({ message: 'Forbidden: Admins only' });
//     }
//     next();
// };

// module.exports = { verifyToken, isAdmin };
