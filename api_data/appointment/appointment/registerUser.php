<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require 'dbConnect.php'; // Your DB connection file

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
$input = json_decode(file_get_contents('php://input'), true);
$firstname = $input['firstname'] ?? '';
$lastname = $input['lastname'] ?? '';
$mobile = $input['mobile'] ?? '';
$password = $input['password'] ?? ''; // Should be hashed before storing

if (empty($mobile) || empty($firstname) || empty($lastname) || empty($password)) {
    http_response_code(400);
    echo json_encode(["error" => "All fields are required"]);
    exit();
}

try {
    // Check if the mobile number is already registered
    $stmt = $pdo->prepare("SELECT * FROM users WHERE mobile = :mobile");
    $stmt->execute(['mobile' => $mobile]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        http_response_code(400);
        echo json_encode(["error" => "User with this mobile number already exists"]);
        exit();
    }

    // Hash the password before storing
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Insert the new user into the database
    $stmt = $pdo->prepare("INSERT INTO users (firstname, lastname, mobile, password) VALUES (:firstname, :lastname, :mobile, :password)");
    $stmt->execute([
        'firstname' => $firstname,
        'lastname' => $lastname,
        'mobile' => $mobile,
        'password' => $hashedPassword
    ]);

    http_response_code(200);
    echo json_encode(["message" => "User registered successfully"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "An error occurred: " . $e->getMessage()]);
}
?>
