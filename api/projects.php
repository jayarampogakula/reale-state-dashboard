<?php
require 'config.php';

$headers = apache_request_headers();
if (!isset($headers['Authorization'])) { die("Unauthorized"); }
$token = str_replace("Bearer ", "", $headers['Authorization']);
$user = (array) verifyToken($token);

if (!in_array($user['role'], ["companyadmin","superadmin"])) {
    http_response_code(403);
    echo json_encode(["error" => "Access denied"]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "POST") {
    // Create new project
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $pdo->prepare("INSERT INTO projects (company_id, name, location, price_range, amenities) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$user['company_id'], $data['name'], $data['location'], $data['price_range'], $data['amenities']]);
    echo json_encode(["message" => "Project created"]);
}

if ($method === "GET") {
    // List projects for this company
    $stmt = $pdo->prepare("SELECT * FROM projects WHERE company_id=?");
    $stmt->execute([$user['company_id']]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

if ($method === "PUT") {
    // Update project
    parse_str(file_get_contents("php://input"), $data);
    $stmt = $pdo->prepare("UPDATE projects SET name=?, location=?, price_range=?, amenities=? WHERE id=? AND company_id=?");
    $stmt->execute([$data['name'], $data['location'], $data['price_range'], $data['amenities'], $data['id'], $user['company_id']]);
    echo json_encode(["message" => "Project updated"]);
}

if ($method === "DELETE") {
    // Delete project
    parse_str(file_get_contents("php://input"), $data);
    $stmt = $pdo->prepare("DELETE FROM projects WHERE id=? AND company_id=?");
    $stmt->execute([$data['id'], $user['company_id']]);
    echo json_encode(["message" => "Project deleted"]);
}
