import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();
const taskController = new TaskController();

router.use(protect); // Lock down all task routes

router.post('/', taskController.create);
router.get('/', taskController.getAll);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.delete);

export default router;