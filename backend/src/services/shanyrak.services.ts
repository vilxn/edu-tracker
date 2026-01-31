
import prisma from '../prisma/prisma.client';
import {
    Shanyrak,
    CreateShanyrakDto,
    AddPointsDto,
    UpdateMembersDto
} from '../types/shanyrak';
import {
    ValidationError,
    NotFoundError,
    ConflictError
} from '../utils/errors';

export class ShanyrakService {
    async getAll(): Promise<Shanyrak[]> {
        return prisma.shanyrak.findMany();
    }

    async getLeaderboard(): Promise<Shanyrak[]> {
        return prisma.shanyrak.findMany({
            orderBy: {
                points: 'desc'
            }
        });
    }

    async getById(id: string): Promise<Shanyrak> {
        const shanyrak = await prisma.shanyrak.findUnique({
            where: { id }
        });

        if (!shanyrak) {
            throw new NotFoundError('Шанырак не найден');
        }

        return shanyrak;
    }

    async create(data: CreateShanyrakDto): Promise<Shanyrak> {
        if (!data.name || !data.color) {
            throw new ValidationError('Необходимо указать name и color');
        }

        try {
            return await prisma.shanyrak.create({
                data: {
                    name: data.name.trim(),
                    color: data.color.trim(),
                    points: 0,
                    members: 0
                }
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictError('Шанырак с таким именем уже существует');
            }
            throw error;
        }
    }

    async addPoints(id: string, data: AddPointsDto): Promise<Shanyrak> {
        if (typeof data.points !== 'number' || data.points <= 0) {
            throw new ValidationError('points должен быть положительным числом');
        }

        const shanyrak = await prisma.shanyrak.findUnique({
            where: { id }
        });

        if (!shanyrak) {
            throw new NotFoundError('Шанырак не найден');
        }

        return prisma.shanyrak.update({
            where: { id },
            data: {
                points: shanyrak.points + data.points
            }
        });
    }

    async updateMembers(id: string, data: UpdateMembersDto): Promise<Shanyrak> {
        if (typeof data.delta !== 'number') {
            throw new ValidationError('delta должен быть числом');
        }

        const shanyrak = await prisma.shanyrak.findUnique({
            where: { id }
        });

        if (!shanyrak) {
            throw new NotFoundError('Шанырак не найден');
        }

        const newMembers = shanyrak.members + data.delta;
        if (newMembers < 0) {
            throw new ValidationError('Количество участников не может быть отрицательным');
        }

        return prisma.shanyrak.update({
            where: { id },
            data: {
                members: newMembers
            }
        });
    }

    async recalculateLeaderboard(): Promise<void> {
        const shanyraks = await prisma.shanyrak.findMany();
        const sortedShanyraks = shanyraks.sort((a, b) => b.points - a.points);

        for (let i = 0; i < sortedShanyraks.length; i++) {
            await prisma.shanyrak.update({
                where: { id: sortedShanyraks[i].id },
                data: {}
            });
        }
    }
}