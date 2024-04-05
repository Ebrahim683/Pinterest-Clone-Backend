import bcrypt from "bcryptjs";
import prisma from "../db/db.config.js";

export async function registerUser(req, res) {
    const { name, email, password } = req.body;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const findUser = await prisma.user.findFirst({
        where: {
            email: email,
        },
    });

    if (findUser) {
        res.json({ success: false, status: 400, message: 'Already registered' });
    }
    else {
        const data = await prisma.user.create({
            data: {
                email: email,
                name: name,
                password: encryptedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                profile_pic: true,
                created_at: true,
                updated_at: true,
            }
        });
        res.json({ success: true, status: 200, message: 'User registered successfuly', data: data });
    }
}

export async function loginUser(req, res) {
    const { email, password } = req.body;
    const login = await prisma.user.findFirst({
        where: {
            email: email,
        }
    });

    if (login) {
        const encryptedPassword = login.password
        const matchPassword = await bcrypt.compare(password, encryptedPassword);

        if (matchPassword) {
            const data = await prisma.user.findFirst({
                where: {
                    id: login.id,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profile_pic: true,
                    created_at: true,
                    updated_at: true,
                }
            });
            res.json({ success: true, status: 200, message: 'User login successful', data: data });
        } else {
            res.json({ success: false, status: 401, message: 'Invalide password' });
        }
    } else {
        res.json({ success: false, status: 401, message: 'Unauthorized user' });
    }
}