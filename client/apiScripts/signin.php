<?php
// Allow cross-origin requests from your app
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

// Include database connection
require 'dbConnect.php';

try {
    // Read and decode the JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    $mobile = $input['mobile'] ?? null;
    $password = $input['password'] ?? null;

    // Validate input
    if (empty($mobile) || empty($password)) {
        http_response_code(400); // Bad Request
        echo json_encode(["success" => false, "message" => "Mobile and password are required"]);
        exit();
    }

    // Check if the user exists
    $stmt = $pdo->prepare("SELECT * FROM users WHERE mobile = :mobile");
    $stmt->execute(['mobile' => $mobile]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404); // Not Found
        echo json_encode(["success" => false, "message" => "User not found"]);
        exit();
    }

    // Verify the password (assuming passwords are hashed using password_hash())
    if (!password_verify($password, $user['password'])) {
        http_response_code(401); // Unauthorized
        echo json_encode(["success" => false, "message" => "Invalid credentials"]);
        exit();
    }
    // Start session if not already started
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Prepare a successful response
    $response = [
        "success" => true,
        "message" => "Login successful",
        "user" => [
            "id" => $user['id'],
            "name" => $user['name'],
            "mobile" => $user['mobile'],
        ],
    ];

    // Store user data in the session
    $_SESSION['user'] = $response['user'];

    // Send a cookie to the client to remember the session
    setcookie('PHPSESSID', session_id(), time() + 3600, '/', '', false, true);

    // Send the JSON response
    echo json_encode($response);
} catch (Exception $e) {
    // Handle server errors
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "An error occurred: " . $e->getMessage()]);
}
?>