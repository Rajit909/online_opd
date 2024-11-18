<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
include 'dbConnect.php';

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $firstname = $_POST['firstname'];
    $lastname = $_POST['lastname'];
    $mobile = $_POST['mobile'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);//hash the password

    // check if all fields are provided
    if(empty($firstname) || empty($lastname) || empty($mobile) || empty($password)){
        http_response_code(400);
    echo json_encode(["error" => "All fields are required"]);
    exit();
    }

    try{
        $stmt = $pdo->prepare("INSERT INTO users (firstname, lastname, mobile, password) VALUES (:firstname, :lastname, :mobile, :password)");
        $stmt->execute(['firstname' => $firstname, 'lastname' => $lastname, 'mobile'=> $mobile, 'password' => $password]);
        echo json_encode(['success'=> true, 'message' => 'User created successfully']);
    }catch(PDOException $e){
        echo json_encode(['success'=> false, 'message' => 'User creation failed'] . $e->getMessage());
    }
}

?>