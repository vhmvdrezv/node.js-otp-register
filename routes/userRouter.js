import express from 'express';
import * as controller from '../controllers/usersController.js';

const router = express.Router();

router.post('/register', controller.registerUserHandler);

router.post('/verify-otp', controller.verifyOTPHandler);

router.post('/resend-otp', controller.resendOTPHandler);


export default router;