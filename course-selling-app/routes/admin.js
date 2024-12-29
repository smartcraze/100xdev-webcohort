const { Router } = require('express')
const adminRouter = Router();

// adminRouter.use(adminMiddleware)

adminRouter.post('/signup', async function (req, res) {
    res.json({
        msg: "user purchasing course"
    })
})

adminRouter.post('/signin', async function (req, res) {
    res.json({
        msg: "user purchasing course"
    })
})

adminRouter.post('/course', async function (req, res) {
    res.json({
        msg: "user purchasing course"
    })
})
adminRouter.put('/course', async function (req, res) {
    res.json({
        msg: "user purchasing course"
    })
})
adminRouter.get('/course/bulk', async function (req, res) {
    res.json({
        msg: "user purchasing course"
    })
})


module.exports = { adminRouter }