const jwt =require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    // Get token from request headers
    const token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Check if token is present
   
  
    // Verify token
    jwt.verify(token.split(' ')[1],secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      // If token is valid, save decoded user information to request object
      
      next(); // Proceed to the next middleware
    });
  };