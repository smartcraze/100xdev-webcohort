const jwt = require('jsonwebtoken');
const JWT_SECRET = "heythisismysecret";

function auth(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'Token is required'
        });
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid token'
            });
        }
        req.userId = decoded.id;
        next();
    });
}

module.exports = { auth, JWT_SECRET };
