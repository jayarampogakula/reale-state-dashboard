<?php
require 'config.php';

$headers = apache_request_headers();
$token = str_replace("Bearer ", "", $headers['Authorization']);
$user = (array) verifyToken($token);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET") {
    if ($user['role'] === "agent") {
        $stmt = $pdo->prepare("SELECT * FROM leads WHERE assigned_to=?");
        $stmt->execute([$user['id']]);
    } elseif ($user['role'] === "companyadmin") {
        $stmt = $pdo->prepare("SELECT * FROM leads WHERE company_id=?");
        $stmt->execute([$user['company_id']]);
    } else {
        $stmt = $pdo->query("SELECT * FROM leads");
    }
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
