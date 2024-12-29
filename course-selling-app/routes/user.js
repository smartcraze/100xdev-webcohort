const { Router } = require('express')
const userRouter = Router();


userRouter.post('/signup', async function (req, res) {
    res.json({
        msg: "user signup"
    })
})

userRouter.post('/signin', async function (req, res) {
    res.json({
        msg: "user signin"
    })
})


userRouter.get('/purchase', async function (req, res) {
    res.json({
        msg: "user course"
    })
})



module.exports = { userRouter }