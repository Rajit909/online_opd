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

if (empty($mobile)) {
    http_response_code(400);
    echo json_encode(["error" => "Mobile number is required"]);
    exit();
}

try {
    // Check if the user already exists in the database
    $stmt = $pdo->prepare("SELECT * FROM users WHERE mobile = :mobile");
    $stmt->execute(['mobile' => $mobile]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Mobile number exists, return an error
        http_response_code(400);
        echo json_encode(["error" => "Mobile number already exists"]);
        exit();
    } else {
        // Mobile number does not exist, generate OTP
        $otp = rand(1000, 9999);
        $expiry_time = date("Y-m-d H:i:s", strtotime("+10 minutes"));

        // Store OTP in the database
        $stmt = $pdo->prepare("INSERT INTO otp_verification (mobile, otp, expiry_time) VALUES (:mobile, :otp, :expiry_time)");

        $stmt->execute([
            'mobile' => $mobile,
            'otp' => $otp,
            'expiry_time' => $expiry_time
        ]);

        // Send OTP (in a real-world scenario, this would be sent via SMS)
        


        http_response_code(200);
        echo json_encode(["message" => "OTP sent successfully", "otp" => $otp]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "An error occurred: " . $e->getMessage()]);
}
?>