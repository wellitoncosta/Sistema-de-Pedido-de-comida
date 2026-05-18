<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
http_response_code(200);

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit();
}

try {

require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"));

if(!isset($data->step)){
    echo json_encode([
        "success" => false,
        "message" => "Dados inválidos"
    ]);
    exit;
}

$database = new Database();
$conn = $database->connect();

$file = "../storage/recovery_codes.json";

if(!file_exists($file)){
    file_put_contents($file, json_encode([]));
}

$codes = json_decode(file_get_contents($file), true);

if($data->step == 1){

    $email = trim($data->email);

    $query = $conn->prepare("
        SELECT id
        FROM utilizadores
        WHERE email = ?
    ");

    $query->execute([$email]);

    if($query->rowCount() == 0){

        echo json_encode([
            "success" => false,
            "message" => "Email não encontrado"
        ]);

        exit;
    }

    $codigo = rand(100000,999999);

    $codes[] = [

        "email" => $email,
        "codigo" => $codigo,
        "usado" => false,
        "criado_em" => date("Y-m-d H:i:s")
    ];

    file_put_contents(
        $file,
        json_encode($codes, JSON_PRETTY_PRINT)
    );

    echo json_encode([

        "success" => true,
        "message" => "Código gerado",
        "codigo" => $codigo
    ]);

    exit;
}

if($data->step == 2){

    $codigo = trim($data->codigo);

    $encontrado = false;
    $email = '';

    foreach($codes as &$item){

        if(
            $item['codigo'] == $codigo &&
            $item['usado'] == false
        ){

            $item['usado'] = true;

            $email = $item['email'];

            $encontrado = true;

            break;
        }
    }

    if(!$encontrado){

        echo json_encode([
            "success" => false,
            "message" => "Código inválido ou já utilizado"
        ]);

        exit;
    }

    file_put_contents(
        $file,
        json_encode($codes, JSON_PRETTY_PRINT)
    );

    echo json_encode([

        "success" => true,
        "email" => $email
    ]);

    exit;
}

if($data->step == 3){

    $email = trim($data->email);
    $novaSenha = trim($data->novaSenha);

    if(!$novaSenha || strlen($novaSenha) < 6){

        echo json_encode([
            "success" => false,
            "message" => "Senha deve ter pelo menos 6 caracteres"
        ]);

        exit;
    }

    $hash = password_hash(
        $novaSenha,
        PASSWORD_DEFAULT
    );

    $update = $conn->prepare("
        UPDATE utilizadores
        SET password = ?
        WHERE email = ?
    ");

    $result = $update->execute([
        $hash,
        $email
    ]);

    echo json_encode([

        "success" => $result,
        "message" => "Senha alterada com sucesso"
    ]);

    exit;
}

} catch(Exception $e){

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

?>
