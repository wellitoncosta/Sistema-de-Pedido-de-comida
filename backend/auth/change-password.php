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

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$email = $data['email'] ?? '';
$codigo = $data['codigo'] ?? '';
$senhaAtual = $data['senhaAtual'] ?? '';
$novaSenha = $data['novaSenha'] ?? '';
$confirmarSenha = $data['confirmarSenha'] ?? '';

if(
    empty($email) ||
    empty($codigo) ||
    empty($senhaAtual) ||
    empty($novaSenha) ||
    empty($confirmarSenha)
){
    echo json_encode([
        "success"=>false,
        "message"=>"Preencha todos os campos"
    ]);
    exit;
}

if($novaSenha !== $confirmarSenha){

    echo json_encode([
        "success"=>false,
        "message"=>"As senhas não coincidem"
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
        "message"=>"Usuário não encontrado"
    ]);
    exit;
}

$arquivo = __DIR__ . "/../storage/recovery_codes.json";

$codigos = [];

if(file_exists($arquivo)){

    $codigos = json_decode(
        file_get_contents($arquivo),
        true
    ) ?: [];
}

if(
    !isset($codigos[$email])
    ||
    $codigos[$email] != $codigo
){

    echo json_encode([
        "success"=>false,
        "message"=>"Código inválido"
    ]);
    exit;
}

if(
    !password_verify(
        $senhaAtual,
        $user['password']
    )
){

    echo json_encode([
        "success"=>false,
        "message"=>"Senha atual incorreta"
    ]);
    exit;
}

$hash = password_hash(
    $novaSenha,
    PASSWORD_DEFAULT
);

$update = $conn->prepare(
    "UPDATE utilizadores
     SET password=?
     WHERE email=?"
);

$update->execute([
    $hash,
    $email
]);

unset($codigos[$email]);

file_put_contents(
    $arquivo,
    json_encode($codigos)
);

echo json_encode([
    "success"=>true,
    "message"=>"Senha alterada"
]);