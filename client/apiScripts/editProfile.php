<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
include 'dbConnect.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $firstname = $_POST['firstname'];
    $lastname = $_POST['lastname'];
    $mobile = $_POST['mobile'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT); // Hash the password

    if (empty($firstname) || empty($lastname) || empty($mobile) || empty($password)) {
        http_response_code(400);
        echo json_encode(["error" => "All fields are required"]);
        exit();
    }

    try {
        $name = $firstname . ' ' . $lastname;

        // Check if the user exists
        $stmt = $pdo->prepare("SELECT * FROM users WHERE mobile = :mobile");
        $stmt->execute(['mobile' => $mobile]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'User not found']);
            exit();
        }

        // Update the user's details
        $stmt = $pdo->prepare("UPDATE users SET name = :name, password = :password WHERE mobile = :mobile");
        $stmt->execute(['name' => $name, 'password' => $password, 'mobile' => $mobile]);

        echo json_encode(['success' => true, 'message' => 'User updated successfully']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'User update failed: ' . $e->getMessage()]);
    }
}

?>
