const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Chef = require('../models/Chef');

// Generic Role-Based Middleware
exports.protect = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "Not authorized" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ msg: "Access denied" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ msg: "Invalid token" });
    }
  };
};

// Admin Role Only
// exports.verifyAdmin = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') {
//     next();
//   } else {
//     return res.status(403).json({ message: 'Access denied: Admins only' });
//   }
// };

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ msg: 'Unauthorized: Token missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: Not admin' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ msg: 'Invalid token' });
  }
};

// Protect User Route
exports.protectUser = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log("Token received (User):", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { _id: decoded.id, role: decoded.role };

      next();
    } catch (error) {
      console.error("JWT ERROR (User):", error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

//rotect Chef Route
exports.protectChef = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const chef = await Chef.findById(decoded.id).select('-password');
      if (!chef) {
        return res.status(401).json({ message: 'Chef not found' });
      }

      req.user = chef;
      next();
    } catch (error) {
      console.error('JWT Error (Chef):', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};



// Verify Chef (only ID & role)
const verifyChef = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
    

  try {
    console.log("JWT_SECRET in verifyChef:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    if (decoded.role !== 'chef') {
      return res.status(403).json({ msg: 'Access denied: Not a chef' });
    }

    const chef = await Chef.findById(decoded.id);
    if (!chef) {
      return res.status(404).json({ msg: 'Chef not found' });
    }

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ msg: 'Invalid token' });
  }
};

// Verify Token and Role = Admin in one go
exports.protectAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ msg: "No token, access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ msg: "Access denied: Not an admin" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};


module.exports = {
  protect: exports.protect,
  verifyAdmin: exports.verifyAdmin,
  protectUser: exports.protectUser,
  protectChef: exports.protectChef,
  verifyChef: verifyChef,
  protectAdmin:exports.protectAdmin,
  verifyAdmin:verifyAdmin,
};
