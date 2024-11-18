<?php
// Allow cross-origin requests from your app
header("Access-Control-Allow-Origin: http://localhost:8081"); // Adjust origin as needed
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle OPTIONS Preflight Requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// // Start session if not already started
// if (session_status() === PHP_SESSION_NONE) {
//     session_start();
// }

// Destroy the session
if (isset($_SESSION)) {
    session_unset();  // Unset all session variables
    session_destroy(); // Destroy the session
    setcookie(session_name(), '', time() - 3600, '/'); // Clear session cookie
}

// Send a successful logout response
http_response_code(200); // OK
echo json_encode(["success" => true, "message" => "Logout successful"]);