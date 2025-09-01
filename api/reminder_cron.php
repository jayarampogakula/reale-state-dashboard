<?php
require 'config.php';
use Twilio\Rest\Client;

$twilio = new Client($_ENV['TWILIO_SID'], $_ENV['TWILIO_AUTH']);

// Site visit reminders (1 day before)
$stmt = $pdo->query("SELECT * FROM leads WHERE site_visit_date IS NOT NULL");
foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $lead) {
    $visit = strtotime($lead['site_visit_date']);
    if (time() + 86400 > $visit && time() < $visit) {
        $twilio->messages->create("whatsapp:" . $lead['phone'], [
            "from" => $_ENV['TWILIO_WHATSAPP'],
            "body" => "Reminder: Your site visit is scheduled for tomorrow at " . date("H:i", $visit)
        ]);
    }
}
