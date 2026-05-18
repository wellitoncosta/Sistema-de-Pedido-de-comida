<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config/database.php";

$database = new Database();

$conn = $database->connect();

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$email = $data['email'] ?? '';

if(empty($email)){

    echo json_encode([
        "success"=>false,
        "message"=>"Email obrigatório"
    ]);

    exit;
}

$stmt = $conn->prepare(
    "SELECT * FROM utilizadores
     WHERE email=?"
);

$stmt->execute([$email]);

$user = $stmt->fetch();

if(!$user){

    echo json_encode([
        "success"=>false,
        "message"=>"Email não encontrado"
    ]);

    exit;
}

$codigo = rand(1000,9999);

$arquivo =
__DIR__ .
"/../storage/recovery_codes.json";

$codigos = [];

if(file_exists($arquivo)){

    $codigos = json_decode(

        file_get_contents($arquivo),
        true

    ) ?: [];
}

$codigos[$email] = $codigo;

file_put_contents(

    $arquivo,

    json_encode($codigos)
);

error_log(
    "Código {$email}: {$codigo}"
);

echo json_encode([

    "success"=>true,

    "message"=>"Código enviado"
]);