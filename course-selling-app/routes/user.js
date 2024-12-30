const { Router } = require('express')
const { userModel } = require('../models/schema')
const userRouter = Router();
const bcrypt = require('bcrypt')
const { z } = require('zod')
const jwt = require('jsonwebtoken');

userRouter.post('/signup', async function (req, res) {
    const userschema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
        firstName: z.string(),
        lastName: z.string(),
    });

    const validationResult = userschema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validationResult.error.errors,
        });
    }

    const { email, password, firstName, lastName } = validationResult.data;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        return res.status(201).json({
            success: true,
            message: "You are signed-up",
            userDetail: user,
        });
    } catch (error) {
        console.error("Signup error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
});


userRouter.post('/signin', async function (req, res) {
    const userschema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    });

    const validationResult = userschema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validationResult.error.errors,
        });
    }

    const { email, password } = validationResult.data;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const isvalidPassword = await bcrypt.compare(password, user.password);
        if (!isvalidPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        // sign the jwt
        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET)

        res.status(200).json({
            success: true,
            message: "Sign-in successful",
            token: token,
            userDetails: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });

    } catch (error) {
        console.error("Sign-in error:", error.message);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }

})


userRouter.get('/purchase', async function (req, res) {
    res.json({
        msg: "user course"
    })
})



module.exports = { userRouter }