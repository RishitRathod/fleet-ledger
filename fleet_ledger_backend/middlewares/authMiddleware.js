// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// module.exports = async (req, res, next) => {
//     const token = req.header('Authorization');
//     if (!token) return res.status(401).json({ error: 'Access denied' });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id);
//         if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

//         req.user = user;  // Attach user to request
//         next();
//     } catch (err) {
//         res.status(400).json({ error: 'Invalid token' });
//     }
// };
