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

    $query = $conn->prepare("
        SELECT *
        FROM utilizadores
        WHERE email = ?
    ");

    $query->execute([
        $data->email
    ]);

    if($query->rowCount() == 0){

        echo json_encode([
            "success" => false,
            "message" => "Email inválido"
        ]);

        exit;
    }

    $user = $query->fetch(PDO::FETCH_ASSOC);

    if(!password_verify($data->password, $user['password'])){

        echo json_encode([
            "success" => false,
            "message" => "Senha inválida"
        ]);

        exit;
    }

    unset($user['password']);

    echo json_encode([

        "success" => true,
        "user" => $user
    ]);

} catch(Exception $e){

    echo json_encode([

        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>