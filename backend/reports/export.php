<?php

header("Content-Type: text/csv");
header("Content-Disposition: attachment; filename=historico_pedidos.csv");

require_once "../config/database.php";

$database = new Database();
$conn = $database->connect();

$query = $conn->prepare("
    SELECT 
        pedidos.id,
        utilizadores.nome AS cliente,
        produtos.nome AS produto,
        pedidos.quantidade,
        pedidos.total,
        pedidos.status_pedido,
        pedidos.created_at
    FROM pedidos
    INNER JOIN utilizadores
    ON pedidos.utilizador_id = utilizadores.id
    INNER JOIN produtos
    ON pedidos.produto_id = produtos.id
");

$query->execute();

$output = fopen("php://output", "w");

fputcsv($output, [
    'ID',
    'Cliente',
    'Produto',
    'Quantidade',
    'Total',
    'Status',
    'Data'
]);

while($row = $query->fetch(PDO::FETCH_ASSOC)){

    fputcsv($output, $row);
}

fclose($output);
?>