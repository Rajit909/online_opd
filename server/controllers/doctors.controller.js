import db from "../config/db.js"

// Get all doctors

export const getDoctors = async (req, res) => {
    try {
        db.query('SELECT * FROM  doctor', (err, results) => {
            if (err) {
                throw err;
            }
            res.send(results);
        });
    } catch (err) {
        console.log(err);
    }
}

// get doctors schedule schedule_dr 	2024-03-26

export const getDoctorSchedule = async (req, res) => {
    try {
        db.query('SELECT * FROM  schedule_dr ', (err, results) => {
            if (err) {
                throw err;
            }
            res.send(results);
        });
    } catch (err) {
        console.log(err);
    }
}

// get all cities allcity
export const getCities = async (req, res) => {
    db.query('SELECT * FROM  allcity', (err, results) => {
        if (err) {
            throw err;
        }
        res.send(results);
    });
}