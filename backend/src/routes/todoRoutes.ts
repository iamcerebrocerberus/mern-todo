import { Router } from 'express';
import todoController from '../controllers/todoController';
import { authenticateToken } from '../middleware/auth';
import { validateCreateTodo, validateUpdateTodo } from '../middleware/todoValidation';

const router: Router = Router();

router.use(authenticateToken);

/**
 * @swagger
 * /todos/stats:
 *   get:
 *     tags:
 *       - Todos
 *     summary: Get todo statistics
 *     description: Get completion statistics for user's todos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     completed:
 *                       type: integer
 *                     pending:
 *                       type: integer
 *                     completionRate:
 *                       type: integer
 */
// GET /api/todos/stats - Must come before /:id route
router.get('/stats', todoController.getTodoStats);

/**
 * @swagger
 * /todos:
 *   get:
 *     tags:
 *       - Todos
 *     summary: Get user's todos
 *     description: Retrieve paginated list of todos for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of todos per page
 *     responses:
 *       200:
 *         description: Todos retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TodoListResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /api/todos
router.get('/', todoController.getTodos);

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     tags:
 *       - Todos
 *     summary: Get todo by ID
 *     description: Retrieve a specific todo by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TodoResponse'
 *       404:
 *         description: Todo not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /api/todos/:id
router.get('/:id', todoController.getTodoById);

/**
 * @swagger
 * /todos:
 *   post:
 *     tags:
 *       - Todos
 *     summary: Create a new todo
 *     description: Create a new todo for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: Learn TypeScript
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 example: Complete the TypeScript tutorial and build a project
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TodoResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /api/todos
router.post(
  '/',
  validateCreateTodo,
  todoController.createTodo
);

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     tags:
 *       - Todos
 *     summary: Update a todo
 *     description: Update an existing todo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               completed:
 *                 type: boolean
 *             example:
 *               completed: true
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TodoResponse'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Todo not found
 */
// PUT /api/todos/:id
router.put(
  '/:id',
  validateUpdateTodo,
  todoController.updateTodo
);

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     tags:
 *       - Todos
 *     summary: Delete a todo
 *     description: Delete an existing todo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Todo not found
 */
// DELETE /api/todos/:id
router.delete('/:id', todoController.deleteTodo);

export default router;