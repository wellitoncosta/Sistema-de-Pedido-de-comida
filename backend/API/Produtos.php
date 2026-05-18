<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/database.php";

$database = new Database();
$conn = $database->connect();

$method = $_SERVER['REQUEST_METHOD'];

switch($method){

    case 'GET':

        $query = $conn->prepare("
            SELECT * FROM produtos
            ORDER BY id DESC
        ");

        $query->execute();

        echo json_encode($query->fetchAll(PDO::FETCH_ASSOC));

    break;

    case 'POST':

        $data = json_decode(file_get_contents("php://input"));

        $query = $conn->prepare("
            INSERT INTO produtos(nome,descricao,preco,imagem,categoria)
            VALUES(?,?,?,?,?)
        ");

        $result = $query->execute([
            $data->nome,
            $data->descricao,
            $data->preco,
            $data->imagem,
            $data->categoria
        ]);

        echo json_encode([
            "success" => $result
        ]);

    break;

    case 'PUT':

        $data = json_decode(file_get_contents("php://input"));

        $query = $conn->prepare("
            UPDATE produtos
            SET nome=?, descricao=?, preco=?, imagem=?, categoria=?
            WHERE id=?
        ");

        $result = $query->execute([
            $data->nome,
            $data->descricao,
            $data->preco,
            $data->imagem,
            $data->categoria,
            $data->id
        ]);

        echo json_encode([
            "success" => $result
        ]);

    break;

    case 'DELETE':

        $id = $_GET['id'];

        $query = $conn->prepare("
            DELETE FROM produtos
            WHERE id=?
        ");

        $result = $query->execute([$id]);

        echo json_encode([
            "success" => $result
        ]);

    break;
}
?>