import db from '../config/db.js'

// Get all appointments

export const getAllAppointments = async (req, res) => {
    try {
        db.query('SELECT * FROM appointment', (err, results) => {
            if (err) {
                throw err;
            }
            res.send(results);
        });
    } catch (error) {
        console.log(error);
    }
}

export const bookAppointment = async (req, res) => {
    try {
        const {
            drname,
            dept,
            ap_date,
            ap_time,
            entby,
        } = req.body;

        const today = new Date();
        const entdate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`; 
    
        const enttime = new Date().toLocaleTimeString()

        const entdatetime = entdate + ' ' + enttime;
        const type = 'Patient';
        const opd_status = 'Pending';

        // check all fields are entered
        if (!drname || !dept || !ap_date || !ap_time || !entby) {
            return res.status(400).send('Please enter all fields');
        }

        db.query('INSERT INTO appointment SET ?', {
            drname: drname,
            dept: dept,
            ap_date: ap_date,
            ap_time: ap_time,
            entby: entby,
            entdate: entdate,
            enttime: enttime,
            entdatetime: entdatetime,
            type: type,
            opd_status: opd_status
        }, (err, results) => {
            if (err) {
                throw err;
            }
            res.send('Appointment booked successfully');
        });

    } catch (error) {
        console.log(error);
    }
}

