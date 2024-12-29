const express = require('express')
const { connectDB } = require('./db/db')
const { userRouter } = require('./routes/user')
const { courseRouter } = require('./routes/course')

const app = express();
connectDB();
console.log('before');

app.use('/api/v1/user', userRouter)
console.log('user');

app.use('/api/v1/course', courseRouter)

console.log('course');





app.listen(3000, () => {
    console.log('Server is Running on Port 3000⚙️  http://localhost:3000 ');

})