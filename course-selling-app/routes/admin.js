const { Router } = require('express')
const { adminModel, courseModel } = require('../models/schema')
const bcrypt = require('bcrypt')
const { z } = require('zod')
const jwt = require('jsonwebtoken');
const { adminMiddleware } = require('../middleware/admin');

const adminRouter = Router();
// adminRouter.use(adminMiddleware)

adminRouter.post('/signup', async function (req, res) {
    const adminschema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
        firstName: z.string(),
        lastName: z.string(),
    });

    const validationResult = adminschema.safeParse(req.body);
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

        const admin = await adminModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        return res.status(201).json({
            success: true,
            message: "You are signed-up",
            AdminDetail: admin,
        });
    } catch (error) {
        console.error("Signup error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
})

adminRouter.post('/signin', async function (req, res) {
    const adminschema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    });

    const validationResult = adminschema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validationResult.error.errors,
        });
    }

    const { email, password } = validationResult.data;
    try {
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const isvalidPassword = await bcrypt.compare(password, admin.password);
        if (!isvalidPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        // sign the jwt
        const token = jwt.sign({
            id: admin._id
        }, process.env.JWT_ADMIN_SECRET)

        res.status(200).json({
            success: true,
            message: "Sign-in successful",
            token: token,
            AdminDetails: {
                email: admin.email,
                firstName: admin.firstName,
                lastName: admin.lastName,
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

adminRouter.post('/course', adminMiddleware, async function (req, res) {
    const creatorId = req.userId;
    const courseSchema = z.object({
        title: z.string(),
        description: z.string(),
        price: z.number(),
        imageUrl: z.string()
    });
    const isvalideResult = courseSchema.safeParse(req.body);
    if (!isvalideResult.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validationResult.error.errors,
        });
    }
    const { title, description, price, imageUrl } = isvalideResult.data;
    try {
        const course = await courseModel.create({
            title,
            description,
            price,
            imageUrl,
            creatorId: creatorId
        })

        res.json({
            success: true,
            message: "course created successfully",
            courseId: course._id,
            course: course
        })
    } catch (error) {
        return res.status(400).json({
            Message: "Error While creating course",
            Error: error
        })
    }

})
adminRouter.put('/course', async function (req, res) {
    res.json({
        msg: "user purchasing course"
    })
})
adminRouter.get('/course/bulk', async function (req, res) {
    res.json({
        msg: "user purchasing course"
    })
})


module.exports = { adminRouter }