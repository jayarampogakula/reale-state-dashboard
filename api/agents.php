<?php
require 'config.php';

$headers = apache_request_headers();
$token = str_replace("Bearer ", "", $headers['Authorization']);
$user = (array) verifyToken($token);

if (!in_array($user['role'], ["companyadmin","superadmin"])) { die("Access denied"); }

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $hash = password_hash($data['password'], PASSWORD_DEFAULT);
    $pdo->prepare("INSERT INTO users (username, password_hash, role, company_id) VALUES (?, ?, 'agent', ?)")
        ->execute([$data['username'], $hash, $user['company_id']]);
    echo json_encode(["message" => "Agent created"]);
}

if ($method === "GET") {
    $stmt = $pdo->prepare("SELECT id, username FROM users WHERE company_id=? AND role='agent'");
    $stmt->execute([$user['company_id']]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
