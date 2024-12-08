import express from 'express';
import { getPatients, savePatient } from '../controllers/patient.controller.js';


const router = express.Router();
router.route('/getallpatients').get(getPatients);
router.route('/savepatient').post(savePatient);

export default router;