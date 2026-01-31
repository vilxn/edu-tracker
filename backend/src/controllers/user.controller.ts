import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' }),
});

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, role } = req.body;

        const user = await prisma.user.create({
            data: { name, email, role }
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
};

export const getUsers = async (_req: Request, res: Response) => {
    res.json({
        message: "Hello World!"
    })
};

export const getUserById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    await prisma.user.delete({
        where: { id }
    });

    res.json({ message: "User deleted" });
};