<?php
require 'config.php';
use Twilio\Rest\Client;

// Buyer message
$from = $_POST['From'] ?? "";
$body = strtolower(trim($_POST['Body'] ?? ""));
$phone = str_replace("whatsapp:", "", $from);

// Find lead
$stmt = $pdo->prepare("SELECT * FROM leads WHERE phone=? LIMIT 1");
$stmt->execute([$phone]);
$lead = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$lead) exit;

// YES / NO flow
if ($body === "yes") {
    $pdo->prepare("UPDATE leads SET outcome='Buyer confirmed visit', status='Hot' WHERE id=?")
        ->execute([$lead['id']]);
    exit;
}
if ($body === "no") {
    $pdo->prepare("UPDATE leads SET outcome='Buyer declined visit', status='Cold' WHERE id=?")
        ->execute([$lead['id']]);
    exit;
}

// Free-text → fetch project details for this company
$projectStmt = $pdo->prepare("SELECT * FROM projects WHERE company_id=? LIMIT 1");
$projectStmt->execute([$lead['company_id']]);
$project = $projectStmt->fetch(PDO::FETCH_ASSOC);

// Build GPT prompt
$prompt = "Project: {$project['name']}\n"
        . "Location: {$project['location']}\n"
        . "Price: {$project['price_range']}\n"
        . "Amenities: {$project['amenities']}\n\n"
        . "Buyer asked: \"$body\"";

// Call OpenAI API
$client = new \GuzzleHttp\Client();
$res = $client->post('https://api.openai.com/v1/chat/completions', [
    'headers' => [
        'Authorization' => 'Bearer ' . $_ENV['OPENAI_API_KEY'],
        'Content-Type' => 'application/json'
    ],
    'json' => [
        "model" => "gpt-4",
        "messages" => [
            ["role" => "system", "content" => "You are an AI assistant for a real estate company. Answer politely & briefly."],
            ["role" => "user", "content" => $prompt]
        ],
        "max_tokens" => 150
    ]
]);
$reply = json_decode($res->getBody(), true)['choices'][0]['message']['content'];

// Send reply back via Twilio
$twilio = new Client($_ENV['TWILIO_SID'], $_ENV['TWILIO_AUTH']);
$twilio->messages->create("whatsapp:$phone", [
    "from" => $_ENV['TWILIO_WHATSAPP'],
    "body" => $reply
]);


$projectStmt = $pdo->prepare("SELECT * FROM projects WHERE id=? LIMIT 1");
$projectStmt->execute([$lead['project_id']]);
$project = $projectStmt->fetch(PDO::FETCH_ASSOC);

if ($project) {
    $prompt = "Project: {$project['name']}\n"
            . "Location: {$project['location']}\n"
            . "Price: {$project['price_range']}\n"
            . "Amenities: {$project['amenities']}\n\n"
            . "Buyer asked: \"$body\"";
} else {
    $prompt = "Buyer asked: \"$body\" (No project linked)";
}
