
const express=require('express')
const router=express.Router()
const userController  = require('../controllers/user.controller')
const loginLimiter=require('../middleware/rateLimiter')
const { auth, isAdmin } = require('../middleware/auth')

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Signup a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 */
router.post("/signup", userController?.createUser)

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post("/login",loginLimiter, userController?.loginUser)

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", auth,userController?.logout)
/**
 * @swagger
 * /user/allUser:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get("/allUser",auth, isAdmin, userController?.allUser)
/**
 * @swagger
 * /user/logoutAll:
 *   post:
 *     summary: Logout from all devices
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Logged out from all devices
 */
router.post("/logoutAll", userController?.logout)

// router.get('google',)
module.exports=router