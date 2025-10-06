const express=require('express')
const taskController = require('../controllers/task.controller')
const { auth, isVerified } = require('../middleware/auth')
// const auth =require('../middleware/auth')
const router=express.Router()
console.log(taskController, 'task---------')

/**
 * @swagger
 * tags:
 *   name: Task
 *   description: Task management endpoints
 */

/**
 * @swagger
 * /task/add:
 *   post:
 *     summary: Add a new task
 *     tags: [Task]
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
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/add',isVerified, auth,taskController.createTask )
/**
 * @swagger
 * /task/mytasks:
 *   get:
 *     summary: Get tasks of logged-in user
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's tasks
 *       401:
 *         description: Unauthorized
 */
router.get("/mytasks",isVerified, auth, taskController.getMyTasks);

/**
 * @swagger
 * /task/all:
 *   get:
 *     summary: Get all tasks (admin only or all users)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tasks
 *       401:
 *         description: Unauthorized
 */
router.get("/all", auth, taskController.getAllTasks);

module.exports=router