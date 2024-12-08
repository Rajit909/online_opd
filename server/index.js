import express from 'express';
import cookieParser from 'cookie-parser';
const app = express();

// routes
import userRoutes from './routes/user.route.js';
import patientRoutes from './routes/patient.route.js';
import appointmentRoutes from './routes/appointment.route.js';
import doctorRoutes from './routes/doctors.route.js';
import cors from 'cors';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));   // Parse URL-encoded bodies
app.use(cookieParser());    // Parse cookie bodies

// handle cors
const corsOptions = {
    origin:'http://localhost:8081',
    credentials:true
}

app.use(cors(corsOptions));


// user routes

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/appointment', appointmentRoutes);
app.use('/api/v1/doctors', doctorRoutes);



app.get('/', (req, res) => {   
    res.send('Hello World!');
});

export default app;