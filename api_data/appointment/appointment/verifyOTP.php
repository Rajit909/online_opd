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
$mobile = $input['mobile'] ?? '';
$otp = $input['otp'] ?? '';

//check if otp is empty 
if (empty($otp)) {
    http_response_code(400);
    echo json_encode(["error" => "OTP are required"]);
    exit();
}

try {
    // Check if the OTP is valid and has not expired
    $stmt = $pdo->prepare("SELECT * FROM otp_verification WHERE mobile = :mobile ORDER BY created_at DESC LIMIT 1");
    
    $stmt->execute(['mobile' => $mobile]);
    
    // fetch the otp from the database
    $otpRecord = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$otpRecord) {
        http_response_code(404);
        echo json_encode(["error" => "Otp not found"]);
        exit();
    }

    // Check if the OTP is expired
    $current_time = date("Y-m-d H:i:s");
    if ($current_time > $otpRecord['expiry_time']) {
        http_response_code(400);
        echo json_encode(["error" => "OTP has expired"]);
        exit();
    }

    // Verify OTP
    if ($otp !== $otpRecord['otp']) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid OTP"]);
        exit();
    }

    // OTP verified, now proceed to registration
    http_response_code(200);
    echo json_encode(["message" => "OTP verified successfully"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "An error occurred: " . $e->getMessage()]);
}
?>
