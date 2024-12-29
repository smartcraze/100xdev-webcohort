const express = require('express')
const { connectDB } = require('./db/db')
const { userRouter } = require('./routes/user')
const { courseRouter } = require('./routes/course')

const app = express();
connectDB();

app.use('/user', userRouter)
app.use('/course', courseRouter)






app.listen(3000, () => {
    console.log('Server is Running on Port 3000⚙️  http://localhost:3000 ');

})