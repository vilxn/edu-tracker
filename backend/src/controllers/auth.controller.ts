// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' }),
});
const JWT_SECRET = process.env.JWT_SECRET || 'ec384e3bc93c8695337d99fc029c03e4';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email и пароль обязательны'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Неверный формат email'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'Пароль должен быть не менее 6 символов'
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                error: 'Пользователь с таким email уже существует'
            });
        }

        const user = await prisma.user.create({
            data: {
                email,
                password: password,
                name: name || null,
                verificationToken: Math.random().toString(36).substring(2) +
                    Date.now().toString(36)
            }
        });

        // const token = jwt.sign(
        //     {
        //         userId: user.id,
        //         email: user.email,
        //         role: user.role
        //     },
        //     JWT_SECRET,
        //     { expiresIn: '7d' }
        // );

        // 8. Удаление пароля из ответа
        const userResponse = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt
        };

        // 9. Отправка ответа
        res.status(201).json({
            message: 'Пользователь успешно зарегистрирован',
            user: userResponse,
            token: "tocken"
        });

    } catch (error: any) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({
            error: 'Ошибка сервера при регистрации'
        });
    } finally {
        await prisma.$disconnect();
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. Поиск пользователя
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                error: 'Неверный email или пароль'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Неверный email или пароль'
            });
        }

        // 3. Генерация токена
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 4. Подготовка ответа
        const userResponse = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt
        };

        res.json({
            message: 'Вход выполнен успешно',
            user: userResponse,
            token: token
        });

    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({
            error: 'Ошибка сервера при входе'
        });
    } finally {
        await prisma.$disconnect();
    }
};