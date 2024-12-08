import express from 'express';
import { bookAppointment, getAllAppointments } from '../controllers/appointment.controller.js';


const router = express.Router();

router.route("/getappointments").get(getAllAppointments)
router.route("/bookappointment").post(bookAppointment)


export default router;