<?php
// Allow cross-origin requests from your app
header("Access-Control-Allow-Origin: *"); // Adjust origin as needed
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
// header("Content-Type: application/json");

include 'dbConnect.php';

// prepare SQL to get all users
$query = $pdo->prepare("SELECT date FROM schedule_dr where blocked = 0");


// execute the query
$query->execute();


// fetch all the results
$users = $query->fetchAll(PDO::FETCH_ASSOC);

// return the results as JSON
echo json_encode($users);

?>

