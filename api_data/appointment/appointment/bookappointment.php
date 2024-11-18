<?php
header("Access-Control-Allow-Origin: *"); // Allow all origins or set a specific one
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Add Authorization if you're using JWT or token-based authentication
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");


// Handle OPTIONS Preflight Requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'dbConnect.php';

// Capture and decode the input
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Validate the input data
    $doctor = $data['doctor'] ?? '';
    $department = $data['department'] ?? '';
    $appointment_date = $data['appointment_date'] ?? '';
    $appointment_time = $data['appointment_time'] ?? '';
    $patient_name	 = $data['patient_name'] ?? '';
    $patient_age = $data['patient_age'] ?? '';
    $gender = $data['gender'] ?? '';

    if (!$doctor || !$department || !$appointment_date || !$appointment_time || !$patient_name || !$patient_age || !$gender) {
        echo json_encode(["success" => false, "message" => "All fields are required."]);
        exit();
    }

    try {
        // Prepare and execute the SQL statement
        $stmt = $pdo->prepare("INSERT INTO appointments (doctor, department, appointment_date, appointment_time, patient_name, patient_age, gender) 
                               VALUES (:doctor, :department, :appointment_date, :appointment_time, :patient_name, :patient_age, :gender)");
        $stmt->execute([
            'doctor' => $doctor,
            'department' => $department,
            'appointment_date' => $appointment_date,
            'appointment_time' => $appointment_time,
            'patient_name' => $patient_name,
            'patient_age' => $patient_age,
            'gender' => $gender
        ]);
        
        echo json_encode(["success" => true, "message" => "Appointment booked successfully."]);
    } catch (PDOException $e) {
        // Log the exception message (in real use, you might want to log this to a file)
        error_log($e->getMessage());
        
        // Send a user-friendly error message
        echo json_encode(["success" => false, "message" => "Appointment booking failed. Please try again later."]);
    }
    
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>