const express = require('express')
const { connectDB } = require('./db/db')
const { userRouter } = require('./routes/user')
const { adminRouter } = require('./routes/admin')
const { courseRouter } = require('./routes/course')
require('dotenv').config();

const app = express();
connectDB();
app.use(express.json());
app.use('/api/v1/user', userRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/course', courseRouter)


app.listen(3000, () => {
    console.log('Server is Running on Port 3000⚙️  http://localhost:3000 ');

})