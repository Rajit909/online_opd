<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
include 'dbConnect.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $mobile = $_POST['mobile'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT); //hash the password

    // check if all fields are provided
    if (empty($password)) {
        http_response_code(400);
        echo json_encode(["error" => "Password are required"]);
        exit();
    }

    try {
        $stmt = $pdo->prepare("UPDATE users SET password = :password WHERE mobile = :mobile");

        $stmt->execute(['password' => $password, 'mobile' => $mobile]);

        echo json_encode(['success' => true, 'message' => 'Password updated successfully']);

    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Password updation failed'] . $e->getMessage());
    }
}
