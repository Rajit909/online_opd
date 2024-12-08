import express from 'express';
import { getCities, getDoctors, getDoctorSchedule } from '../controllers/doctors.controller.js';

const router = express.Router();

router.route('/getdoctors').get(getDoctors);
router.route('/getschedule').get(getDoctorSchedule);
router.route('/getcities').get(getCities);


export default router;