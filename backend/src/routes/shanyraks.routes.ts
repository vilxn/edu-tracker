// routes/shanyraks.routes.ts
import { Router } from 'express';
import { ShanyrakController } from '../controllers/shanyraks.controller';

const router = Router();
const controller = new ShanyrakController();

router.get('/', controller.getAll.bind(controller));
router.get('/leaderboard', controller.getLeaderboard.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/', controller.create.bind(controller));
router.post('/:id/add-points', controller.addPoints.bind(controller));
router.post('/:id/members', controller.updateMembers.bind(controller));
router.post('/leaderboard/recalculate', controller.recalculateLeaderboard.bind(controller));

export default router;