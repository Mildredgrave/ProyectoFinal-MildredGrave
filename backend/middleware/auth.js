import { jwtVerify } from 'jose';
import { ObjectId } from 'mongodb';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Verificar que el usuario aún existe
    const user = await req.db.collection('users').findOne({ 
      _id: new ObjectId(payload.userId) 
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid - user not found' });
    }

    req.user = {
      userId: payload.userId,
      role: user.role,
      email: user.email
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export { auth, adminAuth };