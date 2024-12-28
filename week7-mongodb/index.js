const express = require('express')
const jwt = require('jsonwebtoken')
const { TodoModel, UserModel, dbconnects } = require('./db')
const { JWT_SECRET, auth } = require('./auth')
const app = express()


app.use(express.json())


dbconnects();


// all endpoints

app.post('/signup', async function (req, res) {
    const { email, password, name } = req.body;
    if (!name || !email || !password) {
        return res.json({
            success: false,
            message: 'All fields are required'
        })
    }
    await UserModel.create({
        email: email,
        password: password,
        name: name
    })

    res.json({
        success: true,
        message: 'User created successfully'
    })


})
console.log('signup done');

app.post('/signin', async function (req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({
            success: false,
            message: 'All fields are required'
        })
    }
    const user = await UserModel.findOne({
        email: email,
        password: password
    })
    console.log(user);

    if (!user) {
        return res.status(403).json({
            success: false,
            message: 'Invalid credentials'
        })
    } else {
        const token = jwt.sign({
            id: user._id,
        }, JWT_SECRET)

        return res.json({
            success: true,
            message: 'Signin successful',
            token: token
        })
    }

});
console.log('signin  done');


app.post('/todo', auth, async function (req, res) {
    const { title } = req.body;
    const userId = req.userId;
    if (!title) {
        return res.json({
            success: false,
            message: 'All fields are required'
        })
    }
    await TodoModel.create({
        userId: userId,
        title: title,
        done: false
    })
    res.json({
        success: true,
        message: 'Todo created successfully'
    })

})

console.log('todo done');


app.get('/todo', auth, async function (req, res) {
    const userId = req.userId;
    const todos = await TodoModel.find({
        userId: userId
    })
    res.json({
        success: true,
        todos: todos
    })
})

console.log('requireding todo done');

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})