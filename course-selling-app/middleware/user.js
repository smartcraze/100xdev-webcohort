const jwt = require('jsonwebtoken')



function userMiddleware(req, res, next) {
    const { token } = req.headers;
    if (!token) {
        res.json({
            success: false,
            msg: "Token is required"
        })
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
        res.json({
            msg: "You are not SignedIn",

        })
    }
    req.userId = decode.id;
    next();
}


module.exports = {
    userMiddleware
}