<?php

header('Content-Type: application/json');

require_once '../private/reylo-config.php';


/*
    The exact payload depends on your IPTV panel API.

    We would tell the panel:
    - Create a trial
    - Auto-generate username
    - Auto-generate password
*/

$payload = [

    'trial' => true

];


$ch = curl_init();

curl_setopt(
    $ch,
    CURLOPT_URL,
    REYLO_API_URL . '/lines'
);

curl_setopt(
    $ch,
    CURLOPT_POST,
    true
);

curl_setopt(
    $ch,
    CURLOPT_POSTFIELDS,
    json_encode($payload)
);

curl_setopt(
    $ch,
    CURLOPT_HTTPHEADER,
    [
        'Authorization: Bearer ' . REYLO_API_TOKEN,
        'Content-Type: application/json'
    ]
);

curl_setopt(
    $ch,
    CURLOPT_RETURNTRANSFER,
    true
);


$response = curl_exec($ch);

$httpCode = curl_getinfo(
    $ch,
    CURLINFO_HTTP_CODE
);

curl_close($ch);


if ($httpCode >= 200 && $httpCode < 300) {

    $panel = json_decode($response, true);

    echo json_encode([

        'success' => true,

        'username' =>
            $panel['username'] ?? '',

        'password' =>
            $panel['password'] ?? '',

        'expiry' =>
            $panel['expires'] ?? null

    ]);

} else {

    echo json_encode([

        'success' => false,

        'error' => 'Panel rejected the request',

        'status' => $httpCode

    ]);

}
