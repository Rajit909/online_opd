import express from 'express';
import { logOut, signIn, signUp, updateProfile, verifyMobile, verifyOtp } from '../controllers/User.Controller.js';


const router = express.Router();

router.route('/signin').post(signIn);
router.route('/verifymobile').post(verifyMobile);
router.route('/verifyotp').post(verifyOtp);
router.route('/signup').post(signUp)
router.route('/updateprofile').post(updateProfile)
router.route('/logout').post(logOut)

export default router;