
import { Request, Response } from 'express';
import { ShanyrakService } from '../services/shanyraks.service';
import { AppError } from '../utils/errors';

const shanyrakService = new ShanyrakService();

export class ShanyrakController {
    async getAll(req: Request, res: Response) {
        try {
            const shanyraks = await shanyrakService.getAll();
            res.json(shanyraks);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async getLeaderboard(req: Request, res: Response) {
        try {
            const leaderboard = await shanyrakService.getLeaderboard();
            res.json(leaderboard);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const shanyrak = await shanyrakService.getById(id);
            res.json(shanyrak);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async create(req: Request, res: Response) {
        try {
            const shanyrak = await shanyrakService.create(req.body);
            res.status(201).json(shanyrak);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async addPoints(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const shanyrak = await shanyrakService.addPoints(id, req.body);
            res.json(shanyrak);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async updateMembers(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const shanyrak = await shanyrakService.updateMembers(id, req.body);
            res.json(shanyrak);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async recalculateLeaderboard(req: Request, res: Response) {
        try {
            await shanyrakService.recalculateLeaderboard();
            res.status(204).send();
        } catch (error) {
            this.handleError(error, res);
        }
    }

    private handleError(error: any, res: Response) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
}