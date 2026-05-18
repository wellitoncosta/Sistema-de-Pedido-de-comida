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

$data = json_decode(file_get_contents("php://input"));

if(
    empty($data->nome) ||
    empty($data->email) ||
    empty($data->password)
){
    echo json_encode([
        "success" => false,
        "message" => "Preencha todos os campos"
    ]);
    exit;
}

try {

    $database = new Database();
    $conn = $database->connect();

    $check = $conn->prepare("
        SELECT id
        FROM utilizadores
        WHERE email = ?
    ");

    $check->execute([$data->email]);

    if($check->rowCount() > 0){

        echo json_encode([
            "success" => false,
            "message" => "Email já existe"
        ]);

        exit;
    }

    $passwordHash = password_hash(
        $data->password,
        PASSWORD_DEFAULT
    );

    $query = $conn->prepare("
        INSERT INTO utilizadores(
            nome,
            email,
            password,
            role
        )
        VALUES(?,?,?,?)
    ");

    $result = $query->execute([
        $data->nome,
        $data->email,
        $passwordHash,
        'cliente'
    ]);

    echo json_encode([
        "success" => $result,
        "message" => "Conta criada"
    ]);

} catch(Exception $e){

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>