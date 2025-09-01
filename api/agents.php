<?php
require 'config.php';

$headers = apache_request_headers();
if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}
$token = str_replace("Bearer ", "", $headers['Authorization']);
$user = (array) verifyToken($token);

if (!in_array($user['role'], ["companyadmin", "superadmin"])) {
    http_response_code(403);
    echo json_encode(["error" => "Access denied"]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET") {
    $stmt = $pdo->prepare("SELECT id, username FROM users WHERE company_id=? AND role='agent'");
    $stmt->execute([$user['company_id']]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($method === "POST" && !isset($_GET['action'])) {
    $data = json_decode(file_get_contents("php://input"), true);
    $hash = password_hash($data['password'], PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (username, password_hash, role, company_id) VALUES (?, ?, 'agent', ?)");
    $stmt->execute([$data['username'], $hash, $user['company_id']]);
    echo json_encode(["message" => "Agent created"]);
    exit;
}

if ($method === "POST" && $_GET['action'] === "reset" && isset($_GET['id'])) {
    $data = json_decode(file_get_contents("php://input"), true);
    $hash = password_hash($data['password'], PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("UPDATE users SET password_hash=? WHERE id=? AND company_id=? AND role='agent'");
    $stmt->execute([$hash, $_GET['id'], $user['company_id']]);
    echo json_encode(["message" => "Password reset"]);
    exit;
}

if ($method === "DELETE" && isset($_GET['id'])) {
    $stmt = $pdo->prepare("DELETE FROM users WHERE id=? AND company_id=? AND role='agent'");
    $stmt->execute([$_GET['id'], $user['company_id']]);
    echo json_encode(["message" => "Agent deleted"]);
    exit;
}
