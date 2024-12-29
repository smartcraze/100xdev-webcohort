const { Router } = require('express')
const courseRouter = Router();


courseRouter.post('/purchase', async function (req, res) {
    res.json({
        msg: "user purchasing course"
    })
})


courseRouter.get('/', async function (req, res) {
    res.json({
        msg: "all the course"
    })
})
