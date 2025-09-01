<?php
require 'config.php';

// --- Auth check ---
$headers = apache_request_headers();
if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}
$token = str_replace("Bearer ", "", $headers['Authorization']);
$user = (array) verifyToken($token);

if ($user['role'] !== "superadmin") {
    http_response_code(403);
    echo json_encode(["error" => "Access denied"]);
    exit;
}

// --- Handle GET: list companies ---
if ($_SERVER['REQUEST_METHOD'] === "GET") {
    $stmt = $pdo->query("SELECT id, name, created_at FROM companies");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

// --- Handle POST: create company + company admin ---
if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['company_name']) || empty($data['admin_username']) || empty($data['admin_password'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing fields"]);
        exit;
    }

    try {
        $pdo->beginTransaction();

        // Insert company
        $stmt = $pdo->prepare("INSERT INTO companies (name) VALUES (?)");
        $stmt->execute([$data['company_name']]);
        $company_id = $pdo->lastInsertId();

        // Insert company admin
        $hash = password_hash($data['admin_password'], PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (username, password_hash, role, company_id) VALUES (?, ?, 'companyadmin', ?)");
        $stmt->execute([$data['admin_username'], $hash, $company_id]);

        $pdo->commit();

        echo json_encode([
            "message" => "Company & admin created",
            "company_id" => $company_id
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["error" => "Failed to create company: " . $e->getMessage()]);
    }
}
