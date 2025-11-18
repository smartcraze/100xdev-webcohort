import express, { type NextFunction, type Request, type Response } from 'express'
import mongoose from 'mongoose'
import User from './user'
import session from "express-session";

import MongoStore from "connect-mongo";

const app = express()


const DB_URL = 'mongodb://localhost:27017/sessionclass'



async function connectToDatabase() {
    try {
        await mongoose.connect(DB_URL);
        console.log("Connected to the database");
    } catch (error) {
        console.log(error);
    }
}

connectToDatabase();



app.use(express.json())
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: DB_URL,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 , // 1 minute
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
    },
  })
);
  


app.get('/', (req, res) => {
    res.sendFile( __dirname + '/index.html')    
})






app.post('/register', async (req, res) => {
    const { name, email, password } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).send('User already exists')
        }
        const newUser = new User({ name, email, password })
        await newUser.save()
        res.status(201).send('User registered successfully')
    } catch (error) {
        res.status(400).send('Error registering user')
    }
})


app.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).send('User not found')
        }
        if (user.password !== password) {
            return res.status(400).send('Invalid password')
        }


        
        req.session.userId = user._id.toString();

        res.status(200).json({ message: "Logged in", session: req.sessionID });


    } catch (error) {
        res.status(400).send('Error logging in')
    }
})


function auth(req:Request, res : Response, next:NextFunction) {

  if (!req.session.userId) {
    return res.status(401).send("Not authenticated");
  }
  next();
}
  

app.get("/profile", auth, async (req, res) => {

  const user = await User.findById(req.session.userId);
  res.json(user);
});


app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.send("Logged out");
  });
});
  


app.get('/check', (req, res) => {
    if (req.session.userId) {
      res.json({
        session: req.session,
      })
    } else {
      res.send('User is not logged in');
    }
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})


