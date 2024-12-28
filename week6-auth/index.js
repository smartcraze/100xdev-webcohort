const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const app = express();

app.use(express.json());

const jwt_secret = 'Surajvishwakarmaop';
const users = [];

function auth(req, res, next) {
    const { username } = req.body;
    const foundUser = users.find((u) => u.username === username);
    if (foundUser) {
        return res.status(400).json({
            msg: "You are already signed up, please go to sign-in route"
        });
    }
    next();
}

app.post('/signup', auth, async function (req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ msg: "Username and password are required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).json({ msg: "You are signed-up!" });
    console.log(users);
});

app.post('/signin', async function (req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ msg: "Username and password are required" });
    }
    const foundUser = users.find((u) => u.username === username);
    if (!foundUser) {
        return res.status(401).json({ message: "Wrong credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Wrong credentials" });
    }
    const token = jwt.sign({ username }, jwt_secret, { expiresIn: '1h' });
    res.json({ token });
    console.log(users);
});

app.get('/me', function (req, res) {
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ message: "Token is required" });
    }
    try {
        const decodedData = jwt.verify(token, jwt_secret);
        res.json({ username: decodedData.username });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
    console.log(users);
});

app.listen(3000, () => {
    console.log(`Server Running on http://localhost:3000`);
});