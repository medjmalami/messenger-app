import express from 'express';
import forgotPass from '../controllers/pass.controller/forgotPass';
import resetPass from '../controllers/pass.controller/resetPass';
const router = express.Router();

router.post('/forgot-password', forgotPass);
router.post('/reset-password/:token', resetPass);

export default router;