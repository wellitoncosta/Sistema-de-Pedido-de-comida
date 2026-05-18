<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config/database.php";

$database = new Database();
$conn = $database->connect();

if($_SERVER['REQUEST_METHOD'] == 'POST'){

    $data = json_decode(
        file_get_contents("php://input")
    );

    $query = $conn->prepare("
        INSERT INTO pedidos(
            utilizador_id,
            items_json,
            total
        )
        VALUES(?,?,?)
    ");

    $query->execute([

        $data->utilizador_id,
        $data->items_json,
        $data->total
    ]);

    echo json_encode([
        "success" => true
    ]);
}

if($_SERVER['REQUEST_METHOD'] == 'GET'){

    $query = $conn->prepare("
        SELECT *
        FROM pedidos
        ORDER BY id DESC
    ");

    $query->execute();

    $pedidos =
    $query->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($pedidos);
}
?>