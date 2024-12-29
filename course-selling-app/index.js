const express = require('express')


const app = express();

// signup
app.post('/user/signup', async function (req, res) {
    res.json({
        msg: "user signup"
    })
})
// sign in 
app.post('/user/signin', async function (req, res) {
    res.json({
        msg: "user signin"
    })
})

//  when user is purchasing the course
app.post('/course/purchase', async function (req, res) {
    // user should pay for purchase courses
    res.json({
        msg: "user purchasing course"
    })
})

// to get all the user purchased course
app.get('/user/purchase', async function (req, res) {
    res.json({
        msg: "user course"
    })
})

//to get all the course availabel
app.get('/course', async function (req, res) {
    res.json({
        msg: "all the course"
    })
})





app.listen(3000, () => {
    console.log('Server is Running on Port 3000 ⚙️ http://localhost:3000 ');

})