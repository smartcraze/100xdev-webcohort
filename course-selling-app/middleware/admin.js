const jwt = require('jsonwebtoken')


function adminMiddleware(req, res, next) {
    const { token } = req.headers;
    if (!token) {
        res.json({
            success: false,
            msg: "Token is required"
        })
    }
    jwt.verify(token, process.env.JWT_ADMIN_SECRET, (err, decode) => {
        if (err) {
            res.json({
                success: false,
                msg: "You are Not SignedIn"
            })
        }
        req.userId = decode.id
        next();

    })

}

module.exports = { adminMiddleware };