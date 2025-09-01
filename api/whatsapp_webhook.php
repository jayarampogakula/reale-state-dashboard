<?php
require 'config.php';
use Twilio\Rest\Client;

$from = $_POST['From'] ?? "";
$body = strtolower(trim($_POST['Body'] ?? ""));
$phone = str_replace("whatsapp:", "", $from);

// Find lead
$stmt = $pdo->prepare("SELECT * FROM leads WHERE phone=? LIMIT 1");
$stmt->execute([$phone]);
$lead = $stmt->fetch(PDO::FETCH_ASSOC);

if ($lead) {
    if ($body === "yes") {
        $pdo->prepare("UPDATE leads SET outcome='Buyer confirmed visit', status='Hot' WHERE id=?")
            ->execute([$lead['id']]);
    } elseif ($body === "no") {
        $pdo->prepare("UPDATE leads SET outcome='Buyer declined visit', status='Cold' WHERE id=?")
            ->execute([$lead['id']]);
    } else {
        // Call OpenAI API (FAQ auto-reply)
        $client = new \GuzzleHttp\Client();
        $res = $client->post('https://api.openai.com/v1/chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer ' . $_ENV['OPENAI_API_KEY'],
                'Content-Type' => 'application/json'
            ],
            'json' => [
                "model" => "gpt-4",
                "messages" => [["role" => "user", "content" => $body]],
                "max_tokens" => 100
            ]
        ]);
        $reply = json_decode($res->getBody(), true)['choices'][0]['message']['content'];

        // Send reply via Twilio
        $twilio = new Client($_ENV['TWILIO_SID'], $_ENV['TWILIO_AUTH']);
        $twilio->messages->create("whatsapp:$phone", [
            "from" => $_ENV['TWILIO_WHATSAPP'],
            "body" => $reply
        ]);
    }
}
