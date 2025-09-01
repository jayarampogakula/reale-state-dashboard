<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'];
$password = $data['password'];

$stmt = $pdo->prepare("SELECT * FROM users WHERE username=? LIMIT 1");
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid credentials"]);
    exit;
}

$payload = [
    "id" => $user['id'],
    "role" => $user['role'],         // superadmin, companyadmin, agent
    "company_id" => $user['company_id'],
    "exp" => time() + 60*60*12
];

$token = createToken($payload);
echo json_encode(["token" => $token, "role" => $user['role'], "company_id" => $user['company_id']]);
