<?php
require 'config.php';

$headers = apache_request_headers();
$token = str_replace("Bearer ", "", $headers['Authorization']);
$user = (array) verifyToken($token);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET") {
    if ($user['role'] === "agent") {
        $stmt = $pdo->prepare("
            SELECT leads.*, projects.name as project_name, users.username as agent_name
            FROM leads
            LEFT JOIN projects ON leads.project_id = projects.id
            LEFT JOIN users ON leads.assigned_to = users.id
            WHERE leads.assigned_to=?
        ");
        $stmt->execute([$user['id']]);
    } elseif ($user['role'] === "companyadmin") {
        $stmt = $pdo->prepare("
            SELECT leads.*, projects.name as project_name, users.username as agent_name
            FROM leads
            LEFT JOIN projects ON leads.project_id = projects.id
            LEFT JOIN users ON leads.assigned_to = users.id
            WHERE leads.company_id=?
        ");
        $stmt->execute([$user['company_id']]);
    } else {
        $stmt = $pdo->query("
            SELECT leads.*, projects.name as project_name, users.username as agent_name
            FROM leads
            LEFT JOIN projects ON leads.project_id = projects.id
            LEFT JOIN users ON leads.assigned_to = users.id
        ");
    }
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    $stmt = $pdo->prepare("INSERT INTO leads (name, phone, budget, timeline, status, outcome, company_id, assigned_to, project_id, site_visit_date, payment_due_date)
                           VALUES (?, ?, ?, ?, 'New', '', ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['name'], $data['phone'], $data['budget'], $data['timeline'],
        $user['company_id'], $data['assigned_to'] ?? null, $data['project_id'] ?? null,
        $data['site_visit_date'] ?? null, $data['payment_due_date'] ?? null
    ]);

    echo json_encode(["message" => "Lead created"]);
}
if ($method === "GET") {
    if ($user['role'] === "agent") {
        $stmt = $pdo->prepare("SELECT leads.*, projects.name as project_name 
                               FROM leads LEFT JOIN projects ON leads.project_id=projects.id
                               WHERE leads.assigned_to=?");
        $stmt->execute([$user['id']]);
    } elseif ($user['role'] === "companyadmin") {
        $stmt = $pdo->prepare("SELECT leads.*, projects.name as project_name 
                               FROM leads LEFT JOIN projects ON leads.project_id=projects.id
                               WHERE leads.company_id=?");
        $stmt->execute([$user['company_id']]);
    } else {
        $stmt = $pdo->query("SELECT leads.*, projects.name as project_name 
                             FROM leads LEFT JOIN projects ON leads.project_id=projects.id");
    }
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
