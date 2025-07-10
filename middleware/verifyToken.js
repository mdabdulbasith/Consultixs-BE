import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'consultixs-secret';
    console.log('Verifying token with secret:', secret);

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('JWT verification failed:', err.message);
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

export default verifyToken;
