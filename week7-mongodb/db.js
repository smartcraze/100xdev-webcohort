const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config();

const User = new Schema({
    email: { type: String, unique: true },
    password: String,
    name: String,
});

const Todo = new Schema({
    userId: Schema.Types.ObjectId,
    title: String,
    done: Boolean,
});

const UserModel = mongoose.model('users', User);
const TodoModel = mongoose.model('todos', Todo);



async function dbconnects() {
    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
    console.log
    console.log("db connected ⚙️");
}


module.exports = {
    UserModel,
    TodoModel,
    dbconnects
};