// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const protect = (req, res, next) => {
//     let token = req.header('Authorization');
//     if (!token) return res.status(401).json({ success: false, message: 'Access denied' });

//     try {
//         token = token.split(' ')[1]; // Remove "Bearer " prefix
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ success: false, message: 'Invalid token' });
//     }
// };
// //
// module.exports = protect;
