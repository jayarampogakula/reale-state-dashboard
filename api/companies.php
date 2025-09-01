<?php
require 'config.php';

$headers = apache_request_headers();
if (!isset($headers['Authorization'])) { die("Unauthorized"); }
$token = str_replace("Bearer ", "", $headers['Authorization']);
$user = (array) verifyToken($token);

if ($user['role'] !== "superadmin") { die("Access denied"); }

$data = json_decode(file_get_contents("php://input"), true);

$pdo->prepare("INSERT INTO companies (name) VALUES (?)")->execute([$data['company_name']]);
$company_id = $pdo->lastInsertId();

$hash = password_hash($data['admin_password'], PASSWORD_DEFAULT);
$pdo->prepare("INSERT INTO users (username, password_hash, role, company_id) VALUES (?, ?, 'companyadmin', ?)")
    ->execute([$data['admin_username'], $hash, $company_id]);

echo json_encode(["message" => "Company created", "company_id" => $company_id]);
