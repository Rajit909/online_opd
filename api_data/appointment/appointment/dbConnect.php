<?php 
$host = 'localhost'; //hostname
$user = 'root'; //username
$password = ''; //database password
$database = 'appointments_data'; //database name
// $charset = 'utf8mb4'; //charset

$dsn = "mysql:host=$host;dbname=$database;";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];  

try{
    $pdo = new PDO($dsn, $user, $password, $options);
    // echo "Connected successfully";
}catch(\PDOException $e){
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

?>