<?php

header('Content-Type: application/json');

require_once __DIR__ . '/reylo-config.php';

$url = BP_API_URL . '/reseller-api/connections?page=1&per_page=100';

$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Authorization: Bearer ' . BP_API_TOKEN
    ]
]);

$response = curl_exec($ch);

$curlError = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

if ($curlError) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $curlError
    ]);

    exit;
}

if ($httpCode < 200 || $httpCode >= 300) {

    http_response_code($httpCode);

    echo json_encode([
        'success' => false,
        'error' => 'BP Panel returned HTTP ' . $httpCode,
        'panel_response' => $response
    ]);

    exit;
}

$data = json_decode($response, true);

if (!is_array($data)) {

    echo json_encode([
        'success' => false,
        'error' => 'Invalid response from BP Panel',
        'raw' => $response
    ]);

    exit;
}

echo json_encode([
    'success' => true,
    'total' => $data['total'] ?? 0,
    'filtered' => $data['filtered'] ?? 0,
    'connections' => $data['items'] ?? []
]);
