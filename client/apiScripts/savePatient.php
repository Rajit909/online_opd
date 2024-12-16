<?php
header("Access-Control-Allow-Origin: *"); // Adjust origin as needed
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle OPTIONS Preflight Requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'dbConnect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if content type is JSON
    if (stripos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
        $input = json_decode(file_get_contents("php://input"), true);
    } else {
        $input = $_POST; // Fallback for form-encoded data
    }

    // Collect input data
    $name = $input['name'] ?? null;
    $fname = $input['fname'] ?? null;
    $mob = $input['mob'] ?? null;
    $email = $input['email'] ?? null;
    $aadhar = $input['aadhar'] ?? null;
    $gender = $input['gender'] ?? null;
    $marital = $input['marital'] ?? null;
    $age = $input['age'] ?? null;
    $address = $input['address'] ?? null;
    $city = $input['city'] ?? null;
    $state = $input['state'] ?? null;

    $date = date('Y-m-d');
    $time = date('H:i:s');

    // Validate inputs
    if (
        empty($name) || empty($fname) || empty($mob) || empty($email) || empty($aadhar) ||
        empty($gender) || empty($marital) || empty($age) || empty($address) ||
        empty($city) || empty($state)
    ) {
        http_response_code(400);
        echo json_encode(["error" => "All fields are required."]);
        exit();
    }

    // Additional validation (e.g., email format, phone length) can go here.
       // if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    //     http_response_code(400);
    //     echo json_encode(["error" => "Invalid email format."]);
    //     exit();
    // }

    // if (!is_numeric($mob) || strlen($mob) != 10) {
    //     http_response_code(400);
    //     echo json_encode(["error" => "Invalid mobile number. Must be 10 digits."]);
    //     exit();
    // }

    // if (!is_numeric($aadhar) || strlen($aadhar) != 12) {
    //     http_response_code(400);
    //     echo json_encode(["error" => "Invalid Aadhar number. Must be 12 digits."]);
    //     exit();
    // }
    
    // Insert data into database
    try {
        $stmt = $pdo->prepare("INSERT INTO patient 
            (name, fname, mob, email, aadhar, gender, marital, age, address, city, state, date, time) 
            VALUES (:name, :fname, :mob, :email, :aadhar, :gender, :marital, :age, :address, :city, :state, :date, :time)");
        
        $stmt->execute([
            'name' => $name,
            'fname' => $fname,
            'mob' => $mob,
            'email' => $email,
            'aadhar' => $aadhar,
            'gender' => $gender,
            'marital' => $marital,
            'age' => $age,
            'address' => $address,
            'city' => $city,
            'state' => $state,
            'date' => $date,
            'time' => $time
        ]);

        echo json_encode(['success' => true, 'message' => 'User created successfully.']);
    } catch (PDOException $e) {
        error_log("Database Error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'User creation failed. Please try again later.']);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Invalid request method.']);
}


 