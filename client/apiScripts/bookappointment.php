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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (stripos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
        $input = json_decode(file_get_contents("php://input"), true);
    } else {
        $input = $_POST; // Fallback for form-encoded input
    }
    // Validate the input input
    $drname = $input['drname'] ?? '';
    $dept = $input['dept'] ?? '';
    $ap_date = $input['ap_date'] ?? '';
    $ap_time = $input['ap_time'] ?? '';
    $entby = $input['entby'] ?? '';
    $entdate = date('Y-m-d');
    $enttime = date('H:i:s');
    $entdatetime = $entdate . ' ' . $enttime;
    $type = "Patient";
    $opd_status = "Pending";
 
    if (empty($drname) || empty($dept) || empty($ap_date) || empty($ap_time) || empty($entby) || empty($entdate) || empty($enttime) || empty($entdatetime) || empty($type) || empty($opd_status)) {
        echo json_encode(["success" => false, "message" => "All fields are required."]);
        exit();
    }

    try {
        // Prepare and execute the SQL statement
        $stmt = $pdo->prepare("INSERT INTO appointment (drname, dept, ap_date, ap_time, entby, entdate, enttime, entdatetime, type, opd_status) VALUES (:drname, :dept, :ap_date, :ap_time, :entby, :entdate, :enttime, :entdatetime, :type, :opd_status)");
        $stmt->execute([
            'drname' => $drname,
            'dept' => $dept,
            'ap_date' => $ap_date,
            'ap_time' => $ap_time,
            'entby' => $entby,
            'entdate' => $entdate,
            'enttime' => $enttime,
            'entdatetime' => $entdatetime,
            'type' => $type,
            'opd_status' => $opd_status
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