<?php
// Allow cross-origin requests from your app
header("Access-Control-Allow-Origin: *"); // Adjust origin as needed
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
// header("Content-Type: application/json");

include 'dbConnect.php';

// add option to get all doctors





// prepare SQL to get all users
// check doctor is blocked or not (1/0) if not blocked then fetch schedule of today
$query = $pdo->prepare("SELECT d.id, d.name, d.dept, d.fee, d.fee2,sd.time1,sd.time2,sd.maxopd, sd.date FROM doctor d join schedule_dr sd on d.id = sd.drid where sd.blocked = 0 and sd.date = CURDATE()");


// execute the query
$query->execute();


// fetch all the results
$users = $query->fetchAll(PDO::FETCH_ASSOC);

// return the results as JSON

echo json_encode($users);

?>