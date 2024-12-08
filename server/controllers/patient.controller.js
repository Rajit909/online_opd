import db from '../config/db.js';

// Get all patients

export const getPatients = (req, res) => {
    db.query('SELECT * FROM  patient', (err, results) => {
        if (err) {
            throw err;
        }
        res.send(results);
    });
};

export const savePatient = (req, res) => {
    const {name, fname, mob, email, aadhar, gender, marital, age, address, city, state} = req.body;
    //get todays date
    const today = new Date();
    const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`; 

    // get now time
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    // check if all fields are filled
    if (!name || !fname || !mob || !email || !aadhar || !gender || !marital || !age || !address || !city || !state) {
        return res.status(400).send({message: 'Please fill all fields'});
    }

    const sql = 'INSERT INTO patient (name, fname, mob, email, aadhar, gender, marital, age, address, city, state, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(sql, [name, fname, mob, email, aadhar, gender, marital, age, address, city, state, date, time ], (err, results) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ message: 'Internal server error.' });
        }
        return res.status(200).json({ message: 'Patient saved successfully!' });
    }
    );
};


