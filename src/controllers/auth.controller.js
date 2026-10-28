const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');

const register = async (req, res) => {
    try {
        const { username, fullname, password } = req.body;

        if (
            typeof username !== 'string' ||
            typeof fullname !== 'string' ||
            typeof password !== 'string' ||
            !username.trim() ||
            !fullname.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: 'Vui long nhap day du thong tin'
            });
        }

        if (username.length > 50 || fullname.length > 100) {
            return res.status(400).json({
                message: 'Username hoac fullname qua dai'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Mat khau phai co it nhat 6 ky tu'
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Username da ton tai'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                fullname,
                password: hashedPassword,
                roleid: 1,
                mid: 1
            },
            select: {
                uid: true,
                username: true,
                fullname: true,
                role: {
                    select: { rolename: true }
                },
                membership: {
                    select: {
                        mname: true,
                        score: true
                    }
                }
            }
        });

        return res.status(201).json({
            message: 'Dang ky thanh cong',
            user
        });

    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({
                message: 'Username da ton tai'
            });
        }

        console.error(error);
        return res.status(500).json({
            message: 'Loi server'
        });
    }
};


const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (
            typeof username !== 'string' ||
            typeof password !== 'string' ||
            !username.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: 'Vui long nhap username va password'
            });
        }

        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return res.status(401).json({
                message: 'Sai username hoac password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Sai username hoac password'
            });
        }

        const token = jwt.sign(
            {
                uid: user.uid,
                roleid: user.roleid
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '1d'
            }
        );

        return res.status(200).json({
            message: 'Dang nhap thanh cong',
            token,
            user: {
                uid: user.uid,
                username: user.username,
                fullname: user.fullname,
                roleid: user.roleid
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Loi server'
        });
    }
};

module.exports = { register, login };